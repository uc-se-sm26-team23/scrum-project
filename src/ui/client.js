// /* =============================================================================
//  * EECE/CS 3093C Software Engineering — Lab 1
//  * client.js — code skeleton provided by Dr. Phu Phung
//  * Code complete implementation by Team 23
//  * ===============================================================================
//  */


//Socket Connection
var socket = io(); //connect to the Socket.io Server
socket.on("connect", () => { //connected to the server
    console.log(`Connected to Socket.io server: 
    ${socket.io.opts.hostname}, port: ${socket.io.opts.port}`);

    const savedTheme = localStorage.getItem("chat-theme");
    if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Temporary session restore using localStorage on reload page
    // Since localStorage is used, so to test, have different users on different domain to test. Else multiple users on same domain will get over-write.

    // Get rid of the below when proper user authentication is implemented (password + database)

    // use to check if username was saved from previous session
    var savedUsername = localStorage.getItem('username');

    // if exist emit to server who the reconnected yser is
    if (savedUsername) {
        socket.emit("set username", savedUsername)

        /*// skin login page
        $('#loginUI').hide()
        // proceed to chat page
        $('#chatUI').show()*/

        console.log('Debug>Session restored for:', savedUsername); // UI testing only

    }
    // If doesnt exist, show login page and hide chat page (which executes by default)

});

var privateChats = {};

let currentPrivateUser = null;

// variable to track if connected user(s) allow notification on
var notificationEnable = false;

// UI References
var messageList = document.getElementById("messages");

var typingIndicator = document.getElementById("typingIndicator");

var privateTypingIndicator = document.getElementById("private-typingIndicator");

var sendBtnElm = document.getElementById('send-button');
if(!sendBtnElm) {
    console.log("Error in getting 'send-button' button");
}
// AC-01.1: Send button click triggers sendMessage()
sendBtnElm.addEventListener('click', sendMessage);

var privSendBtnElm = document.getElementById('private-send-button');
if(!privSendBtnElm) {
    console.log("Error in getting 'private-send-button' button");
}

privSendBtnElm.addEventListener('click', sendPrivateMessage);

var chatMessageInput = document.getElementById('chat-message');
if(!chatMessageInput) {
    console.log("Error in getting 'chat-message' input");
}

chatMessageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

var privChatMessageInput = document.getElementById('private-message');
if(!privChatMessageInput) {
    console.log("Error in getting 'private-message' input");
}

privChatMessageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendPrivateMessage();
});

privChatMessageInput.addEventListener('input', privateTypingIndication);


// Listens for user input
chatMessageInput.addEventListener('input', typingIndication);

// if click elsewhere, hide all triple dot menu buttons (edit, delete)
document.body.addEventListener("click", (e) => {
    if (e.target.className != "message-options-button" && e.target.className != "message-options-edit" && e.target.className != "message-options-delete") {
        var messageOptionsMenuList = document.getElementsByClassName("message-options-menu");
        for (var i = 0; i < messageOptionsMenuList.length; i++) {
            messageOptionsMenuList[i].style.display = "none";
        }
    }
});

// Notification Prompt w/ User click Yes Button
$('#notify-yes').on('click', yesNotification);
$('#notify-no').on('click', noNotification);

// LogOut button
$('#logout-btn').on('click', logout);

// gets incremented with each new message
var messageId = 1;


// ===============================
// JOIN CHAT
// =================================

var joinBtn = document.getElementById('joinBtn');
if (joinBtn) {
    joinBtn.addEventListener('click', joinChat);
}

var loginUsernameInput = document.getElementById('username');
if (loginUsernameInput) {
    loginUsernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') joinChat();
    });
}

