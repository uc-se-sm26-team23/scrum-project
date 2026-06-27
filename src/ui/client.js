/* =============================================================================
 * EECE/CS 3093C Software Engineering — Lab 1
 * client.js — code skeleton provided by Dr. Phu Phung
 * Code complete implementation by Team 23
 * ===============================================================================
 */
var socket = io(); //connect to the Socket.io Server
socket.on("connect", () => { //connected to the server
  console.log(`Connected to Socket.io server: 
    ${socket.io.opts.hostname}, port: ${socket.io.opts.port}`);
});

/**
 * code blocks below have been implemented in Lecture 8
 */
// UI DOM references
var sendBtnElm = document.getElementById('send-button');
if(!sendBtnElm) {
    console.log("Error in getting 'send-button' button");
}
// AC-01.2 (UI): Send button click triggers sendMessage()
sendBtnElm.addEventListener('click', sendMessage);

var chatMessageInput = document.getElementById('chat-message');
if(!chatMessageInput) {
    console.log('Error in getting "chat-message" input');
}
// AC-01.2 (UI): pressing Enter also triggers sendMessage()
chatMessageInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendMessage();
});

document.getElementById('joinBtn').addEventListener('click', joinChat);
function joinChat() {
  //input validation here before sending to the server
  const username = document.getElementById('username').value;
  const pattern = /^\w{3,20}$/;
  if (!username || !pattern.test(username)) {
    alert("Username cannot be empty and must be between 3–20 characters!");
    return;
  }
  //the following lines should be moved to the authentication confirmation from the server
  document.getElementById('loginUI').style.display = 'none';
  document.getElementById('chatUI').style.display = '';
}

// =============================================================================
// Use-Case-01: Send Message
// =============================================================================

function sendMessage() {
    var message = chatMessageInput.value.trim();
    if (!message) return;   // AC-02.2: empty messages are ignored
    console.log(`Debug>Chat message: ${message}`); //for UI testing only
    // other AC will be implemented
    chatMessageInput.value = ''; // AC-01.5: clear input after sending
    chatMessageInput.focus();
}

// =============================================================================
// Use-Case-02: Receive message 
// =============================================================================

//TODO: code to implement AC-02.1: display incoming chat messages without page refresh


//TODO: code to implement AC-02.1: display system status events (join/leave) in the status area
// AC-02.2: shows timestamp for each message
// AC-02.3 (UI): auto-scroll to the latest message

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
