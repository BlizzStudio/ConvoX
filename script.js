import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, set, onChildAdded } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
apiKey: "AIzaSyCJQgvHNBOzNR8Wt2ZgPQqU_FZqil8hfnM",
authDomain: "realchat-c6a12.firebaseapp.com",
databaseURL: "https://realchat-c6a12-default-rtdb.firebaseio.com",
projectId: "realchat-c6a12",
storageBucket: "realchat-c6a12.appspot.com",
messagingSenderId: "817508988786",
appId: "1:817508988786:web:db9d93ba766d093bc38feb",
measurementId: "G-9532B2J7N8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);
const msgBtn = document.getElementById('msgBtn');
msgBtn.addEventListener('click', sendMsg);
const backButton = document.querySelector('.text-white.text-xl.mr-4');

// Add event listener for back button
backButton.addEventListener('click', () => {
// Hide the chat UI
chatUI.style.display = 'none';

// Show the sign-in form and initial buttons
signInForm.style.display = 'block';
document.getElementById("initialButtons").style.display = 'block';
});

const chatUI = document.getElementById('chatUI');
const usernameModal = document.getElementById('usernameModal');
const usernameInput = document.getElementById('usernameInput');
const usernameSubmit = document.getElementById('usernameSubmit');
const userNameDisplay = document.getElementById('userNameDisplay');
const msgInput = document.getElementById('msgTxt');
const messagesDiv = document.getElementById('messages');

const signUpBtn = document.getElementById("signUpBtn");
const logInBtn = document.getElementById("logInBtn");
const signUpForm = document.getElementById("signupForm");
const signInForm = document.getElementById("signinForm");
const signupSubmitBtn = document.getElementById("signupSubmitBtn");
const signinSubmitBtn = document.getElementById("signinSubmitBtn");
const goToSignInBtn = document.getElementById("goToSignInBtn");
const goToSignUpBtn = document.getElementById("goToSignUpBtn");
const emojiModal = document.querySelector('.emoji-modal');
const emojiBtn = document.getElementById('emojiBtn');

emojiBtn.addEventListener('click', function() {
emojiModal.style.display = emojiModal.style.display === 'none' ? 'block' : 'none';
});

// Function to add emoji to input
emojiModal.addEventListener('click', (event) => {
if (event.target.classList.contains('emoji')) {
msgInput.value += event.target.textContent;
}
});

function formatDate(timestamp) {
const date = new Date(timestamp);
return date.toLocaleString();
}

// Show Sign Up Form when "Sign Up" button is clicked
signUpBtn.addEventListener("click", function() {
signUpForm.style.display = 'block';
signInForm.style.display = 'none';
document.getElementById("initialButtons").style.display = 'none';
});

// Show Log In Form when "Log In" button is clicked
logInBtn.addEventListener("click", function() {
signInForm.style.display = 'block';
signUpForm.style.display = 'none';
document.getElementById("initialButtons").style.display = 'none';
});

// Switch to Sign In Form when "Go to Sign In" is clicked
goToSignInBtn.addEventListener("click", function() {
signUpForm.style.display = 'none';
signInForm.style.display = 'block';
});

// Switch to Sign Up Form when "Go to Sign Up" is clicked
goToSignUpBtn.addEventListener("click", function() {
signInForm.style.display = 'none';
signUpForm.style.display = 'block';
});

// Sign Up Function
signupSubmitBtn.addEventListener("click", function() {
const username = document.getElementById("signupUsername").value;
const password = document.getElementById("signupPassword").value;

createUserWithEmailAndPassword(auth, username + "@gmail.com", password)
.then((userCredential) => {
    localStorage.setItem('sender', username);
    userNameDisplay.textContent = username;
    signUpForm.style.display = 'none';
    chatUI.style.display = 'block';
})
.catch((error) => {
    console.error("Error signing up:", error);
});
});