function joinChat() {
    //input validation here before sending to the server
    const username = document.getElementById('username').value;
    const pattern = /^\w{3,20}$/;
    
    if (!username || !pattern.test(username)) {
        alert("Username cannot be empty and must be between 3–20 characters!");
        return;
    }
    
    // Need to be removed after switching to mongoDB
    localStorage.setItem("username", username);
    socket.emit("set username", username);

    const password = document.getElementById('password').value;
    const passwordpattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!password || !passwordpattern.test(password)){
        document.getElementById('login-error').textContent="Password must be at least 6 characters long and contain at least one letter and one number";
        return;
    }

    document.getElementById('login-error').textContent='';
    // AC-08.1: send credentials (as JSON object) to server (UC-08)
    const logincredentials = {username: username, password: password};
    socket.emit('join', logincredentials);
    // console.log("Debug>sent login credentials to server: " + JSON.stringify(logincredentials));

    socket.on('join-success', function(username) {
        console.log('Join Success');
        document.getElementById('loginUI').style.display = 'none';
        document.getElementById('chatUI').style.display = '';
        // document.getElementById('display-name').textContent = username; - there's no 'display-name' element? - connor
        
    

    
    });

    socket.on('join-error', function(message) {
        console.log('Join Error');
        document.getElementById('login-error').textContent = message;
    });

    // AC-02.05 - Request Notification on message
    $("#notify-prompt").css("display", "block"); // show the prompt we made after joining

}

// Toggle: Login -> Register
document.getElementById('showRegisterForm').addEventListener('click', function() {
    document.getElementById('loginUI').style.display = 'none';
    document.getElementById('registerUI').style.display = '';
    document.getElementById('login-error').textContent = '';

    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});

// Toggle: Register -> Login
document.getElementById('showLoginForm').addEventListener('click', () => {
    document.getElementById('registerUI').style.display = 'none';
    document.getElementById('loginUI').style.display = '';
    document.getElementById('register-error').textContent = '';

    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
});

// ======================================================
// Use Case 10: Register Account
// ======================================================
document.getElementById('registerBtn').addEventListener('click', registerAccount);

function registerAccount() {

  // AC-10.2 Client-side format validation before submission
  const usernameInput = document.getElementById('reg-username').value;
  const pattern = /^\w{3,20}$/;

  if (!usernameInput || !pattern.test(usernameInput)) {
    document.getElementById('register-error').textContent = "Error: Username cannot be empty and must be between 3-20 characters!";
    return;
  }

  const passwordInput = document.getElementById('reg-password').value;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  if (!passwordInput || !passwordPattern.test(passwordInput)) {
    document.getElementById('register-error').textContent = "Error: Password must be at least 6 characters long and contains both numbers and letters!";
    return;
  }

  // Clear input boxes then emit to server
  document.getElementById('register-error').textContent='';
  document.getElementById('reg-username').value = '';
  document.getElementById('reg-password').value = '';
  socket.emit('register', {username: usernameInput, password: passwordInput});

}


// =============================================================================
// Use-Case-07: Authenticate User
// =============================================================================
// is this used anywhere?
function authenticateUser() {
    var username = usernameInput.value.trim();

    if (username === "") {
        alert("Please enter a username.");
        return;
    }

    console.log("User authenticated:", username);

    // Save username so message page can know who logged in
    localStorage.setItem("username", username);
    socket.emit("set username", username);

    // Switch to message page
    window.location.href = "send_message.html";
}




// ========================================================
// Use-Case-01: Send Message and Use-Case-03: Edit Message
// ========================================================

const typingUsers = new Set();
let typing = false;
let timeout;

function typingIndication() {

    if (!typing) {
        typing = true;
        socket.emit('typing');  // AC-01.7: Emit typing status to the server
    }

    clearTimeout(timeout);

    timeout = setTimeout(() => {
        typing = false;
        socket.emit('stopTyping');
    }, 1000); // AC-01.8: Typing indicator will disappear after 1 second of no typing
}


let privateTyping = false;
let privateTypingTimeout;

// Handles private typing indicators
function privateTypingIndication() {

    if (!currentPrivateUser) return;

    if (!privateTyping) {
        privateTyping = true;
        socket.emit('privateTyping', {
            to: currentPrivateUser.socketId
        });  // Emit typing status to currently selected private user
    }

    clearTimeout(privateTypingTimeout);

    privateTypingTimeout = setTimeout(() => {
        privateTyping = false;
        socket.emit('privateStopTyping', {
            to: currentPrivateUser.socketId
        });

    }, 1000); // Private typing indicator will disappear after 1 second of no typing
}

