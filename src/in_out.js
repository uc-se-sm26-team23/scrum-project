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

    // Save username locally for now
    localStorage.setItem("username", username);

    // Simple UI feedback
    alert("Welcome, " + username + "!");
}