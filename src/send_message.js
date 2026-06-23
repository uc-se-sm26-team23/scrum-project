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
            messageOptionsMenuList[i].style.display = "none";
        }
    }
});

// gets incremented with each new message
var messageId = 1; //lwk this isn't needed anywhere but it MIGHT be needed so...i didn't delete it

// ==================================================
// Use-Case-01: Send Message
// ==================================================

function sendMessage() {
    var input = chatMessageInput.value.trim();
    if (!input) return;   // AC-02.2: Empty messages are ignored

    const username = localStorage.getItem("username");

    // turn input into a text element (because i need it to be)
    const msgText = document.createElement("p");
    msgText.textContent = username + ": " + input;
    msgText.className = "message-text";
    msgText.id = "message-text-" + messageId;
    msgText.style.display = "inline";

    // create message element
    const msg = document.createElement("div");
    msg.className = "message";
    msg.id = "message-" + messageId;
    msg.appendChild(msgText);

    // create button element AC-03.1
    const btn = document.createElement("button");
    btn.className="message-options-button"
    btn.id="message-options-" + messageId;
    btn.textContent = "⋅ ⋅ ⋅"
    msg.appendChild(btn);
    btn.addEventListener("click", () => {
        for (let i = 0; i < menuList.length; i++) {
            menuList[i].style.display = "none";
        }
        menuDiv.style.display="inline";
    });

    // append edit and delete buttons but make them not visible by default
    const menuDiv = document.createElement("div");
    menuDiv.className = "message-options-menu";
    menuDiv.style.display = "none";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className="message-options-edit";
    // editBtn.style.display = "none";
    menuDiv.appendChild(editBtn);
    editBtn.addEventListener("click", editMessage);
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className="message-options-edit";
    // deleteBtn.style.display = "none";
    menuDiv.appendChild(deleteBtn);
    deleteBtn.addEventListener("click", () => {
        console.log("delete");
    });
    msg.appendChild(menuDiv);
    // menu list (edit and delete buttons) so i can re-hide them all when one gets clicked
    const menuList = document.getElementsByClassName("message-options-menu");
 
    messageId++;

    messageList.appendChild(msg);
    messageList.scrollTop = messageList.scrollHeight;

    chatMessageInput.value = ''; // AC-01.3: clear input after sending
    chatMessageInput.focus();
}

// UC-03 modify message, edit message
function editMessage(e) {
    console.log("edit");
    // replace text with text box
    // what does the dom look like?
    /*
    div
        text
        button
        div
            button
            button
        /div
    /div
    */

    /* pseudocode
    *turn text into a p with a class message-text
    -how do you replace?
        // id = e.target.id + //string manipulation to get the id
        // text = document.getElementById("message-text-" + id)
        // textbox = createElement("textbox") // or whatever the elemtn is called
        // e.target.parentElement.replaceChild(textbox, text)
    -how to string manip the id
    -what is the new element supposed to look like
    -code
    */
    return;
}