const client = localStorage.getItem('username');

// Someone began typing
socket.on('typing', (client) => {
    typingUsers.add(client);
    updateTypingIndicator();
});

// Someone stopped typing
socket.on('stopTyping', (client) => {
    typingUsers.delete(client);
    updateTypingIndicator();
});

// Starts typing indicator for private chats
socket.on('privateTyping', (data) => {
    if(
        currentPrivateUser &&
        currentPrivateUser.socketId === data.fromSocket
    ) {
        $('#private-typing-label').text(data.from + " is typing...");
        $('#private-typingIndicator').show();
    }
});

// Ends typing indicator for private chats
socket.on('privateStopTyping', (data) => {
    if (
        currentPrivateUser &&
        currentPrivateUser.socketId === data.fromSocket
    ) {
        $('#private-typingIndicator').hide();
        $('#private-typingIndicator').empty();
    }
});

// Socket listerner for Register Account
socket.on('register-success', function(username) {
  document.getElementById('registerUI').style.display = 'none';
  document.getElementById('register-error').textContent = '';
  document.getElementById('reg-username').value = '';
  document.getElementById('reg-password').value = '';
  document.getElementById('loginUI').style.display = '';
  document.getElementById('login-success').textContent = `Account '${username}' created! You can now Log In!`;
});

socket.on('register-error', function(message) {
  document.getElementById('register-error').textContent = message;
});

/*
if nobody typing: clear indictaor
if one person is typing: Show user typing...
if multiple people typing: [size] people are typing...
*/
function updateTypingIndicator() {

    if (typingUsers.size === 0) {
        
        $('#typingIndicator').hide();
        $('#typing-label').empty();

    } else if (typingUsers.size === 1) {

        $('#typing-label').text(`${[...typingUsers][0]} is typing...`); // AC-01.7: Displays user who is currently typing

        $('#typingIndicator').show();
    
    } else {
        $('#typing-label').text(`${typingUsers.size} people are currently typing...`); // AC-01.7: Displays number of users typing if multiple are currently
        $('#typingIndicator').show();
    }
}



function sendMessage() {
    var input = chatMessageInput.value.trim();
    if (!input) return;   // AC-01.2: Empty messages are ignored

    // get username moved to join chat

    socket.emit('message', input);

    chatMessageInput.value = ''; // AC-01.3: clear input after sending
    chatMessageInput.focus();
}

// AC-02.01 & AC-02.05
// get message from server
socket.on('message', function({message, id, timestamp}) { // data (object) - { message: "Alice: hello", id: 1 }
    
    // get senderName
    var senderName = message.split(':')[0];

    // get current user's username from browser storage
    var currUsername = document.getElementById("username").value;

    /*if senderName equal currentUsername then 
    dont show notification to the current user 
    else show notification because senderName isnt the current Username */
    if (senderName !== currUsername) {
        showNotification(senderName + ' says:', message);
    }

    // Else Always display message
    displayMessage({msgText: message, messageId: id, timestamp: new Date(timestamp).toLocaleTimeString()});
});


// display message to public chat
// TODO should pass in isEdited/isDeleted
function displayMessage({msgText, messageId, timestamp}) { // server sends data as string 
    const msg = createMessage(msgText, messageId, timestamp);

    messageList.appendChild(msg);
    // AC-02.03 - Auto-scroll to latest message.
    messageList.scrollTop = messageList.scrollHeight;
}


function createMessage(msgText, messageId, timestamp, isEdited=false, isDeleted=false) {
    // create message div
    const msg = document.createElement("div");
    msg.className = "message";
    msg.id = "message-" + messageId;
    // msg.innerHTML = '<span style="color: #2431e5">[' + timestamp + ']</span> ' 
    //                 + DOMPurify.sanitize(data);

    // element that contains the text of the message
    const msgTextElm = createMessageTextElement(messageId, msgText, timestamp, isEdited, isDeleted);
    msg.appendChild(msgTextElm);

    // get username of data to create msg options
    if (!isDeleted) {
        var sender = msgText.split(":")[0];
        var username = localStorage.getItem("username");
        if (sender === username) { // only display options if they're your messages
            // div that contains three dots and edit/delete buttonsconst 
            const msgOptDiv = createMessageOptionsElement(messageId);
            msg.appendChild(msgOptDiv);
        }
    }

    return msg;
}