// Log In Function
signinSubmitBtn.addEventListener("click", function() {
const username = document.getElementById("signinUsername").value;
const password = document.getElementById("signinPassword").value;

signInWithEmailAndPassword(auth, username + "@gmail.com", password)
.then((userCredential) => {
    localStorage.setItem('sender', username);
    userNameDisplay.textContent = username;
    signInForm.style.display = 'none';
    chatUI.style.display = 'block';
})
.catch((error) => {
    console.error("Error logging in:", error);
});
});

// Authentication state listener (check if the user is logged in)
onAuthStateChanged(auth, (user) => {
if (user) {
localStorage.setItem('sender', user.displayName); // Storing user in localStorage
userNameDisplay.textContent = user.displayName;
chatUI.style.display = 'block'; // Show chat UI if logged in
} else {
localStorage.removeItem('sender');
chatUI.style.display = 'none'; // Keep chat UI hidden until login/signup
}
});

// **UPDATED LOGIC:** Force Sign-in/Sign-up form to show first, even if user is already logged in or has data in localStorage
signUpForm.style.display = 'none';
signInForm.style.display = 'none';
document.getElementById("initialButtons").style.display = 'none';

const sender = localStorage.getItem('sender');

if (!sender) {
// If no sender info, show username modal
usernameModal.style.display = 'flex';
} else {
// Show the chat UI once the username is set
userNameDisplay.textContent = sender;
chatUI.style.display = 'block';
}

// Save username logic for Firebase Database
usernameSubmit.addEventListener('click', () => {
const enteredUsername = usernameInput.value.trim();
if (enteredUsername === "") {
alert("Username cannot be empty");
return;
}
localStorage.setItem('sender', enteredUsername);
userNameDisplay.textContent = enteredUsername;
usernameModal.style.display = 'none';
chatUI.style.display = 'block';
});

// Dark Mode Logic
const checkbox = document.getElementById('checkbox');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
document.body.classList.add('dark');
checkbox.checked = true;
} else {
document.body.classList.remove('dark');
checkbox.checked = false;
}

checkbox.addEventListener('change', () => {
if (checkbox.checked) {
document.body.classList.add('dark');
localStorage.setItem('theme', 'dark');
} else {
document.body.classList.remove('dark');
localStorage.setItem('theme', 'light');
}
});

// Sending message to Firebase
function sendMsg() {
const msgTxt = msgInput.value.trim();
if (msgTxt === "") {
alert("Message cannot be empty");
return;
}

const timestamp = Date.now();
set(ref(db, "messages/" + timestamp), {
msg: msgTxt,
sender: sender,
timestamp: timestamp
}).then(() => {
msgInput.value = ""; // Clear input field
}).catch((error) => {
console.error("Error sending message: ", error);
});
}

function logout() {
// Clear local storage
localStorage.removeItem('sender');
// Log out from Firebase
auth.signOut().then(() => {
// Redirect or update UI to show login/signup
chatUI.style.display = 'none';
document.getElementById("initialButtons").style.display = 'block';
}).catch((error) => {
console.error("Error logging out:", error);
});
}

// Scroll to the bottom of the messages div
function scrollToBottom() {
messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

onChildAdded(ref(db, "messages"), (data) => {
const messageData = data.val();
const formattedDate = formatDate(messageData.timestamp);

const isUser = messageData.sender === sender;
const messageHtml = `
<div class="flex ${isUser ? 'justify-end' : 'justify-start'}">
    <div class="${isUser ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} p-3 rounded-3xl max-w-xs mb-2">
        <div class="font-semibold text-sm">${isUser ? "You" : messageData.sender}</div>
        <div>${messageData.msg}</div>
        <div class="message-date">${formattedDate}</div>
    </div>
</div>
`;
messagesDiv.innerHTML += messageHtml;
scrollToBottom();
});

// Allow sending message with Enter key
msgInput.addEventListener('keypress', (e) => {
if (e.key === 'Enter') {
sendMsg();
}
});

