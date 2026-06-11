// This file will cover javascript functionality for Use-Case-01: Send Message

function sendMessage() {
    var message = chatMessageInput.value.trim();
    if (!message) return;   // AC-02.2: Empty messages are ignored

    //for current UI testing, the message is sent to the console. Later it will be sent to a message box later with web sockets.
    console.log(`Debug>Chat message: ${message}`); // AC-01.4: The message displays the sender's username alongside the message text
    chatMessageInput.value = ''; // AC-01.3: clear input after sending
    chatMessageInput.focus();
}