// Handles sending private messages to a user
function sendPrivateMessage() {

    var input = privChatMessageInput.value.trim();
    // curr private user is a struct {socketId, username}
    if (!input || !currentPrivateUser) return;

    // Sends the message only to the current connected user you clicked on
    socket.emit("privateMessage", {
        to: currentPrivateUser,
        message: input
    });

    // Ends the typing indicator upon message send
    privateTyping = false;
    socket.emit('privateStopTyping', {
        to: currentPrivateUser.socketId
    });

    privChatMessageInput.value = ""; // Sets the input value to empty
    privChatMessageInput.focus();
}

// Handles private message reception
// data params are fromUser, toUser, message, self, id, timestamp
socket.on('privateMessage', ({self, toUser, fromUser, message, id, timestamp}) => {
    const chatUser = self ? toUser : fromUser; // i think this is the other user that you're talking to
    // admin sends message
    // test should put it in privateChats[admin]
    // admin should put it in privateChats[test]

    // if data.self is true == our own message else from someone else so notify
    if (!self) {
        showNotification(
            'Private Message from',
            `${fromUser}: ${message}`
        );
    }
    
    // init array if not there
    if (!privateChats[chatUser]) {
        privateChats[chatUser] = [];
    }

    // create msg and add it to pC array
    const msg = {
        from: fromUser,
        message: message,
        timestamp: new Date(timestamp).toLocaleTimeString(),
        id: id
    };
    privateChats[chatUser].push(msg);

    // display message
    if (currentPrivateUser) {
        displayPrivateMessage(msg);
    }
    
    privateTypingIndicator.textContent = "";
});


function loadPrivateMessages(toUser) {
    const messagesDiv = document.getElementById("private-messages");
    messagesDiv.innerHTML= "";

    const conversation = privateChats[toUser] || [];
    // Displays each past message
    conversation.forEach(msg=>{ 
        let isEdited = false;
        let isDeleted = false;
        if (msg.edited) isEdited = true;
        if (msg.deleted) isDeleted = true;
        const privMsg = createMessage(msg.from + ": " + msg.message, msg.id, msg.timestamp, isEdited, isDeleted);
        messagesDiv.appendChild(privMsg);
    })
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Displays private messages
function displayPrivateMessage({from, message, timestamp, id}){
    const messagesDiv = document.getElementById("private-messages");
    const privMsg = createMessage(from + ": " + message, id, timestamp);
    messagesDiv.appendChild(privMsg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

//AC-02.02:  Display system status events
socket.on('status', function(data) {
    var statusElm = document.getElementById('status');
    // Show timestamp
    var timestamp = new Date().toLocaleTimeString(); //changed to Date from datatransfer as this was registered as an error in console
    // statusElm.innerHTML = statusElm.innerHTML + '<br><span style="color: #2ee524">[' + timestamp + ']</span> ' + DOMPurify.sanitize(data);
    statusElm.innerHTML += '<br><span class="status-timestamp">[' + timestamp + ']</span> ' + DOMPurify.sanitize(data);

    // Auto-scroll to latest message
    statusElm.scrollTop = statusElm.scrollHeight;
})




// =====================================
// UC-03 Modify Message (Edit Message)
// =====================================

// changes DOM to allow you to edit the message
function editMessage(e) {
    // get the id from edit button id ("message-options-edit-#")
    var id = e.target.id.split("-"); // id is just a placeholder here
    id = id[id.length-1]; // get the real id (at the end of the array)

    // get the message text
    const msgText = document.getElementById("message-text-"+id);

    // create div "edit-message"
    const editMsgDiv = document.createElement("div");
    editMsgDiv.className = "edit-message";
    editMsgDiv.id = "edit-message-" + id;
    editMsgDiv.style.display = "inline";

    // get username
    var username = document.getElementById("username").value;

    // create the label
    const editLbl = document.createElement("label");
    editLbl.htmlFor = "edit-input-" + id;
    editLbl.textContent = username + ":";
    editMsgDiv.appendChild(editLbl);

    // get placeholder text
    // (take the text content and remove the "username: ")
    var editPlaceholder = msgText.textContent.split(": ");
    editPlaceholder = editPlaceholder.splice(1); // remove username
    editPlaceholder = editPlaceholder.join(": "); // just in case there are any ": " in the message itself

    // create the input
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.id = "edit-input-" + id;
    editInput.name = editInput.id;
    editInput.value = editPlaceholder;
    editInput.placeholder = editPlaceholder; // so that submitEditMessage has access to the old text
    // on Enter press, submit edited message
    editInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            submitEditMessage(e);
        };
    });
    editMsgDiv.appendChild(editInput);

    // create submit edit button
    const submitEditBtn = document.createElement("button");
    submitEditBtn.className = "edit-submit";
    submitEditBtn.id = "edit-submit-" + id;
    submitEditBtn.textContent = "Submit";
    submitEditBtn.addEventListener("click", submitEditMessage);
    editMsgDiv.appendChild(submitEditBtn);

    // replace text with div
    const msgDiv = document.getElementById("message-"+id);
    msgDiv.replaceChild(editMsgDiv, msgText);
    
    // hide other buttons
    const msgOptDiv = document.getElementById("message-options-"+id);
    msgOptDiv.style.display="none";

    // focus the edit message
    editInput.focus();

    return;
}

