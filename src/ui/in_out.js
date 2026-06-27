// UI DOM references
var enterBtnElm = document.getElementById('enter-button');

if (!enterBtnElm) {
    console.log("Error in getting 'enter-button' button");
}

var usernameInput = document.getElementById('username');

if (!usernameInput) {
    console.log("Error in getting 'username' input");
}

// Button click triggers authenticateUser()
enterBtnElm.addEventListener('click', authenticateUser);

// Pressing Enter also triggers authenticateUser()
usernameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        authenticateUser();
    }
});

// =============================================================================
// Use-Case-07: Authenticate User
// =============================================================================

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
