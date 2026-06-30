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
});


// UI References
var messageList = document.getElementById("messages");

var typingIndicator = document.getElementById("typingIndicator");

var sendBtnElm = document.getElementById('send-button');
if(!sendBtnElm) {
    console.log("Error in getting 'send-button' button");
}
// AC-01.1: Send button click triggers sendMessage()
sendBtnElm.addEventListener('click', sendMessage);

var chatMessageInput = document.getElementById('chat-message');
if(!chatMessageInput) {
    console.log("Error in getting 'chat-message' input");
}

chatMessageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

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
    Notification.requestPermission();

    document.getElementById('loginUI').style.left = '100%';
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

function sendMessage() {
    var input = chatMessageInput.value.trim();
    if (!input) return;   // AC-01.2: Empty messages are ignored

    // get username moved to join chat

    socket.emit('message', input);

    chatMessageInput.value = ''; // AC-01.3: clear input after sending
    chatMessageInput.focus();
}


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

function updateTypingIndicator() {
    if (typingUsers.size === 0) {
        typingIndicator.textContent = "";
    } else if (typingUsers.size === 1) {
        typingIndicator.textContent =
        `${[...typingUsers][0]} is typing...`; // AC-01.7: Displays user who is currently typing
    }

    else {
        typingIndicator.textContent = 
        `${typingUsers.size} people are currently typing...`; // AC-01.7: Displays number of users typing if multiple are currently
    }
}


// AC-02.01 & AC-02.05
// get message from server
socket.on('message', function(data) {
    showNotification('New Message', data);
    displayMessage(data);
});


function displayMessage(data) {
    
    // AC-02.04 - Timestamps display in brower's local system clock
    // create message div
    const msg = document.createElement("div");
    var timestamp = new Date().toLocaleTimeString();
    // msg.innerHTML = '<span style="color: #2431e5">[' + timestamp + ']</span> ' 
    //                 + DOMPurify.sanitize(data);
    msg.className = "message";
    msg.id = "message-" + messageId;

    const timestampSpan = document.createElement("span");
    timestampSpan.style.color = "#2431e5";
    timestampSpan.textContent = `[${timestamp}] `;
    msg.appendChild(timestampSpan);

    // element that contains the text of the message
    const msgText = createMessageTextElement(messageId, data, false);
    msg.appendChild(msgText);

    // get username of data
    var messageSender = data.split(":")[0];
    var username = document.getElementById("username").value
    if (messageSender === username) { // only display options if they're your messages
        // div that contains three dots and edit/delete buttonsconst 
        msgOptDiv = createMessageOptionsElement(messageId);
        msg.appendChild(msgOptDiv);
    }

    messageId++;
    messageList.appendChild(msg);

    // AC-02.03 - Auto-scroll to latest message.
    messageList.scrollTop = messageList.scrollHeight;
}

//AC-02.02:  Display system status events
socket.on('status', function(data) {
    var statusElm = document.getElementById('status');
    // Show timestamp
    var timestamp = new Date().toLocaleTimeString(); //changed to Date from datatransfer as this was registered as an error in console
    statusElm.innerHTML = statusElm.innerHTML + '<br><span style="color: #2ee524">[' + timestamp + ']</span> ' + DOMPurify.sanitize(data);

    // Auto-scroll to latest message
    statusElm.scrollTop = statusElm.scrollHeight;
})

// UC-03 modify message, edit message
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
    var username = localStorage.getItem("username");

    // create the label
    const editLbl = document.createElement("label");
    editLbl.htmlFor = "edit-input-" + id;
    editLbl.textContent = username + ":";

    // get placeholder text
    // (take the text content and remove the "username: ")
    var editPlaceholder = msgText.textContent.split(": ");

    if (username !== editPlaceholder[0]) {
        return;
    }

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
    socket.emit("edit", {id, text});
    return;
}

// replace DOM elements with edited message
// data should be {id, text}
function handleEditMessage(data) {
    console.log("hEM data", data);
    var text = data.text;
    var id = data.id;
     // create message text again
    const msgText = createMessageTextElement(id, text, true);

    // replace edit div with message text
    const msgDiv = document.getElementById("message-"+id);
    const editDiv = document.getElementById("edit-message-"+id);
    console.log("msgdiv", msgDiv);
    console.log("editDiv", editDiv);
    msgDiv.replaceChild(msgText, editDiv);

    // show msgOptDiv (since it was hidden in editMessage)
    var messageSender = text.split(":")[0];
    var username = document.getElementById("username").value;
    if (messageSender === username) {
        const msgOptDiv = document.getElementById("message-options-"+id);
        msgOptDiv.style.display = "inline";
    }

}

// handle edit message from server
socket.on("edit", handleEditMessage);

// create the <p>message</p> element
function createMessageTextElement(id, textContent, edited) {
    // turn input into a text element
    const msgText = document.createElement("p");
    if (!edited) { // AC-02.06 - Output-Encoding strings coming from server
        msgText.innerHTML = encodeHTML(textContent);
    } else {
        msgText.innerHTML = encodeHTML(textContent) + " <i>(edited)</i>";
    }
    msgText.className = "message-text";
    msgText.id = "message-text-" + id;
    msgText.style.display = "inline";

    return msgText;
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

function deleteMessage(e) {
    // get id
    var id = e.target.id.split("-");
    id = id[id.length-1];

    // get username
    username = localStorage.getItem("username");

    // replace text content
    const msgText = document.getElementById("message-text-"+id);
    msgText.innerHTML = "<i>deleted by " + username + "</i>";

    // remove message options
    const msgOptDiv = document.getElementById("message-options-"+id);
    msgOptDiv.remove();
    return;
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
  // Functio: showNotification
  Parameters:
  - sender: String Type
    - Title of notification pop up; hardcoded as 'New Message' at line 60
  - message_body: String Type
    - The message data to notify from server.
  ==============================
  */
function showNotification(sender, message_body) {

    // check if permission is allow AND user has tab in background (user not looking at the app)
    if (Notification.permission =='granted' && document.hidden) {

        // if true, notifications can fire
        new Notification(sender, {body: message_body});
    }
}


// ==================================================
// Use-Case-0X: Show online users
// ==================================================

// show userlist panel
document.getElementById('users-toggle-main').addEventListener('click', ShowUsers);
document.getElementById('users-toggle-close').addEventListener('click', ShowUsers);

socket.on('userList', function(users) {
    const userListElement = document.getElementById("user-list");
    
    // Clear the current list
    userListElement.innerHTML = "";

    // Add each user to the list
    users.forEach(user => {
        const li = document.createElement("li");
        li.textContent = user;
        userListElement.appendChild(li);
    });
});


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