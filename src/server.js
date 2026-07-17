// =============================================================================
// EECE/CS 3093C Software Engineering — Lab 1
// server.js — code skeleton provided by Phu Phung
// complete implementation by Team 23
// =============================================================================
const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const path       = require('path');
const app    = express();
const server = http.createServer(app);
const io     = new Server(server);
const messengerdb = require('./messengerdb');

// CSP Header - Browser Level Defense-In-Depth
app.use((req, res, next) => {
  res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; \
      script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://code.jquery.com; \
      style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; \
      connect-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://code.jquery.com;"
  );
  next();
});

app.use(express.static(path.join(__dirname, 'ui')));

const PORT = process.env.PORT || 8080;

// connect to db
(async () => {
  try {
    await messengerdb.connect();
    server.listen(PORT, () =>
    console.log('Server running on port ' + PORT));
  } catch (err) {
    console.log('Error>server.js: failed to start - database connection error', err);
    process.exit(1); //fail fast - avoid running server that cant authenticate users
  }
}) ();

// server.listen(PORT, () => console.log('Server running on port ' + PORT));


// In-memory store: socketId → username
const userlist = new Map();

// variable to hold the message id
var messageId = 0;





// =============================================================
// Use-Case-04: Authorize User
// returns true if this connections was authenticated by Join Chat
// =============================================================
function isUserAuthorized(socket) {
  if (!socket || !socket.authenticated) {
    console.log('Connection has not been authenticated');
  }
  return socket.authenticated === true;
}

// =============================================================
// Helper: send an event only to authenticated connections
// =============================================================
function sendToAuthenticatedClients(event, data) {
  userlist.forEach((_, sid) => {
    const s = io.sockets.sockets.get(sid);
    if (s && isUserAuthorized(s)) {
      s.emit(event, data);
    }
  })
}




io.on('connection', (socket) => {

  // AC-02.02 - Auto-assign a unique username from the socket ID
  socket.on("set username", (username) => {
    socket.username = username; // Store on the socket object
    userlist.set(socket.id, username);
    console.log(`Socket ${socket.id} updated username to: ${username}`);
    io.emit(
        "status",
        username + " joined the chat. Number of connected clients: " + userlist.size
    );
    
    const users = [];

    for (const [socketId, username] of userlist) {
      users.push({
        socketId,
        username
      });
    };

    io.emit('userList', users);
  });


  // ---------------------------------------------------------------------------
  // Use-Case-01: Send message
  //
  // AC-01.1: Given that I am in chat window, When I tap the 'send' button, Then the app shows my message as sent in the chat window.
  // AC-01.2: empty or non-string messages are ignored — no broadcast is sent
  // AC-01.5: Given that I have sent a message to the chat window, when the message appears my username should show up alongside it.
  // AC-01.6: Given that only I am typing, I should not be notified that there are any users typing.
  // AC-01.7: Given that a connected user is currently typing to the chat window, When they press any key, Then the typing indicator must appear at the bottom of the chat window.
  // AC-01.8: Given that a typing user's typing indicator is visible on other users' screen, When the typing user stops typing for more than a certain seconds or delete all texts, Then the typing indicator must disappear from other users' screen.
  // ---------------------------------------------------------------------------
  //Todo: code to implement the above use case and AC items
  socket.on('message', (message_text) => {
    // AC-01.2: ignore empty messages
    if (!message_text || message_text.trim() === '') return;
    // AC-01.2 + AC-01.5: Broadcast to all clients with sender username
    const sender = userlist.get(socket.id);
    messageId += 1;
    console.log(`Debug> "${sender}" sent: ${message_text}, id: ${messageId}`);
    io.emit('message', {message: sender + ': ' + message_text.trim(), id: messageId});
  });

  // Handles private messages
  socket.on('privateMessage', (data) => {
    const sender = userlist.get(socket.id);

    messageId += 1;

    // If user is private-chatting with themselves, emit only once
    if (data.to === socket.id) {
      socket.emit('privateMessage', {
        from: sender,
        fromSocket: socket.id,
        toSocket: socket.id,
        message: data.message,
        self: true,
        id: messageId
      });
      return;
    }

    // Sends the message to the recipient
    io.to(data.to).emit('privateMessage', {
      from: sender,
      fromSocket: socket.id,
      message: data.message,
      id: messageId
    });

    // Sends a copy back to the sender
    socket.emit("privateMessage", {
      from: sender,
      toSocket: data.to,
      message: data.message,
      self: true,
      id: messageId
    });
  });

  // AC-01.7: Typing indicator event is sent to connected users 
  socket.on('typing', () => {
    const username = userlist.get(socket.id);

    if (username) {
      socket.broadcast.emit('typing', username); // AC-01.6: The user typing is not notified that typing has started
    }
  })

  // AC-01.8: Typing indicator event is ended for all connected users
  socket.on('stopTyping', () => {
    const username = userlist.get(socket.id);

    if (username) {
      socket.broadcast.emit('stopTyping', username); // AC-01.6: The user who stopped typing does not receive the stopTyping socket emission
    }
  })


  // Sends the typing indicator to the client that another client is typing to
  socket.on('privateTyping', (data) => {

    if (data.to === socket.id) return;

    const sender = userlist.get(socket.id);

    io.to(data.to).emit('privateTyping', {
      from: sender,
      fromSocket: socket.id
    });

  });

  // Sends the privateStopTyping event to the user the client was typing to
  socket.on('privateStopTyping', (data) => {

    io.to(data.to).emit('privateStopTyping', {
      fromSocket: socket.id
    });
    
  });

  // edit message
  // data is {id: id, message: message}
  socket.on("edit", (data) => {
    console.log(`Debug> "${userlist.get(socket.id)}" edited to: ${data.message}, id: ${data.id}`);
    io.emit("edit", data);
  });

  // delete message
  // data is {id: id, username: username}
  socket.on("delete", (data) => {
    console.log(`Debug> "${data.username}" deleted, id: ${data.id}`);
    io.emit("delete", data);
  });

  // ---------------------------------------------------------------------------
  // Use-Case-02: Receive message — disconnect notification
  //
  // AC-02.2: all connected clients are notified when a user leaves
  // ---------------------------------------------------------------------------
  socket.on('disconnect', () => {
    
    const username = userlist.get(socket.id); // get username
    socket.broadcast.emit('stopTyping', username); // If a user is disconnected while typing, their indicator is removed from all other connected users
    
    userlist.delete(socket.id); // remove user from userlist
    console.log('Client disconnected - socket ID: ' + socket.id);
    
    // AC-02.2: Code to broadcast the status
    io.emit('status', username + ' left the chat. Number of connected clients: ' + userlist.size);

    const users = [];
    for (const [socketId, username] of userlist) {
      users.push({
        socketId,
        username
      });
    }

    io.emit('userList', users); // broadcasts updated userList
  });
});
