/* =========================================
   1. ফায়ারবেস ইনিশিয়ালাইজেশন (আপনার কনফিগারেশন)
   ========================================= */
const firebaseConfig = {
  apiKey: "AIzaSyCqxhTm4jtRA6aQIN6dxYPu8JpEb9s8K2o",
  authDomain: "star-shop-1fe3f.firebaseapp.com",
  projectId: "star-shop-1fe3f",
  storageBucket: "star-shop-1fe3f.firebasestorage.app",
  messagingSenderId: "406302393334",
  appId: "1:406302393334:web:e56bc053a710d1dd64bdd7"
};

// ফায়ারবেস অ্যাপ শুরু করা
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// ফায়ারবেস সার্ভিসসমূহ
const auth = firebase.auth();
const db = firebase.firestore();

/* =========================================
   2. ডেমো ডেটা (বইয়ের তালিকা)
   ========================================= */
// বর্তমানে ডাটাবেসে বই না থাকলেও সাইট যাতে সুন্দর দেখায়, তাই এই ডেমো লিস্ট রাখা হলো।
// আপনি পরে Firestore থেকে ডাটা লোড করার কোড চালু করতে পারবেন।
const demoBooks = [
    {
        id: 1,
        title: "অর্থনীতির সহজ পাঠ",
        author: "মোঃ মঞ্জিরুল হক",
        pages: "১২০",
        size: "৩.৫ এমবি",
        cover: "https://via.placeholder.com/300x450/0f172a/00d2ff?text=Economics+101",
        description: "উচ্চ মাধ্যমিক ও স্নাতক শিক্ষার্থীদের জন্য অর্থনীতির জটিল বিষয়গুলোর সহজ বিশ্লেষণ।",
        category: "Economics"
    },
    {
        id: 2,
        title: "গ্রাফিক্স ডিজাইন মাস্টারি",
        author: "মোঃ মঞ্জিরুল হক",
        pages: "৮৫",
        size: "১০ এমবি",
        cover: "https://via.placeholder.com/300x450/0f172a/3a7bd5?text=Graphics+Design",
        description: "ফটোশপ এবং ইলাস্ট্রেটর ব্যবহার করে প্রফেশনাল ডিজাইন শেখার পূর্ণাঙ্গ গাইড।",
        category: "Design"
    },
    {
        id: 3,
        title: "প্রাচীন বাংলার ইতিহাস",
        author: "ইতিহাস বিভাগ",
        pages: "২০০",
        size: "৫.২ এমবি",
        cover: "https://via.placeholder.com/300x450/0f172a/e2e8f0?text=History+BD",
        description: "কৌটিল্যের অর্থশাস্ত্র থেকে শুরু করে বাংলাদেশের অভ্যুদয় পর্যন্ত ইতিহাসের ধারা।",
        category: "History"
    },
    {
        id: 4,
        title: "ডিজিটাল মার্কেটিং সিক্রেটস",
        author: "স্টারলাইন একাডেমি",
        pages: "৫০",
        size: "২ এমবি",
        cover: "https://via.placeholder.com/300x450/0f172a/00d2ff?text=Digital+Marketing",
        description: "ফেসবুক ও ইউটিউব কন্টেন্ট ক্রিয়েশন এবং মনিটাইজেশন গাইডলাইন।",
        category: "Marketing"
    }
];

/* =========================================
   3. ভেরিয়েবল এবং এলিমেন্ট সিলেক্টর
   ========================================= */
const ebookList = document.getElementById('ebook-list');
const loadMoreBtn = document.getElementById('load-more-btn');
const modal = document.getElementById('ebook-modal');
const authModal = document.getElementById('auth-modal');

// মডাল এলিমেন্টস
const modalTitle = document.querySelector('.modal-body h3');
const modalCover = document.querySelector('.modal-cover');
const modalDesc = document.querySelector('.modal-description');
const modalAuthor = document.getElementById('author-name');
const modalPages = document.getElementById('page-count');
const modalSize = document.getElementById('file-size');

/* =========================================
   4. বই রেন্ডার করা (UI আপডেট)
   ========================================= */
function renderBooks(books) {
    ebookList.innerHTML = ''; 

    books.forEach((book, index) => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('ebook-card');
        
        // এনিমেশন
        bookCard.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        bookCard.style.opacity = '0';

        bookCard.innerHTML = `
            <div style="text-align: center; overflow: hidden; border-radius: 10px; margin-bottom: 15px;">
                <img src="${book.cover}" alt="${book.title}" style="width: 100%; height: 250px; object-fit: cover; transition: transform 0.3s;">
            </div>
            <h3 style="color: var(--primary-color); font-size: 1.2rem; margin-bottom: 5px;">${book.title}</h3>
            <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 15px;">${book.author}</p>
            <button class="cta-button" onclick="openBookModal(${book.id})" style="width: 100%; font-size: 0.9rem; padding: 8px 0;">বিস্তারিত দেখুন</button>
        `;

        ebookList.appendChild(bookCard);
    });

    // CSS এনিমেশন স্টাইল যোগ করা
    if (!document.getElementById('dynamic-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'dynamic-styles';
        styleSheet.innerText = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

/* =========================================
   5. মডাল ওপেন ফাংশন
   ========================================= */
window.openBookModal = function(bookId) {
    const book = demoBooks.find(b => b.id === bookId);
    if (book) {
        modalTitle.innerText = book.title;
        modalCover.src = book.cover;
        modalDesc.innerText = book.description;
        modalAuthor.innerText = book.author;
        modalPages.innerText = book.pages;
        modalSize.innerText = book.size;
        modal.style.display = 'block';
    }
};

/* =========================================
   6. ইভেন্ট লিসেনার (Load More & Modals)
   ========================================= */
if(loadMoreBtn){
    loadMoreBtn.addEventListener('click', () => {
        alert("শীঘ্রই আরও বই যুক্ত করা হবে! আমাদের সাথেই থাকুন।");
    });
}

// পেজ লোড হলে বই দেখাও
document.addEventListener('DOMContentLoaded', () => {
    renderBooks(demoBooks);
    checkAuthState(); // ব্যবহারকারী লগইন আছে কিনা চেক করুন
});

/* =========================================
   7. অথেনটিকেশন লজিক (লগইন/সাইনআপ)
   ========================================= */
const loginForm = document.getElementById('login-form');

if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        const submitBtn = e.target.querySelector('button');
        
        submitBtn.innerText = "লগইন হচ্ছে...";

        // ফায়ারবেস লগইন ফাংশন
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // সফল হলে
                alert("লগইন সফল হয়েছে! স্বাগতম।");
                authModal.style.display = 'none';
                updateUIForUser(userCredential.user);
            })
            .catch((error) => {
                // ভুল হলে
                alert("ত্রুটি: " + error.message);
            })
            .finally(() => {
                submitBtn.innerText = "লগইন করুন";
            });
    });
}

// লগইন অবস্থা চেক করা এবং UI আপডেট করা
function checkAuthState() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            updateUIForUser(user);
        } else {
            console.log("No user logged in");
        }
    });
}

function updateUIForUser(user) {
    const loginBtn = document.getElementById('open-auth-modal-btn');
    if(loginBtn) {
        loginBtn.innerText = "ড্যাশবোর্ড";
        loginBtn.href = "dashboard.html";
        loginBtn.onclick = null; // মডাল ওপেন ইভেন্ট রিমুভ করা
        loginBtn.style.background = "var(--primary-color)";
        loginBtn.style.color = "#000";
    }
}