// submit edited message to server
function submitEditMessage(e) {
    // get id
    var id = e.target.id.split("-");
    id = id[id.length - 1];

    // get text content
    const editInput = document.getElementById("edit-input-"+id);
    var text = editInput.value;
    // if edited message is empty, return
    if (text === "") {
        return;
    }

    // TODO get if public
    // great grandparent is 'messages' not 'private-messages'
    // TODO get timestamp
    // editMessage needs to replace message-content not message-text
    // TODO get old message
    // get it from editInput.placeholder


    // send to server
    socket.emit("edit", {id: id, message: document.getElementById("username").value + ": " + text});
    return;
}

// replace DOM elements with edited message
// data should be {id: id, message: message}
socket.on("edit", handleEditMessage);
function handleEditMessage(data) {
    var text = data.message;
    var id = data.id;
    // create message text again
    const msgText = createMessageTextElement(id, text, new Date().toLocaleTimeString(), true); // priv messages?
    // get sender
    var sender = text.split(":")[0];
    var username = document.getElementById("username").value;
    const msgDiv = document.getElementById("message-"+id);

    if (sender === username) {
        // replace edit div with message text if it's your own
        const editDiv = document.getElementById("edit-message-"+id);
        msgDiv.replaceChild(msgText, editDiv);

        // show msgOptDiv (since it was hidden in editMessage) if it's your own
        const msgOptDiv = document.getElementById("message-options-"+id);
        msgOptDiv.style.display = "inline";

        // hide the menu though
        const msgOptMenu = document.getElementById("message-options-menu-"+id);
        msgOptMenu.style.display = "none";
    } else {
        // replace the message normally if someone else edited theirs
        const oldMsgTextElm = document.getElementById("message-text-"+id);
        msgDiv.replaceChild(msgText, oldMsgTextElm);
    }
    
    // if in private message update the privateChats struct
    // get parent of msgDiv
    if (!currentPrivateUser) return;
    const gp = msgDiv.parentElement;
    if (gp.id === "private-messages") { // TODO is this necessary if we already do the !currentPrivateUser?
        // find the message based on the id
        // TODO the key for privateChats should be the id, not the username? perhaps?
        let index = -1;
        for (let i = 0; i < privateChats[currentPrivateUser.username].length; i++) {
          if (privateChats[currentPrivateUser.username][i].id == id) {
                index = i;
                break;
            }
        }
        let newText = msgText.lastChild.innerHTML;
        let newMessage = newText.split(": ").slice(1).join(": ");
        privateChats[currentPrivateUser.username][index].timestamp = new Date().toLocaleTimeString();
        privateChats[currentPrivateUser.username][index].message = newMessage;
        privateChats[currentPrivateUser.username][index].edited = true;
    }

    return;
}

