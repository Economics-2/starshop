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
            // *** REMOVED browseAllBtn code from here ***
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
                authMessage.textContent = 'দয়া করে ইমেইল এবং পাসওয়ার্ড উভয়ই পূরণ করুন।';
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
                authMessage.textContent = 'দয়া করে সব ফিল্ড পূরণ করুন।';
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
                        errorMessage = 'এই ইমেইল দিয়ে ইতিমধ্যেই একটি অ্যাকাউন্ট আছে।';
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

    // --- ADD THE browseAllBtn LOGIC HERE, INSIDE DOMContentLoaded ---
    const browseAllBtn = document.getElementById('browse-all-btn');
    if (browseAllBtn) {
        browseAllBtn.addEventListener('click', function() {
            window.location.href = 'browse.html'; // Redirect to the browse page
        });
    }

    // --- eBook Data (Dummy Data for now, replace with Firestore later) ---
    const ebooksData = {
        'book1': {
            title: 'The Great Adventure',
            author: 'Jane Doe',
            cover: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Book+1',
            description: 'Join a thrilling journey through unknown lands and discover ancient secrets. This book is a fantasy epic filled with magic, mystery, and memorable characters.',
            pages: 320,
            fileSize: '5.2 MB',
            category: 'Fiction',
            pdfLink: 'download.pdf', // Replace with your actual PDF path
            demoLink: 'download.pdf' // Replace with your actual demo file path
        },
        'book2': {
            title: 'Coding Fundamentals',
            author: 'John Smith',
            cover: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Book+2',
            description: 'A comprehensive guide to the basics of programming, perfect for beginners. Learn about variables, loops, functions, and more with practical examples.',
            pages: 250,
            fileSize: '3.8 MB',
            category: 'Programming',
            pdfLink: 'download.pdf', // Replace with your actual PDF path
            demoLink: 'download.pdf' // Replace with your actual demo file path
        },
        'book3': {
            title: 'Historical Insights',
            author: 'Emily White',
            cover: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=Book+3',
            description: 'An insightful look into pivotal moments of world history, exploring their causes, impacts, and lessons for today. Essential reading for history enthusiasts.',
            pages: 400,
            fileSize: '7.5 MB',
            category: 'History',
            pdfLink: 'download.pdf', // Replace with your actual PDF path
            demoLink: 'download.pdf' // Replace with your actual demo file path
        }
        // Add more ebook data here if you add more ebook-item divs in HTML
    };

    // --- eBook Modal Handling ---
    const ebookModal = document.getElementById('ebook-modal');
    const ebookModalCloseBtn = ebookModal ? ebookModal.querySelector('.close-button') : null;
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');

    function showEbookModal(ebookId) {
        const ebook = ebooksData[ebookId];
        if (ebook && ebookModal) {
            document.getElementById('modal-title').textContent = ebook.title;
            document.getElementById('modal-cover').src = ebook.cover;
            document.getElementById('modal-description').textContent = ebook.description;
            document.getElementById('modal-author').textContent = ebook.author;
            document.getElementById('modal-pages').textContent = ebook.pages;
            document.getElementById('modal-file-size').textContent = ebook.fileSize;
            document.getElementById('modal-category').textContent = ebook.category;
            document.getElementById('modal-download-btn').href = ebook.pdfLink;
            document.getElementById('modal-demo-btn').href = ebook.demoLink;

            // Clear previous preview content and add new (if needed for real preview)
            const previewContainer = document.getElementById('modal-preview-container');
            const currentPreviewPages = previewContainer.querySelectorAll('.preview-page');
            currentPreviewPages.forEach(page => page.remove()); // Remove existing static pages

            // For now, let's just add generic preview pages
            // In a real app, you would fetch and display actual preview content
            const demoPreviewPage1 = document.createElement('div');
            demoPreviewPage1.classList.add('preview-page');
            demoPreviewPage1.setAttribute('data-page', '1');
            demoPreviewPage1.textContent = `This is a preview of Page 1 of "${ebook.title}".`;
            previewContainer.insertBefore(demoPreviewPage1, previewContainer.querySelector('.preview-navigation'));

            const demoPreviewPage2 = document.createElement('div');
            demoPreviewPage2.classList.add('preview-page'); // Initially hide
            demoPreviewPage2.setAttribute('data-page', '2');
            demoPreviewPage2.textContent = `This is a preview of Page 2 of "${ebook.title}".`;
            previewContainer.insertBefore(demoPreviewPage2, previewContainer.querySelector('.preview-navigation'));


            // Reset preview navigation display
            const currentPreviewPageSpan = document.getElementById('current-preview-page');
            const totalPreviewPagesSpan = document.getElementById('total-preview-pages');
            const prevPageBtn = previewContainer.querySelector('.prev-page-btn');
            const nextPageBtn = previewContainer.querySelector('.next-page-btn');

            currentPreviewPageSpan.textContent = '1';
            totalPreviewPagesSpan.textContent = '2'; // For demo, assuming 2 preview pages
            prevPageBtn.style.display = 'none'; // Hide prev for first page
            nextPageBtn.style.display = 'block'; // Show next for first page

            // Add event listeners for preview navigation
            const previewPages = previewContainer.querySelectorAll('.preview-page');
            let currentPageIndex = 0; // 0-indexed

            function updatePreviewDisplay() {
                previewPages.forEach((page, index) => {
                    page.style.display = (index === currentPageIndex) ? 'block' : 'none';
                });
                currentPreviewPageSpan.textContent = currentPageIndex + 1;
                prevPageBtn.style.display = (currentPageIndex === 0) ? 'none' : 'block';
                nextPageBtn.style.display = (currentPageIndex === previewPages.length - 1) ? 'none' : 'block';
            }

            prevPageBtn.onclick = () => {
                if (currentPageIndex > 0) {
                    currentPageIndex--;
                    updatePreviewDisplay();
                }
            };

            nextPageBtn.onclick = () => {
                if (currentPageIndex < previewPages.length - 1) {
                    currentPageIndex++;
                    updatePreviewDisplay();
                }
            };
            updatePreviewDisplay(); // Initialize display

            ebookModal.style.display = 'flex';
        }
    }

    function hideEbookModal() {
        if (ebookModal) {
            ebookModal.style.display = 'none';
        }
    }

    // Attach event listeners to all "View Details" buttons
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ebookId = this.getAttribute('data-ebook-id');
            showEbookModal(ebookId);
        });
    });

    // Close modal when close button is clicked
    if (ebookModalCloseBtn) {
        ebookModalCloseBtn.addEventListener('click', hideEbookModal);
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === ebookModal) {
            hideEbookModal();
        }
    });

    // --- "Load More" button for browse.html (new ID: load-more-browse-btn) ---
    const loadMoreBrowseBtn = document.getElementById('load-more-browse-btn');
    const ebookListDiv = document.getElementById('ebook-list');

    // This "Load More" will initially just show a message.
    // For real functionality, you'd fetch more books from Firestore here.
    if (loadMoreBrowseBtn) {
        loadMoreBrowseBtn.addEventListener('click', function() {
            // In a real application, you would query Firebase Firestore
            // to fetch more books and append them to ebookListDiv.
            // For now, let's just add a dummy book to show it's working.

            const newBookId = `book${Object.keys(ebooksData).length + 1}`;
            ebooksData[newBookId] = {
                title: `Dynamically Loaded Book ${Object.keys(ebooksData).length + 1}`,
                author: 'New Author',
                cover: `https://via.placeholder.com/150/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=New+Book`,
                description: 'This book was loaded dynamically when you clicked "Load More".',
                pages: Math.floor(Math.random() * 200) + 100,
                fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
                category: 'New Arrivals',
                pdfLink: 'download.pdf',
                demoLink: 'download.pdf'
            };

            const newEbookItem = document.createElement('div');
            newEbookItem.classList.add('ebook-item');
            newEbookItem.innerHTML = `
                <img src="${ebooksData[newBookId].cover}" alt="${ebooksData[newBookId].title}">
                <h3>${ebooksData[newBookId].title}</h3>
                <p>Author: ${ebooksData[newBookId].author}</p>
                <button class="view-details-btn" data-ebook-id="${newBookId}">View Details</button>
            `;
            ebookListDiv.appendChild(newEbookItem);

            // Re-attach event listener for newly added view-details-btn
            newEbookItem.querySelector('.view-details-btn').addEventListener('click', function() {
                const ebookId = this.getAttribute('data-ebook-id');
                showEbookModal(ebookId);
            });

            console.log("Loaded more books!");
            // You might want to hide the button if no more books are available from the database
        });
    }

    // You can also add search and filter logic here later
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const categorySelect = document.getElementById('category-select');

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.toLowerCase();
            console.log('Searching for:', searchTerm);
            // Implement search logic here
            alert('Search functionality coming soon! Searching for: ' + searchTerm);
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            const selectedCategory = categorySelect.value;
            console.log('Filtering by category:', selectedCategory);
            // Implement filter logic here
            alert('Filter by category functionality coming soon! Selected: ' + selectedCategory);
        });
    }


}); // End of DOMContentLoaded


// --- Global Firebase Auth State Listener (for dashboard.html and protecting pages) ---
// This runs whenever the user's login state changes (on page load, login, logout)
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
