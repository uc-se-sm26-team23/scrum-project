//Socket Connection
var socket = io(); //connect to the Socket.io Server
socket.on("connect", () => { //connected to the server
    console.log(`Connected to Socket.io server: 
    ${socket.io.opts.hostname}, port: ${socket.io.opts.port}`);
});


// UI References
var messageList = document.getElementById("messages");

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

// ==================================================
// Use-Case-01: Send Message
// ==================================================

function sendMessage() {
    var input = chatMessageInput.value.trim();
    if (!input) return;   // AC-02.2: Empty messages are ignored

    // get username moved to join chat

    socket.emit('message', input);

    chatMessageInput.value = ''; // AC-01.3: clear input after sending
    chatMessageInput.focus();
}

// Display the message:
socket.on('message', displayMessage);

function displayMessage(data) {
    // create message div
    const msg = document.createElement("div");
    var timestamp = new Date().toLocaleTimeString();
    // msg.innerHTML = '<span style="color: #2431e5">[' + timestamp + ']</span> ' 
    //                 + DOMPurify.sanitize(data);
    msg.className = "message";
    msg.id = "message-" + messageId;

    // // element that contains the text of the message
    // const msgText = createMessageTextElement(messageId, data, false); //changed input to data as input only exists in sendmessage
    // msg.appendChild(msgText);
    const timestampSpan = document.createElement("span");
    timestampSpan.style.color = "#2431e5";
    timestampSpan.textContent = `[${timestamp}] `;

    msg.appendChild(timestampSpan);

    const msgText = createMessageTextElement(messageId, data, false);
    msg.appendChild(msgText);

    // div that contains three dots and edit/delete buttons
    const msgOptDiv = createMessageOptionsElement(messageId);

    msg.appendChild(msgOptDiv);

    messageId++;
    console.log(msg);
    messageList.appendChild(msg);
    messageList.scrollTop = messageList.scrollHeight;
}

// Display system status events
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

    // create message text again
    const msgText = createMessageTextElement(id, text, true);

    // replace edit div with message text
    const msgDiv = document.getElementById("message-"+id);
    const editDiv = document.getElementById("edit-message-"+id);
    msgDiv.replaceChild(msgText, editDiv);

    // show msgOptDiv (since it was hidden in editMessage)
    const msgOptDiv = document.getElementById("message-options-"+id);
    msgOptDiv.style.display = "inline";
    return;
}

// create the <p>message</p> element
function createMessageTextElement(id, textContent, edited) {
    // get username
    var username = localStorage.getItem("username");

    // turn input into a text element
    const msgText = document.createElement("p");
    if (!edited) {
        msgText.innerHTML = textContent;
    } else {
        msgText.innerHTML = textContent + " <i>(edited)</i>";
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

document.getElementById('joinBtn').addEventListener('click', joinChat);

function joinChat() {
    const username = document.getElementById('username').value;
    const pattern = /^\w{3,20}$/;
    

    if (!username || !pattern.test(username)) {
        alert("Username cannot be empty and must be between 3–20 characters!");
        return;
    }
    
    localStorage.setItem("username", username);
    socket.emit("set username", username);

    document.getElementById('loginUI').style.display = 'none';
    document.getElementById('chatUI').style.display = '';
}