// ===================================================
// UC-03 Modify Message (Delete Message)
// ===================================================

// gets username and id and sends to server
function deleteMessage(e) {
    // get id
    var id = e.target.id.split("-");
    id = id[id.length-1];

    // get username
    username = document.getElementById("username").value;

    // emit to server
    socket.emit("delete", {id: id, username: username});

    return;
}

// removes/alters DOM element
socket.on("delete", handleDeleteMessage);
function handleDeleteMessage(data) {
    var id = data.id;
    var sender = data.username;
    var username = document.getElementById("username").value;

    // replace text content and timestamp
    const msgText = document.getElementById("message-content-"+id);
    const timestampElm = document.getElementById("timestamp-"+id);
    const newTimestamp = new Date().toLocaleTimeString();
    msgText.innerHTML = "<i> deleted by " + sender + "</i>";
    timestampElm.textContent = "[" + newTimestamp + "]";

    if (username === sender) {
        // remove message options if you delete your own message
        const msgOptDiv = document.getElementById("message-options-"+id);
        msgOptDiv.remove();
    }

    // update privateChats if private
    if (!currentPrivateUser) return;
    const ggp = msgText.parentElement.parentElement.parentElement; // great grandparent
    if (ggp.id === "private-messages") {
        let index = -1;
        for (let i = 0; i < privateChats[currentPrivateUser.username].length; i++) {
          if (privateChats[currentPrivateUser.username][i].id == id) {
                index = i;
                break;
            }
        }
        privateChats[currentPrivateUser.username][index].deleted = true;
        privateChats[currentPrivateUser.username][index].message = ""; // clear message bc why not. it's deleted
        privateChats[currentPrivateUser.username][index].timestamp = new Date().toLocaleTimeString();
    }
    return;
}

// create the <p>message</p> element
// it's bad code, i'm aware
// text content has to include the sender (e.g. "sender: message")
function createMessageTextElement(id, textContent, timestamp, isEdited, isDeleted=false) {

    // `${msg.from}: ${msg.message}`
    const msgTextDiv = document.createElement("div");
    msgTextDiv.className = "message-text";
    msgTextDiv.id = "message-text-" + id;
    msgTextDiv.style.display = "inline";

    
    // AC-02.04 - Timestamps display in brower's local system clock
    const timestampSpan = document.createElement("span");
    // timestampSpan.style.color = "#2431e5";
    timestampSpan.classList.add("timestamp");
    timestampSpan.textContent = `[${timestamp}] `;
    timestampSpan.id = "timestamp-"+id;
    timestampSpan.className = "timestamp";
    msgTextDiv.appendChild(timestampSpan);
    
    // turn input into a text element
    const msgText = document.createElement("p");
    var encodedText = encodeHTML(textContent);
    if (isDeleted) {
        let sender = encodedText.split(": ")[0];
        msgText.innerHTML = "<i> deleted by " + sender + "</i>";
    } else if (!isEdited) { // AC-02.06 - Output-Encoding strings coming from server
        msgText.innerHTML = encodedText;
    } else {
        //add (edited) next to username
        encodedText = encodedText.split(": ");
        encodedText[0] = encodedText[0] + " <i>(edited)</i>";
        encodedText = encodedText.join(": ");
        msgText.innerHTML = encodedText;
    }
    msgText.className = "message-content";
    msgText.id = "message-content-"+id;        
    msgText.style.display = "inline";
    
    msgTextDiv.appendChild(msgText);

    return msgTextDiv;
}

