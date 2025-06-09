// script.js

// Firebase Configuration - PUT THIS AT THE VERY TOP OF script.js
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCVyXmjKI9pL37LJXkVcWMPtZSaXZG802c", // Use your ACTUAL Firebase API Key
    authDomain: "loginpage-6cb4a.firebaseapp.com",
    projectId: "loginpage-6cb4a",
    storageBucket: "loginpage-6cb4a.firebasestorage.app",
    messagingSenderId: "475440251033",
    appId: "1:475440251033:web:1a9b2343c07fe4a996b808",
    measurementId: "G-ZLG460T4KR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase Auth and Firestore instances
const auth = firebase.auth();
const db = firebase.firestore();

// --- Modal and Form Handling Logic ---
document.addEventListener('DOMContentLoaded', function() {
    const authModal = document.getElementById('auth-modal');
    const openAuthModalBtn = document.getElementById('open-auth-modal-btn'); // Button in header
    const closeButtons = document.querySelectorAll('#auth-modal .close-button'); // Close 'x' button(s)
    const tabButtons = document.querySelectorAll('#auth-modal .tab-button'); // Login/Signup tabs
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authMessage = document.getElementById('auth-message'); // Message display area

    // Function to show the modal
    function showAuthModal() {
        if (authModal) {
            authModal.style.display = 'flex'; // Use flex to center the content
            clearAuthMessage();
            // Optionally reset forms and default to login tab when opening
            if (loginForm) loginForm.reset();
            if (signupForm) signupForm.reset();
            switchForm('login');
        }
    }

    // Function to hide the modal
    function hideAuthModal() {
        if (authModal) {
            authModal.style.display = 'none';
            clearAuthMessage();
        }
    }

    // Function to switch between login and signup forms
    function switchForm(targetTab) {
        tabButtons.forEach(button => button.classList.remove('active'));
        if (loginForm) loginForm.classList.remove('active');
        if (signupForm) signupForm.classList.remove('active');
        clearAuthMessage();

        if (targetTab === 'login') {
            const loginTabButton = document.querySelector('.tab-button[data-tab="login"]');
            if (loginTabButton) loginTabButton.classList.add('active');
            if (loginForm) loginForm.classList.add('active');
        } else if (targetTab === 'signup') {
            const signupTabButton = document.querySelector('.tab-button[data-tab="signup"]');
            if (signupTabButton) signupTabButton.classList.add('active');
            if (signupForm) signupForm.classList.add('active');
        }
    }

    // Helper function to clear auth messages
    function clearAuthMessage() {
        if (authMessage) {
            authMessage.textContent = '';
            authMessage.className = 'auth-message'; // Reset classes
        }
    }

    // --- Event Listeners for Modal ---
    if (openAuthModalBtn) {
        openAuthModalBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            showAuthModal();
        });
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', hideAuthModal);
    });

    // Close modal if user clicks outside of the modal content
    window.addEventListener('click', function(event) {
        if (event.target === authModal) {
            hideAuthModal();
        }
    });

    // Tab buttons functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchForm(targetTab);
        });
    });


    // --- Firebase Form Submission Handlers ---

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission (page reload)
            clearAuthMessage();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            if (!email || !password) {
                authMessage.textContent = 'দয়া করে ইমেইল এবং পাসওয়ার্ড উভয়ই পূরণ করুন।';
                authMessage.classList.add('error');
                return;
            }

            authMessage.textContent = 'লগইন করা হচ্ছে...';
            authMessage.classList.add('info');

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in successfully
                    const user = userCredential.user;
                    authMessage.textContent = 'লগইন সফল! ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...';
                    authMessage.classList.add('success');
                    console.log("Logged in user:", user);
                    // Redirect to dashboard on successful login
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500); // Give time for message to display
                })
                .catch((error) => {
                    let errorMessage = 'লগইন ব্যর্থ হয়েছে।';
                    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                        errorMessage = 'ভুল ইমেইল বা পাসওয়ার্ড।';
                    } else if (error.code === 'auth/invalid-email') {
                        errorMessage = 'বৈধ ইমেইল ফরম্যাট দিন।';
                    }
                    authMessage.textContent = `ত্রুটি: ${errorMessage}`;
                    authMessage.classList.add('error');
                    console.error("Login Error:", error);
                });
        });
    }

    // Signup Form Submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
            clearAuthMessage();

            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            // Basic client-side validation
            if (!username || !email || !password) {
                authMessage.textContent = 'দয়া করে সব ফিল্ড পূরণ করুন।';
                authMessage.classList.add('error');
                return;
            }
            if (password.length < 6) {
                authMessage.textContent = 'পাসওয়ার্ডের দৈর্ঘ্য কমপক্ষে 6 অক্ষর হতে হবে।';
                authMessage.classList.add('error');
                return;
            }

            authMessage.textContent = 'রেজিস্টার করা হচ্ছে...';
            authMessage.classList.add('info');

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    // Save user data to Firestore
                    return db.collection('users').doc(user.uid).set({
                        username: username,
                        email: email,
                        // You can add more user data here if needed, e.g., default role
                    });
                })
                .then(() => {
                    authMessage.textContent = 'রেজিস্ট্রেশন সফল! এখন লগইন করুন।';
                    authMessage.classList.add('success');
                    // Optionally, send email verification
                    // if (auth.currentUser) {
                    //     auth.currentUser.sendEmailVerification().then(() => {
                    //         console.log("Email verification sent.");
                    //     });
                    // }
                    setTimeout(() => {
                        switchForm('login'); // Switch to login tab after successful signup
                        if (signupForm) signupForm.reset(); // Clear signup form
                    }, 1500);
                })
                .catch((error) => {
                    let errorMessage = 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।';
                    if (error.code === 'auth/email-already-in-use') {
                        errorMessage = 'এই ইমেইল দিয়ে ইতিমধ্যেই একটি অ্যাকাউন্ট আছে।';
                    } else if (error.code === 'auth/invalid-email') {
                        errorMessage = 'বৈধ ইমেইল ফরম্যাট দিন।';
                    } else if (error.code === 'auth/weak-password') {
                        errorMessage = 'পাসওয়ার্ডটি খুব দুর্বল। আরও শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।';
                    }
                    authMessage.textContent = `ত্রুটি: ${errorMessage}`;
                    authMessage.classList.add('error');
                    console.error("Signup Error:", error);
                });
        });
    }

    // --- Password Reset Function (optional, if you add a button for it) ---
    // You'll need a way to trigger this, e.g., a "Forgot Password?" link/button
    // For example, in loginForm, add: <div class="link" onclick="handleResetPassword()">পাসওয়ার্ড ভুলে গেছেন?</div>
    window.handleResetPassword = function() {
        clearAuthMessage();
        const emailInput = document.getElementById('login-email'); // Get email from login form
        const emailVal = emailInput ? emailInput.value : '';

        if (!emailVal) {
            authMessage.textContent = 'পাসওয়ার্ড রিসেট করতে আপনার ইমেইল দিন।';
            authMessage.classList.add('error');
            return;
        }

        auth.sendPasswordResetEmail(emailVal)
            .then(() => {
                authMessage.textContent = 'পাসওয়ার্ড রিসেট লিঙ্ক আপনার ইমেইলে পাঠানো হয়েছে!';
                authMessage.classList.add('success');
                // Optionally clear email field after sending
                if (emailInput) emailInput.value = '';
            })
            .catch((error) => {
                let errorMessage = 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।';
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'এই ইমেইলের সাথে কোনো ব্যবহারকারী নেই।';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'বৈধ ইমেইল ফরম্যাট দিন।';
                }
                authMessage.textContent = `ত্রুটি: ${errorMessage}`;
                authMessage.classList.add('error');
                console.error("Password Reset Error:", error);
            });
    };
}); // End of DOMContentLoaded


// --- Global Firebase Auth State Listener (for dashboard.html and protecting pages) ---
// This runs whenever the user's login state changes (on page load, login, logout)
auth.onAuthStateChanged(user => {
    const path = window.location.pathname;

    // Redirect to dashboard if user is logged in and on a public page
    // Ensure this logic doesn't create infinite redirects
    if (user) {
        // User is signed in
        // If they are on index.html, browse.html, categories.html, about.html, redirect them to dashboard.html
        // Make sure not to redirect if they are already on dashboard.html
        if (!path.includes('dashboard.html') &&
            (path.includes('index.html') || path === '/' || // For root path or index.html
             path.includes('browse.html') ||
             path.includes('categories.html') ||
             path.includes('about.html'))) {
            // Don't redirect if the modal is currently open and they are trying to sign up/in
            // This check might need more refinement based on specific UI
            const authModal = document.getElementById('auth-modal');
            if (!authModal || authModal.style.display !== 'flex') {
                window.location.href = 'dashboard.html';
            }
        }
    } else {
        // User is signed out
        // If they are on dashboard.html, redirect them back to index.html (or login modal)
        if (path.includes('dashboard.html')) {
            window.location.href = 'index.html'; // Or you could show the modal automatically
        }
    }
});
