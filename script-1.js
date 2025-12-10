// ==== Advanced, Attractive, Mobile-Friendly, and Futuristic script.js ====

// --- Firebase Configuration (ALWAYS AT THE TOP) ---
const firebaseConfig = {
    apiKey: "AIzaSyCVyXmjKI9pL37LJXkVcWMPtZSaXZG802c",
    authDomain: "loginpage-6cb4a.firebaseapp.com",
    projectId: "loginpage-6cb4a",
    storageBucket: "loginpage-6cb4a.appspot.com",
    messagingSenderId: "475440251033",
    appId: "1:475440251033:web:1a9b2343c07fe4a996b808",
    measurementId: "G-ZLG460T4KR"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- Utility Functions ---
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const showToast = (msg, type = "info", duration = 3000) => {
    let toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 10);
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
    }, duration);
};

// --- Modal & Responsive Handling ---
function openModal(modalId) {
    const modal = $(`#${modalId}`);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        modal.scrollTop = 0;
        setTimeout(() => modal.classList.add('active'), 10);
    }
}

function closeModal(modalId) {
    const modal = $(`#${modalId}`);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }, 200);
    }
}

// Close modals when clicking outside or on .close-button
document.addEventListener('click', e => {
    if (
        e.target.classList.contains('modal') ||
        e.target.classList.contains('close-button')
    ) {
        const modals = $$('.modal');
        modals.forEach(m => closeModal(m.id));
    }
});

// --- Tab Switching (Login/Signup) ---
function switchTab(tab) {
    $$('.tab-button').forEach(btn => btn.classList.remove('active'));
    $$('.auth-form').forEach(form => form.classList.remove('active'));
    $(`.tab-button[data-tab="${tab}"]`).classList.add('active');
    $(`#${tab}-form`).classList.add('active');
}