// triple dots button + edit / delete buttons
// okay right now this is only being used in sendMessage (as of 6/25/26) because i thought i would need it in submitEditMessage but i didn't
function createMessageOptionsElement(id) {
    // create message options div (aka the triple dots button)
    const msgOptDiv = document.createElement("div");
    msgOptDiv.className = "message-options";
    msgOptDiv.id = "message-options-" + id;
    msgOptDiv.style.display = "inline";

    // create button element AC-03.1
    const tripleDotsBtn = document.createElement("button");
    tripleDotsBtn.className="message-options-button"
    tripleDotsBtn.id="message-options-" + id;
    tripleDotsBtn.textContent = "⋅ ⋅ ⋅";
    tripleDotsBtn.addEventListener("click", () => {
        var isMenuCurrentlyVisible = menuDiv.style.display === "inline";
        for (let i = 0; i < menuList.length; i++) {
            menuList[i].style.display = "none";
        }
        if (!isMenuCurrentlyVisible) {
            menuDiv.style.display = "inline";
        }
    });
    msgOptDiv.appendChild(tripleDotsBtn);

    // menu contains edit and delete buttons
    const menuDiv = document.createElement("div");
    menuDiv.className = "message-options-menu";
    menuDiv.id = "message-options-menu-"+id;
    menuDiv.style.display = "none";

    // edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "message-options-edit";
    editBtn.id = "message-options-edit-" + id;
    menuDiv.appendChild(editBtn);
    editBtn.addEventListener("click", editMessage);

    // delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "message-options-delete";
    deleteBtn.id = "message-options-delete-" + id;
    menuDiv.appendChild(deleteBtn);
    deleteBtn.addEventListener("click", deleteMessage);

    msgOptDiv.appendChild(menuDiv);

    // menu list (edit and delete buttons) so i can re-hide them all when one gets clicked
    // apparently the above variables can access this variable i think? idk. idk how javascript works
    const menuList = document.getElementsByClassName("message-options-menu");

    return msgOptDiv;
}



// encodeHTML function
// replace dangerous HTML character into text
function encodeHTML(string) {
    return string
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
  
  /*
  ==============================
  // Function: showNotification
  Parameters:
  - sender: String Type
    - Title of notification pop up: sender's username
  - message_body: String Type
    - The message content to show in notification body
  ==============================
  */
function showNotification(sender, message_body) {

    // do ntg if user say no
    if (!notificationEnable) {
        return;
    }

    // check if browser permission is granted
    if (Notification.permission !== "granted") {
        return;
    }

    // if user is looking at the app, dont need to show notification
    if (!document.hidden) {
        return;
    }

    // if all conditions passed - can fire notification
    new Notification(sender , {body: message_body});
}


// ==================================================
// Use-Case-06: Show online users
// ==================================================

// show userlist panel
document.getElementById('users-toggle-main').addEventListener('click', ShowUsers);
document.getElementById('users-toggle-close').addEventListener('click', ShowUsers);

socket.on('userList', function(users) {
    const userListElement = document.getElementById("user-list");
   // const currentUser = document.getElementById("username").value; // get logged in username
    
    // Clear the current list
    userListElement.innerHTML = "";

    // Add each user to the list
    users.forEach(user => {

        const li = document.createElement("li");
        // Green dot for online, dim dot for offline
        const dot = document.createElement("span");
        dot.classList.add("user-status-dot", user.online ? "online" : "offline");
        li.appendChild(dot);


        const storedUsername = localStorage.getItem("username");
        const isSelf = (user.socketId && user.socketId === socket.id) || (user.username === storedUsername);

        // Show "(You)" only for the current user
        if (isSelf) {
                li.appendChild(document.createTextNode(`${user.username} (You)`));
            } else {
                li.appendChild(document.createTextNode(user.username || user));
            }
        
        // Offline rows are visually dimmed via CSS class
        if (!user.online) {
            li.classList.add("user-offline");
        }

        // Opens the private chat UI when clicking a user on the userlist
        li.addEventListener("click", () => {
            openPrivateChat(user);
        });

        userListElement.appendChild(li);

    });
});

// Opens the private chat UI on the webpage
function openPrivateChat(user){
    currentPrivateUser = user;

    loadPrivateMessages(user.username);

    document.getElementById("private-chat").style.display = "block";
    document.getElementById("private-header").textContent = 
        "Chat with " + user.username;
}

function ShowUsers(){
//    const currentLeft = window.getComputedStyle(panel).left;
    const panel = document.getElementById('side-panel');

    // // If it's 0px (visible), hide it. Otherwise, show it.
    // if (currentLeft === '0px') {
    //     panel.style.left = '-260px';
    // } else {
    //     panel.style.left = '0px';
    // }
    panel.classList.toggle('open');

}


// ---------------------------
// EDIT Profile
// ---------------------------
document.getElementById('Edit_profile_btn').addEventListener('click', () => {
    const profileModal = document.getElementById('edit-profile-modal');
    profileModal.style.display = 'flex';
    document.getElementById('profile-feedback').textContent = '';
    document.getElementById('edit-profile-form').reset();

    const currentTheme = localStorage.getItem("chat-theme") || "modern-blue";
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.value = currentTheme;
    }
});

