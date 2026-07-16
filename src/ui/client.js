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

    // Temporary session restore using localStorage on reload page
    // Since localStorage is used, so to test, have different users on different domain to test. Else multiple users on same domain will get over-write.

    // Get rid of the below when proper user authentication is implemented (password + database)

    // use to check if username was saved from previous session
    var savedUsername = localStorage.getItem('username');

    // if exist emit to server who the reconnected yser is
    if (savedUsername) {
        socket.emit("set username", savedUsername)

        // skin login page
        $('#loginUI').hide()
        // proceed to chat page
        $('#chatUI').show()

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
    const username = document.getElementById('username').value;
    const pattern = /^\w{3,20}$/;
    

    if (!username || !pattern.test(username)) {
        alert("Username cannot be empty and must be between 3–20 characters!");
        return;
    }
    
    localStorage.setItem("username", username);
    socket.emit("set username", username);

    // AC-02.05 - Request Notification on message
    $("#notify-prompt").css("display", "block"); // show the prompt we made after joining

    $('#loginUI').hide();
    document.getElementById('chatUI').style.display = '';
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
socket.on('message', function({message, id}) { // data (object) - { message: "Alice: hello", id: 1 }
    
    // get senderName
    var senderName = message.split(':')[0];

    // get current user's username from browser storage
    var currUsername = document.getElementById("username").value;

    /*if senderName equal currentUsername then 
    dont show notification to the current user 
    else show notification because senderName isnt the current Username */
    if (senderName !== currUsername) {
        showNotification(senderName + ' says:', data.message);
    }

    // Else Always display message
    displayMessage({message, id});
});


// display message to public chat
function displayMessage({msgText, messageId}) { // server sends data as string
    // create message div
    const msg = document.createElement("div");
    // msg.innerHTML = '<span style="color: #2431e5">[' + timestamp + ']</span> ' 
    //                 + DOMPurify.sanitize(data);
    msg.className = "message";
    msg.id = "message-" + messageId;

    // element that contains the text of the message
    const msgTextElm = createMessageTextElement(messageId, msgText, false, false);
    msg.appendChild(msgTextElm);

    // get username of data
    var messageSender = msgText.split(":")[0];
    var username = document.getElementById("username").value
    if (messageSender === username) { // only display options if they're your messages
        // div that contains three dots and edit/delete buttonsconst 
        msgOptDiv = createMessageOptionsElement(messageId);
        msg.appendChild(msgOptDiv);
    }

    messageList.appendChild(msg);

    // AC-02.03 - Auto-scroll to latest message.
    messageList.scrollTop = messageList.scrollHeight;
}




// Handles sending private messages to a user
function sendPrivateMessage() {

    var input = privChatMessageInput.value.trim();
    if (!input || !currentPrivateUser) return;

    // Sends the message only to the current connected user you clicked on
    socket.emit("privateMessage", {
        to: currentPrivateUser.socketId,
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
socket.on('privateMessage', (data) => {
    const chatId = data.self ? data.toSocket : data.fromSocket;

    // if data.self is true == our own message else from someone else so notify
    if (!data.self) {
        showNotification(
            'Private Message from',
            `${data.from}: ${data.message}`
        );
    }
    

    if (!privateChats[chatId]) {
        privateChats[chatId] = [];
    }

    privateChats[chatId].push({
        from: data.from,
        message: data.message,
        timestamp: new Date().toLocaleTimeString()
    });

    if (
        currentPrivateUser && 
        currentPrivateUser.socketId === chatId
    ) {
        displayPrivateMessage(chatId);
    }
    
    privateTypingIndicator.textContent = "";

});

// data: {}
function displayMessage(data) {
    var msgText = data.message;
    var messageId = data.id;

    // create message div
    const msg = document.createElement("div");
    // msg.innerHTML = '<span style="color: #2431e5">[' + timestamp + ']</span> ' 
    //                 + DOMPurify.sanitize(data);
    msg.className = "message";
    msg.id = "message-" + messageId;

    // element that contains the text of the message
    const msgTextElm = createMessageTextElement(messageId, msgText, false);
    msg.appendChild(msgTextElm);

    // get username of data
    var messageSender = msgText.split(":")[0];

    var username = document.getElementById("username").value
    if (messageSender === username) { // only display options if they're your messages
        // div that contains three dots and edit/delete buttonsconst 
        msgOptDiv = createMessageOptionsElement(messageId);
        msg.appendChild(msgOptDiv);
    }

    messageList.appendChild(msg);

    // AC-02.03 - Auto-scroll to latest message.
    messageList.scrollTop = messageList.scrollHeight;
}

// Displays private messages
function displayPrivateMessage(socketId){
    const messagesDiv = document.getElementById("private-messages");
    messagesDiv.innerHTML= "";

    // Gets past conversation with current user or creates a new conversation
    const conversation = privateChats[socketId] || [];

    // Displays each past message
    conversation.forEach(msg=>{ 

        // Creates div for each message
        const privMessageDiv=document.createElement("div");
        privMessageDiv.className = 'priv-message'

        // Displays the timestamp
        const timestampSpan = document.createElement("span");
        timestampSpan.classList.add("timestamp");
        timestampSpan.textContent = `[${msg.timestamp}] `;
        privMessageDiv.appendChild(timestampSpan);
    
        // Displays the message content
        const messageSpan = document.createElement('span');
        messageSpan.textContent = `${msg.from}: ${msg.message}`;
        privMessageDiv.appendChild(messageSpan);

        // commented out b/c they could be used to implement modify message in private chat
        // const privMessageText = createMessageTextElement(socketId, msg, false, true); 
        // privMessageDiv.appendChild(privMessageText);

        // const privMsgOptDiv = createMessageOptionsElement(socketId);
        // privMessageDiv.appendChild(privMsgOptDiv);

        messagesDiv.appendChild(privMessageDiv);
        
    })
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
    const msgText = createMessageTextElement(id, text, true); // priv messages?
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
    return;
}

// create the <p>message</p> element
// if the message is private, textContent is the msg struct that comes from the server
//      {toSocket, sender, message, etc...}
//      it's bad code, i'm aware
function createMessageTextElement(id, textContent, isEdited, isPrivate) {

    // `${msg.from}: ${msg.message}`
    const msgTextDiv = document.createElement("div");
    if (isPrivate) {
        msgTextDiv.className = "priv-message-text";
        msgTextDiv.id = "priv-message-text-" + id;
    } else {
        msgTextDiv.className = "message-text";
        msgTextDiv.id = "message-text-" + id;
    }
    msgTextDiv.style.display = "inline";

    
    // AC-02.04 - Timestamps display in brower's local system clock
    const timestampSpan = document.createElement("span");
    // timestampSpan.style.color = "#2431e5";
    timestampSpan.classList.add("timestamp");
    if (!isPrivate) {
        var timestamp = new Date().toLocaleTimeString();
        timestampSpan.textContent = `[${timestamp}] `;
    } else {
        timestampSpan.textContent = `[${textContent.timestamp}]`
    }
    if (isPrivate) {
        timestampSpan.id = "priv-timestamp-"+id;
        timestampSpan.className = "priv-timestamp";
    } else {
        timestampSpan.id = "timestamp-"+id;
        timestampSpan.className = "timestamp";
    }
    msgTextDiv.appendChild(timestampSpan);
    
    // turn input into a text element
    const msgText = document.createElement("p");
    if (isPrivate) {
        textContent = textContent.message; //private chats supposedly pass a struct?
    }
    var encodedText = encodeHTML(textContent);
    if (!isEdited) { // AC-02.06 - Output-Encoding strings coming from server
        msgText.innerHTML = encodedText;
    } else {
        //add (edited) next to username
        encodedText = encodedText.split(": ");
        encodedText[0] = encodedText[0] + " <i>(edited)</i>";
        encodedText = encodedText.join(": ");
        msgText.innerHTML = encodedText;
    }
    if (isPrivate) {
        msgText.className = "priv-message-content";
        msgText.id = "priv-message-content-"+id;
    } else {
        msgText.className = "message-content";
        msgText.id = "message-content-"+id;        
    }
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
// Use-Case-0X: Show online users
// ==================================================

// show userlist panel
document.getElementById('users-toggle-main').addEventListener('click', ShowUsers);
document.getElementById('users-toggle-close').addEventListener('click', ShowUsers);

socket.on('userList', function(users) {
    const userListElement = document.getElementById("user-list");
    const currentUser = document.getElementById("username").value; // get logged in username
    
    // Clear the current list
    userListElement.innerHTML = "";

    // Add each user to the list
    users.forEach(user => {
    const li = document.createElement("li");

    // li.style.cursor = "pointer";

    // Show "(You)" only for the current user
    if (user.socketId === socket.id) {
        li.textContent = `${user.username} (You)`;
    } else {
        li.textContent = user.username;
    }

    userListElement.appendChild(li);

    // Opens the private chat UI when clicking a user on the userlist
    li.addEventListener("click", () => {
        openPrivateChat(user);
    });
});
});

// Opens the private chat UI on the webpage
function openPrivateChat(user){
    currentPrivateUser = user;

    displayPrivateMessage(user.socketId);

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

function yesNotification() {
    // prompt user for permission
    Notification.requestPermission().then(function(permission) {

        // hide yellow warning
        $("#notify-prompt").hide();

        // if allow notification
        if (permission == "granted") {
            notificationEnable = true;

            // show the blue confirmation
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

    console.log('Debug>User logged out'); // UI testing only

}