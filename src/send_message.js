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

// gets incremented with each new message
var messageId = 1; //lwk this isn't needed anywhere but it MIGHT be needed so...i didn't delete it

// ==================================================
// Use-Case-01: Send Message
// ==================================================

function sendMessage() {
    var input = chatMessageInput.value.trim();
    if (!input) return;   // AC-02.2: Empty messages are ignored

    const username = localStorage.getItem("username");

    // create message element
    const msg = document.createElement("div");
    msg.className = "message";
    msg.id = "message-" + messageId;
    msg.textContent = username + ": " + input;

    // create button element AC-03.1
    const btn = document.createElement("button");
    btn.className="message-options"
    btn.id="message-options-" + messageId;
    btn.textContent = "⋅ ⋅ ⋅"
    msg.appendChild(btn);
    btn.addEventListener("click", () => {
        for (let i = 0; i < editBtnList.length; i++) {
            editBtnList[i].style.display = "none";
            deleteBtnList[i].style.display = "none";
        }
        editBtn.style.display="inline";
        deleteBtn.style.display="inline";
    });

    // append edit and delete buttons but make them not visible by default
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className="edit-button";
    editBtn.style.display = "none";
    msg.appendChild(editBtn);
    editBtn.addEventListener("click", () => {
        console.log("edit");
    });
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className="delete-button";
    deleteBtn.style.display = "none";
    msg.appendChild(deleteBtn);
    deleteBtn.addEventListener("click", () => {
        console.log("delete");
    });
    // edit/delete button lists so i can re-hide them all when one gets clicked
    const editBtnList = document.getElementsByClassName("edit-button");
    const deleteBtnList = document.getElementsByClassName("delete-button");
 
    messageId++;

    messageList.appendChild(msg);
    messageList.scrollTop = messageList.scrollHeight;

    chatMessageInput.value = ''; // AC-01.3: clear input after sending
    chatMessageInput.focus();
}