document.getElementById('close-profile-btn').addEventListener('click', () => {
    document.getElementById('edit-profile-modal').style.display = 'none';
});

// Handle profile form submission
document.getElementById('edit-profile-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const currentUsername = localStorage.getItem("username");
    const newUsername = document.getElementById("new-username").value.trim();
    const oldPassword = document.getElementById("old-password").value;
    const newPassword = document.getElementById("new-password").value;
    const feedback = document.getElementById("profile-feedback");
    const selectedTheme = document.getElementById("theme-selector").value; 

    if (selectedTheme) {
        document.documentElement.setAttribute('data-theme', selectedTheme);
        localStorage.setItem("chat-theme", selectedTheme);
    }

    // Client-side validation for username
    if (newUsername) {
        const pattern = /^\w{3,20}$/;
        if (!pattern.test(newUsername)) {
            feedback.style.color = "red";
            feedback.textContent = "New username must be between 3–20 characters!";
            return;
        }
    }

    // Client-side validation for password
    if (newPassword) {
        if (!oldPassword) {
            feedback.style.color = "red";
            feedback.textContent = "Old password is required to change password!";
            return;
        }
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (!passwordPattern.test(newPassword)) {
            feedback.style.color = "red";
            feedback.textContent = "New password must be at least 6 characters with letters and numbers!";
            return;
        }
    }

    // Emit update request to server
    socket.emit("update-profile", {
        currentUsername,
        newUsername,
        oldPassword,
        newPassword
    });
});

// Socket listeners for profile update responses
socket.on("update-profile-success", (data) => {
    const feedback = document.getElementById("profile-feedback");
    feedback.style.color = "green";
    feedback.textContent = data.message;

    if (data.newUsername) {
        localStorage.setItem("username", data.newUsername);
        document.getElementById("username").value = data.newUsername;
    }

    setTimeout(() => {
        document.getElementById("edit-profile-modal").style.display = "none";
    }, 1500);
});

socket.on("update-profile-error", (message) => {
    const feedback = document.getElementById("profile-feedback");
    feedback.style.color = "red";
    feedback.textContent = message;
});




function yesNotification() {
    // prompt user for permission
    Notification.requestPermission().then(function(permission) {

        // hide notification warning
        $("#notify-prompt").hide();

        // if allow notification
        if (permission == "granted") {
            notificationEnable = true;

            // show the blue notification allow confirmation
            $("#notify-confirmed").show();

            // hide confirmation pop up after 3 second
            setTimeout(function() {
                $("#notify-confirmed").hide();
            }, 3000);
            
            
        } else {
            // permission deny or non-response which default by deny
            notificationEnable = false;
            $("#notify-prompt").hide();
            $("#notify-confirmed").hide();
        }
    });
}

function noNotification() {

    notificationEnable =  false;
    $("#notify-prompt").hide();
}

function logout() {

    /* Assuming only one person per domain
    When log out:
    -Remove saved username from localStorage
    - clear chat messages 
    - clear status log
    - clear private chat messages
    - hide chat page
    - show login page
    - clear username input field
    */

    localStorage.removeItem('username');

    $('#message').empty();
    $('#status').empty();
    $('#private-messages').empty();

    $('#chatUI').hide();
    $('#loginUI').show();

    $('#username').val('');
    $('#password').val('');

    console.log('Debug>User logged out'); // UI testing only

}



