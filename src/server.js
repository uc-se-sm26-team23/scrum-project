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

// CSP Header
app.use((req, res, next) => {
  res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; \
      script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://code.jquery.com; \
      style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; \
      connect-src 'self';"
  );
  next();
});

app.use(express.static(path.join(__dirname, 'ui')));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log('Server running on port ' + PORT));

// In-memory store: socketId → username
const userlist = new Map();

// variable to hold the message id
var messageId = 0;

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
  socket.on('message', (data) => {
    // AC-01.2: ignore empty messages
    if (!data || data.trim() === '') return;
    // AC-01.2 + AC-01.5: Broadcast to all clients with sender username
    const sender = userlist.get(socket.id);
    messageId += 1;
    console.log(`Debug> "${sender}" sent: ${data}, id: ${messageId}`);
    io.emit('message', {message: sender + ': ' + data.trim(), id: messageId});
  });

  // Handles private messages
  socket.on('privateMessage', (data) => {
    const sender = userlist.get(socket.id);

    // If user is private-chatting with themselves, emit only once
    if (data.to === socket.id) {
      socket.emit('privateMessage', {
        from: sender,
        fromSocket: socket.id,
        toSocket: socket.id,
        message: data.message,
        self: true
      });
      return;
    }

    // Sends the message to the recipient
    io.to(data.to).emit('privateMessage', {
      from: sender,
      fromSocket: socket.id,
      message: data.message
    });

    // Sends a copy back to the sender
    socket.emit("privateMessage", {
      from: sender,
      toSocket: data.to,
      message: data.message,
      self: true
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
    const username = userlist.get(socket.id);
    socket.broadcast.emit('stopTyping', username); // If a user is disconnected while typing, their indicator is removed from all other connected users
    userlist.delete(socket.id);
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

    io.emit('userList', users);
  });
});
