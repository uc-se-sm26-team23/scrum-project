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
// Use-Case-06 v2: Show ALL Registered Users
// =============================================================
async function AllUserList() {
  
  const allUsernames = await messengerdb.getAllUsers() // allUsernames = ["admin", "test", ...]

  /*
  // reverse lookup Map to track if user(s) are online: username → socketId
  // if a user has a socketId -> Online
  // else -> Offline
  
  OnlineMap use to hold ONLY users that are connected/online
  username1 → socketId1
  username2 → socketId2
  */
  const onlineMap = new Map(); 
  userlist.forEach((uname,sid) => onlineMap.set(uname, sid));

  /*
  if users in onlineMap -> true for Online Status & original 'socketId'
  else -> false for Offline Status & 'null' socketId
  */
  // merge DB Users with online/offline status
  const users = allUsernames.map(username => ({
    username,
    online: onlineMap.has(username), // true or false
    socketId: onlineMap.get(username) || null
  }));

  /*
  If both users status same -> Sort by alphabetically
  If both users x status -> Online users top, Offline users bot
  
  return value: 
    -1 -> user1 goes before user2
    1 -> user2 goes before user1
    0 -> stays the same
  
  */
  users.sort((user1, user2) => {
    
    // different status, check alphabetically
    if (user1.online === true  && user2.online === false) {
      return -1; // user1 goes first
    }

    if (user1.online === false && user2.online === true) {
      return 1;  // user2 goes first
    }
    // same status, check alphabetically
    return user1.username.localeCompare(user2.username);
  });

    // Only Authenticated Users received the updated list
    userlist.forEach((_, sid) => {
      const s = io.sockets.sockets.get(sid);
      if (s && isUserAuthorized(s)) {
        s.emit('userList', users);
    }
  });
}


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
// Helper(s): send an event only to authenticated connections
// =============================================================
function sendToAuthenticatedClients(event, data) {
  userlist.forEach((_, sid) => {
    const s = io.sockets.sockets.get(sid);
    if (s && isUserAuthorized(s)) {
      s.emit(event, data);
    }
  });
}




