// script.js

// Firebase Configuration - PUT THIS AT THE VERY TOP OF script.js
const firebaseConfig = {
    apiKey: "AIzaSyCVyXmjKI9pL37LJXkVcWMPtZSaXZG802c",
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
    const openAuthModalBtn = document.getElementById('open-auth-modal-btn');
    const closeButtons = document.querySelectorAll('#auth-modal .close-button');
    const tabButtons = document.querySelectorAll('#auth-modal .tab-button');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authMessage = document.getElementById('auth-message');

    function showAuthModal() {
        if (authModal) {
            authModal.style.display = 'flex';
            clearAuthMessage();
            if (loginForm) loginForm.reset();
            if (signupForm) signupForm.reset();
            switchForm('login');
            // script.js (Inside the DOMContentLoaded listener)

    const browseAllBtn = document.getElementById('browse-all-btn');

    if (browseAllBtn) {
        browseAllBtn.addEventListener('click', function() {
            window.location.href = 'browse.html'; // Redirect to the browse page
        });
    }
        }
    }

    function hideAuthModal() {
        if (authModal) {
            authModal.style.display = 'none';
            clearAuthMessage();
        }
    }

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

    function clearAuthMessage() {
        if (authMessage) {
            authMessage.textContent = '';
            authMessage.className = 'auth-message';
        }
    }

    if (openAuthModalBtn) {
        openAuthModalBtn.addEventListener('click', function(event) {
            event.preventDefault();
            showAuthModal();
        });
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', hideAuthModal);
    });

    window.addEventListener('click', function(event) {
        if (event.target === authModal) {
            hideAuthModal();
        }
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchForm(targetTab);
        });
    });

    // --- Firebase Form Submission Handlers ---
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
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
                    const user = userCredential.user;
                    authMessage.textContent = 'লগইন সফল! ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...';
                    authMessage.classList.add('success');
                    console.log("Logged in user:", user);
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                })
                .catch((error) => {
                    let errorMessage = 'লগইন ব্যর্থ হয়েছে।';
                    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                        errorMessage = 'ভুল ইমেইল বা পাসওয়ার্ড।';
                    } else if (error.code === 'auth/invalid-email') {
                        errorMessage = 'বৈধ ইমেইল ফরম্যাট দিন।';
                    } else if (error.code === 'auth/network-request-failed') {
                        errorMessage = 'ইন্টারনেট সংযোগ সমস্যা বা সার্ভার অনুপলব্ধ।';
                    } else if (error.code === 'auth/too-many-requests') {
                         errorMessage = 'অনেক বেশি লগইন প্রচেষ্টা। কিছুক্ষণ পর আবার চেষ্টা করুন।';
                    }
                    authMessage.textContent = `ত্রুটি: ${errorMessage}`;
                    authMessage.classList.add('error');
                    console.error("Login Error:", error);
                });
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearAuthMessage();

            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

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
                    return db.collection('users').doc(user.uid).set({
                        username: username,
                        email: email,
                    });
                })
                .then(() => {
                    authMessage.textContent = 'রেজিস্ট্রেশন সফল! এখন লগইন করুন।';
                    authMessage.classList.add('success');
                    console.log("User signed up and data saved to Firestore:");
                    setTimeout(() => {
                        switchForm('login');
                        if (signupForm) signupForm.reset();
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
                    } else if (error.code === 'auth/operation-not-allowed') {
                        errorMessage = 'রেজিস্ট্রেশন ফাংশন Firebase কনসোলে সক্রিয় করা নেই।';
                    }
                    authMessage.textContent = `ত্রুটি: ${errorMessage}`;
                    authMessage.classList.add('error');
                    console.error("Signup Error:", error);
                });
        });
    }

    window.handleResetPassword = function() {
        clearAuthMessage();
        const emailInput = document.getElementById('login-email');
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
// script.js (Only the auth.onAuthStateChanged part)

auth.onAuthStateChanged(user => {
    const currentPath = window.location.pathname;
    const baseDir = '/starshop/';
    const relativePath = currentPath.startsWith(baseDir) ? currentPath.substring(baseDir.length) : currentPath;

    // List of protected pages that logged-out users should be redirected *from*
    const protectedPages = ['dashboard.html']; // Only dashboard.html is protected now

    if (user) {
        // User is signed in
        // *** NO REDIRECTION FROM PUBLIC PAGES TO DASHBOARD IF THEY ARE LOGGED IN ***
        // This means logged-in users can freely visit index.html, browse.html, etc.
    } else {
        // User is signed out
        // If they are on a protected page (like dashboard.html), redirect them back to index.html
        if (protectedPages.includes(relativePath)) {
            window.location.href = 'index.html';
        }
    }
});