// --- Dynamic Auth Modal Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Show/hide modals
    $('#open-auth-modal-btn')?.addEventListener('click', e => {
        e.preventDefault();
        openModal('auth-modal');
        switchTab('login');
    });

    $$('.tab-button').forEach(btn => btn.onclick = () => switchTab(btn.dataset.tab));

    // --- Auth Form Handlers ---
    const authMessage = $('#auth-message');
    const setAuthMsg = (msg, type = "info") => {
        authMessage.textContent = msg;
        authMessage.className = `auth-message ${type}`;
    };

    // Login Handler
    $('#login-form')?.addEventListener('submit', async e => {
        e.preventDefault();
        setAuthMsg("");
        const email = $('#login-email').value.trim();
        const password = $('#login-password').value;
        if (!email || !password) return setAuthMsg('Please enter both Email and Password.', 'error');
        setAuthMsg('Logging in...', 'info');
        try {
            await auth.signInWithEmailAndPassword(email, password);
            setAuthMsg('Login Successful! Redirecting...', 'success');
            showToast('Welcome back!', 'success');
            await sleep(1200);
            window.location.href = 'dashboard.html';
        } catch (error) {
            let msg = "Login failed.";
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    msg = "Incorrect email or password."; break;
                case 'auth/invalid-email':
                    msg = "Please enter a valid email."; break;
                case 'auth/network-request-failed':
                    msg = "Network error. Try again."; break;
                case 'auth/too-many-requests':
                    msg = "Too many attempts. Please wait."; break;
            }
            setAuthMsg(`Error: ${msg}`, 'error');
            showToast(msg, 'error');
        }
    });

    // Signup Handler
    $('#signup-form')?.addEventListener('submit', async e => {
        e.preventDefault();
        setAuthMsg("");
        const username = $('#signup-username').value.trim();
        const email = $('#signup-email').value.trim();
        const password = $('#signup-password').value;
        if (!username || !email || !password)
            return setAuthMsg('Fill in all fields.', 'error');
        if (password.length < 6)
            return setAuthMsg('Password must be at least 6 characters.', 'error');

        setAuthMsg('Registering...', 'info');
        try {
            const { user } = await auth.createUserWithEmailAndPassword(email, password);
            await db.collection('users').doc(user.uid).set({ username, email });
            setAuthMsg('Registration successful! Please log in.', 'success');
            showToast('Account created! Please log in.', 'success');
            await sleep(1200);
            switchTab('login');
            $('#signup-form').reset();
        } catch (error) {
            let msg = "Registration failed.";
            switch (error.code) {
                case 'auth/email-already-in-use': msg = "Email already in use."; break;
                case 'auth/invalid-email': msg = "Enter a valid email."; break;
                case 'auth/weak-password': msg = "Password too weak."; break;
                case 'auth/operation-not-allowed': msg = "Registration not enabled in Firebase."; break;
            }
            setAuthMsg(`Error: ${msg}`, 'error');
            showToast(msg, 'error');
        }
    });

    // Password Reset
    window.handleResetPassword = async () => {
        setAuthMsg("");
        const email = $('#login-email').value.trim();
        if (!email) return setAuthMsg('Enter your email to reset password.', 'error');
        try {
            await auth.sendPasswordResetEmail(email);
            setAuthMsg('Reset link sent! Check your email.', 'success');
            showToast('Reset link sent!', 'success');
        } catch (error) {
            let msg = "Reset failed.";
            switch (error.code) {
                case 'auth/user-not-found': msg = "No user with this email."; break;
                case 'auth/invalid-email': msg = "Invalid email format."; break;
            }
            setAuthMsg(`Error: ${msg}`, 'error');
            showToast(msg, 'error');
        }
    };

    // --- Futuristic Browse Button ---
    $('#browse-all-btn')?.addEventListener('click', () => window.location.href = 'browse.html');

    // --- eBook Data (Simulate for Demo) ---
    let ebooksData = {
        'book1': {
            title: 'The Great Adventure',
            author: 'Jane Doe',
            cover: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Book+1',
            description: 'A thrilling fantasy adventure through unknown lands.',
            pages: 320,
            fileSize: '5.2 MB',
            category: 'Fiction',
            pdfLink: 'download.pdf',
            demoLink: 'download.pdf'
        },
        'book2': {
            title: 'Coding Fundamentals',
            author: 'John Smith',
            cover: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Book+2',
            description: 'Learn programming basics with practical examples.',
            pages: 250,
            fileSize: '3.8 MB',
            category: 'Programming',
            pdfLink: 'download.pdf',
            demoLink: 'download.pdf'
        },
        'book3': {
            title: 'Historical Insights',
            author: 'Emily White',
            cover: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=Book+3',
            description: 'Explore pivotal moments in world history.',
            pages: 400,
            fileSize: '7.5 MB',
            category: 'History',
            pdfLink: 'download.pdf',
            demoLink: 'download.pdf'
        }
    };

    // --- Ebook Modal Logic (Responsive & Futuristic) ---
    const ebookModal = $('#ebook-modal');
    const previewContainer = $('#modal-preview-container');
    let currentPreviewIndex = 0;

    function renderPreviewPages(ebook) {
        previewContainer.querySelectorAll('.preview-page').forEach(el => el.remove());
        for (let i = 1; i <= 2; i++) {
            let page = document.createElement('div');
            page.className = 'preview-page';
            page.setAttribute('data-page', i);
            page.textContent = `Preview of "${ebook.title}" - Page ${i}`;
            previewContainer.insertBefore(page, $('.preview-navigation', previewContainer));
        }
    }

    function updatePreviewNav() {
        const pages = previewContainer.querySelectorAll('.preview-page');
        pages.forEach((p, idx) => p.style.display = idx === currentPreviewIndex ? 'block' : 'none');
        $('#current-preview-page').textContent = currentPreviewIndex + 1;
        $('#total-preview-pages').textContent = pages.length;
        $('.prev-page-btn').style.display = currentPreviewIndex === 0 ? 'none' : 'block';
        $('.next-page-btn').style.display = currentPreviewIndex === pages.length - 1 ? 'none' : 'block';
    }

    function showEbookModal(ebookId) {
        const ebook = ebooksData[ebookId];
        if (!ebook) return;
        $('#modal-title').textContent = ebook.title;
        $('#modal-cover').src = ebook.cover;
        $('#modal-description').textContent = ebook.description;
        $('#modal-author').textContent = ebook.author;
        $('#modal-pages').textContent = ebook.pages;
        $('#modal-file-size').textContent = ebook.fileSize;
        $('#modal-category').textContent = ebook.category;
        $('#modal-download-btn').href = ebook.pdfLink;
        $('#modal-demo-btn').href = ebook.demoLink;
        renderPreviewPages(ebook);
        currentPreviewIndex = 0;
        updatePreviewNav();
        openModal('ebook-modal');
    }

    // Modal nav buttons
    $('.prev-page-btn')?.addEventListener('click', () => {
        if (currentPreviewIndex > 0) { currentPreviewIndex--; updatePreviewNav(); }
    });
    $('.next-page-btn')?.addEventListener('click', () => {
        const total = previewContainer.querySelectorAll('.preview-page').length;
        if (currentPreviewIndex < total - 1) { currentPreviewIndex++; updatePreviewNav(); }
    });

    // Ebook "View Details" buttons
    $$('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => showEbookModal(btn.dataset.ebookId));
    });

    // --- Load More Logic (Futuristic, Dynamic) ---
    $('#load-more-browse-btn')?.addEventListener('click', () => {
        // Simulate dynamic loading from Firestore for demo
        const id = `book${Object.keys(ebooksData).length + 1}`;
        const newBook = {
            title: `Dynamically Loaded Book ${Object.keys(ebooksData).length + 1}`,
            author: 'New Author',
            cover: `https://via.placeholder.com/150/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=New+Book`,
            description: 'Loaded dynamically!',
            pages: Math.floor(Math.random() * 200) + 100,
            fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
            category: 'New Arrivals',
            pdfLink: 'download.pdf',
            demoLink: 'download.pdf'
        };
        ebooksData[id] = newBook;
        const newDiv = document.createElement('div');
        newDiv.className = 'ebook-item';
        newDiv.innerHTML = `
            <img src="${newBook.cover}" alt="${newBook.title}">
            <h3>${newBook.title}</h3>
            <p>Author: ${newBook.author}</p>
            <button class="view-details-btn" data-ebook-id="${id}">View Details</button>
        `;
        $('#ebook-list').appendChild(newDiv);
        newDiv.querySelector('.view-details-btn').addEventListener('click', () => showEbookModal(id));
        showToast('More books loaded!', 'info');
    });

    // --- Search & Filter Logic (Mobile-Friendly) ---
    $('#search-button')?.addEventListener('click', () => {
        const term = $('#search-input').value.trim().toLowerCase();
        if (!term) return showToast('Enter a search term.', 'error');
        // -- Implement actual search logic here --
        showToast(`Search: "${term}" (Coming soon!)`, 'info');
    });

    $('#category-select')?.addEventListener('change', () => {
        const category = $('#category-select').value;
        // -- Implement actual filter logic here --
        showToast(`Filter: "${category}" (Coming soon!)`, 'info');
    });

    // --- Mobile Friendly: Add swipe close for modals ---
    let startY = null;
    $$('.modal').forEach(modal => {
        modal.addEventListener('touchstart', e => startY = e.touches[0].clientY, { passive: true });
        modal.addEventListener('touchmove', e => {
            if (startY !== null && e.touches[0].clientY - startY > 80)
                closeModal(modal.id);
        }, { passive: true });
        modal.addEventListener('touchend', () => startY = null);
    });
});