io.on('connection', (socket) => {

  // UC-09: authentication state per connection
  socket.authenticated = false;
  console.log('New client connected - socket ID: ' + socket.id )

  // =============================================================
  // Use-Case-08: Join Chat
  // =============================================================
  socket.on('join', async function({username, password}){
    // AC-08.2: server-side structural validation
    if (!username || typeof username !== 'string' ||
        !password || typeof password !== 'string' ||
        username.trim().length === 0              ||
        password.length === 0){
          socket.emit('join-error', 'Invalid request.');  // AC-08.4
          return;
        }
    username = username.trim();
    // AC-08.3: credential lookup - same result for unknown user or wrong password
    const user = await messengerdb.find(username,password);
    if (!user){
      // AC-08.3: generic message - does not reveal which field failed
      console.log(`Debug> Did NOT Pass MongoDB Validation`);
      socket.emit('join-error', 'Invalid username or password.'); // AC-08.4
      return;
    }
    console.log(`Debug> Passed MongoDB Validation`);

    // AC-08.5: mark connection as authenticated before any further response
    socket.authenticated = true;
    userlist.set(socket.id, username);

    socket.emit('join-success', username); // AC-08.6
    // AC-08.7: boardcast upadeted user list to authenticated connections only
    sendToAuthenticatedClients('status', username + ' joined the chat. Number of connected clients: ' + userlist.size);

    console.log('UC-08: user joined -', username, 
                '| authenticated connections: ', userlist.size);

    await AllUserList();

    // retrieve public chat messages
    let public_chat_history = await messengerdb.retrievePublicChat();
    // message is {_id, message, timestamp, sender}
    public_chat_history.forEach( (message) => { // TODO idk if this is efficient to send each message repeatedly instead of all at once?
      messageId++;
      //TODO add an edited field
      socket.emit("message", {message: message.sender + ": " + message.message, id: messageId, timestamp: message.timestamp});
    });
    console.log("Debug> Retrieved public chat messages, size: ", public_chat_history.length);

    // retrieve private chat messages
    let private_chat_history = await messengerdb.retrievePrivateChat(username);
    // emit to current socket
    private_chat_history.forEach( (message) => {
      messageId++;
      // TODO add an edited field
      if (message.sender === username) {
        socket.emit("privateMessage", {fromUser: message.sender, toUser: message.receiver, 
          message: message.message, self: true, id: messageId, timestamp: message.timestamp});
      } else {
        socket.emit("privateMessage", {fromUser: message.sender, toUser: message.receiver, 
          message: message.message, self: false, id: messageId, timestamp: message.timestamp});
      }
    });
    console.log("Debug> Retrieved private chat messages, size: ", private_chat_history.length);
  });

  // AC-02.02 - Auto-assign a unique username from the socket ID
  //socket.on("set username", (username) => {
  //  socket.username = username; // Store on the socket object
  //  userlist.set(socket.id, username);
  //  console.log(`Socket ${socket.id} updated username to: ${username}`);
  //  io.emit(
  //      "status",
  //      username + " joined the chat. Number of connected clients: " + userlist.size
  //  );
  //  
  //  const users = [];
//
  //  for (const [socketId, username] of userlist) {
  //    users.push({
  //      socketId,
  //      username
  //    });
  //  };
//
  //  io.emit('userList', users);
  //})

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
  socket.on('message', async (message_text) => {
    // AC-01.2: ignore empty messages
    if (!message_text || message_text.trim() === '') return;
    if (!isUserAuthorized(socket)) return;
    // AC-01.2 + AC-01.5: Broadcast to all clients with sender username
    const sender = userlist.get(socket.id);
    messageId += 1;
    console.log(`Debug> "${sender}" sent: ${message_text}, id: ${messageId}`);
    const message = {message: sender + ': ' + message_text.trim(), id: messageId, timestamp: Date.now()};
    sendToAuthenticatedClients('message' , message);

    // store public chats
    messengerdb.storePublicChat(sender, message_text.trim());
    console.log(`Debug> Chat '${sender}': '${message_text.trim()}' stored in MongoDB.`);
  });

  // Handles private messages
  // to is {socketId, username}
  socket.on('privateMessage', ({to, message}) => {
    const sender = userlist.get(socket.id);

    messageId += 1;

    // If user is private-chatting with themselves, emit only once
    if (to.socketId === socket.id) {
      socket.emit('privateMessage', {
        fromUser: sender,
        toUser: sender,
        message: message,
        self: true,
        id: messageId,
        timestamp: Date.now()
      });

      messengerdb.storePrivChat(sender, sender, message);
      console.log(`Debug> Private Chat stored in MongoDB.`);

      return;
    }

    // Sends the message to the recipient
    io.to(to.socketId).emit('privateMessage', {
      fromUser: sender,
      toUser: to.username,
      message: message,
      self: false,
      id: messageId,
      timestamp: Date.now()
    });

    // Sends a copy back to the sender
    socket.emit("privateMessage", {
      fromUser: sender,
      toUser: to.username,
      message: message,
      self: true,
      id: messageId,
      timestamp: Date.now()
    });

    messengerdb.storePrivChat(sender, to.username, message);
    console.log(`Debug> Private chat stored in MongoDB.`);

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
  socket.on("edit", ({id, message}) => {
    console.log(`Debug> "${userlist.get(socket.id)}" edited to: ${message}, id: ${id}`);
    // messengerdb.editChat()
    // TODO get proper input from client to edit the message in the db
    io.emit("edit", data);
  });

  // delete message
  // data is {id: id, username: username}
  socket.on("delete", (data) => {
    console.log(`Debug> "${data.username}" deleted, id: ${data.id}`);
    io.emit("delete", data);
  });

  socket.on('register', async function ({username, password}) {

    // AC-10.3: Server-side validation
    if (!username ||typeof username !== 'string' 
      || !password || typeof password !== 'string' 
      || username.trim().length == 0 || password.length == 0) {

      socket.emit('register-error', 'Invalid Request.');
      return;
    }

    username = username.trim();

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    const usernamePattern = /^\w{3,20}$/;
    
    // AC-10.4: Server-side re-validation Inputs Patterns
    if (!usernamePattern.test(username)) {
      socket.emit('register-error', 'Error: Username must be 3-20 characters (letters, numbers, underscore).');
      return; 
    }

    if (!passwordPattern.test(password)) {
      socket.emit('register-error', 'Error: Password must be at least 6 characters with letters and numbers.');
      return;
    }

    let result;
    try {
      // connect to database and register user
      result = await messengerdb.register(username, password)
    } catch (err) {

      socket.emit('register-error', 'Error: Server-side. Please Try Again.');
      return;
    }

    if (!result.success) {
      socket.emit('register-error', result.message);
      return;
    }

    socket.emit('register-success', username);
  });


    
// =============================================================
// Use-Case-0x: Edit Profile
// =============================================================
// =============================================================
  // Use-Case: Update Profile (Username / Password)
  // =============================================================
  socket.on("update-profile", async ({ currentUsername, newUsername, oldPassword, newPassword }) => {
    // 1. Ensure user is authorized
    if (!isUserAuthorized(socket)) {
      socket.emit("update-profile-error", "Unauthorized request.");
      return;
    }

    try {
      let updatedUsername = currentUsername;

      // 2. Handle Username Update
      if (newUsername && newUsername !== currentUsername) {
        const usernamePattern = /^\w{3,20}$/;
        if (!usernamePattern.test(newUsername)) {
          socket.emit("update-profile-error", "Invalid username format (3–20 characters: letters, numbers, underscores).");
          return;
        }

        const usernameResult = await messengerdb.updateUsername(currentUsername, newUsername);
        if (!usernameResult.success) {
          socket.emit("update-profile-error", usernameResult.message);
          return;
        }
        updatedUsername = newUsername;

        // Update in-memory userlist and broadcast refreshed user list
        for (let [sid, uname] of userlist.entries()) {
          if (uname === currentUsername) {
            userlist.set(sid, newUsername);
          }
        }
        await AllUserList();
      }

      // 3. Handle Password Update
      if (newPassword) {
        if (!oldPassword) {
          socket.emit("update-profile-error", "Old password is required to change password.");
          return;
        }

        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (!passwordPattern.test(newPassword)) {
          socket.emit("update-profile-error", "Invalid password format (at least 6 characters with letters and numbers).");
          return;
        }

        const passwordResult = await messengerdb.updatePassword(updatedUsername, oldPassword, newPassword);
        if (!passwordResult.success) {
          socket.emit("update-profile-error", passwordResult.message);
          return;
        }
      }

      // 4. Success Response
      socket.emit("update-profile-success", {
        message: "Profile updated successfully!",
        newUsername: updatedUsername !== currentUsername ? updatedUsername : null
      });

    } catch (err) {
      console.log("Error>server.js: profile update failed", err);
      socket.emit("update-profile-error", "Server error updating profile.");
    }
  });

  // ---------------------------------------------------------------------------
  // Use-Case-02: Receive message — disconnect notification
  //
  // AC-02.2: all connected clients are notified when a user leaves
  // ---------------------------------------------------------------------------
  socket.on('disconnect', async () => {
    
    const username = userlist.get(socket.id); // get username
    socket.broadcast.emit('stopTyping', username); // If a user is disconnected while typing, their indicator is removed from all other connected users
    
    userlist.delete(socket.id); // remove user from userlist
    console.log('Client disconnected - socket ID: ' + socket.id);
    
    // AC-02.2: Code to broadcast the status
    io.emit('status', username + ' left the chat. Number of connected clients: ' + userlist.size);

    await AllUserList();

  });
});
