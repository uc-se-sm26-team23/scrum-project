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

// ==================================================
// Use-Case-01: Send Message
// ==================================================

function sendMessage() {
    var input = chatMessageInput.value.trim();
    if (!input) return;   // AC-02.2: Empty messages are ignored

    const username = localStorage.getItem("username");

    const msg = document.createElement("div");
    msg.className = "message";
    msg.textContent = username + ": " + input;

    messageList.appendChild(msg);
    messageList.scrollTop = messageList.scrollHeight;

    chatMessageInput.value = ''; // AC-01.3: clear input after sending
    chatMessageInput.focus();
}