// --- Auth State Listener: Protect dashboard.html ---
auth.onAuthStateChanged(user => {
    const path = window.location.pathname;
    const baseDir = '/starshop/';
    const relPath = path.startsWith(baseDir) ? path.substring(baseDir.length) : path.replace(/^\//, '');
    const protectedPages = ['dashboard.html'];
    if (!user && protectedPages.includes(relPath)) window.location.href = 'index.html';
});

// --- Futuristic: Dark/Light Mode Toggle Example ---
if ($('#theme-toggle-btn')) {
    $('#theme-toggle-btn').onclick = () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    };
    // Apply on load
    if (localStorage.getItem('theme') === 'dark')
        document.body.classList.add('dark-mode');
}


// Example: Assume you have an array of eBook objects
const ebooks = [
  // { title: "...", author: "...", cover: "...", ... }
];
let currentIndex = 0;
const itemsPerPage = 6;
const ebookList = document.getElementById('ebook-list');
const loadMoreBtn = document.getElementById('load-more-btn');

function renderEbooks() {
  const nextItems = ebooks.slice(currentIndex, currentIndex + itemsPerPage);
  nextItems.forEach(ebook => {
    const card = document.createElement('div');
    card.className = 'ebook-card';
    card.innerHTML = `
      <img src="${ebook.cover}" alt="${ebook.title}" style="width:100%;border-radius:12px;">
      <h3>${ebook.title}</h3>
      <p>by ${ebook.author}</p>
    `;
    ebookList.appendChild(card);
  });
  currentIndex += itemsPerPage;
  if (currentIndex >= ebooks.length) loadMoreBtn.style.display = 'none';
}

loadMoreBtn.addEventListener('click', renderEbooks);

// Initial load
renderEbooks();


// --- Style: Add CSS for .toast and mobile/modal enhancements in your stylesheet! ---
