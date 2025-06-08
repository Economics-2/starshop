document.addEventListener('DOMContentLoaded', () => {
    const ebookListContainer = document.getElementById('ebook-list');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const ebookModal = document.getElementById('ebook-modal');
    const authModal = document.getElementById('auth-modal');
    const closeButtons = document.querySelectorAll('.close-button');
    const loginSignupBtn = document.getElementById('login-signup-btn');
    const authTabButtons = document.querySelectorAll('.auth-form .tab-button');
    const authFormContents = document.querySelectorAll('.auth-form-content');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authMessage = document.getElementById('auth-message');
    const browseAllBtn = document.getElementById('browse-all-btn');
    const browseSection = document.getElementById('browse');

    let eBooksData = []; // This will hold your 100+ eBook data
    let currentPage = 0;
    const itemsPerPage = 9; // Number of eBooks to display per load

    // Dummy eBook Data (Replace with your actual data)
    // In a real scenario, you'd fetch this from an API/JSON file
    function generateDummyEbooks(count) {
        const dummyBooks = [];
        for (let i = 1; i <= count; i++) {
            dummyBooks.push({
                id: i,
                title: `Awesome eBook Title ${i}`,
                author: `Author Name ${i % 5 + 1}`,
                description: `This is a fascinating description for eBook ${i}. It covers various topics and provides insightful knowledge. You'll learn a lot from this detailed and comprehensive guide.`,
                cover: `https://via.placeholder.com/280x250/4CAF50/FFFFFF?text=Book+${i}`, // Placeholder image
                pdfLink: `https://example.com/ebooks/book${i}.pdf`, // Replace with actual PDF links
                demoFileLink: `https://example.com/demos/demo_book${i}.zip`, // Replace with actual demo files
                pages: Math.floor(Math.random() * 300) + 100, // Random pages between 100 and 400
                fileSize: `${(Math.random() * 10 + 2).toFixed(1)} MB` // Random file size
            });
        }
        return dummyBooks;
    }

    eBooksData = generateDummyEBook`s(100); // Generate 100 dummy eBooks

    // Function to render eBooks
    function renderEbooks() {
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const booksToRender = eBooksData.slice(startIndex, endIndex);

        booksToRender.forEach(book => {
            const ebookCard = document.createElement('div');
            ebookCard.classList.add('ebook-card');
            ebookCard.innerHTML = `
                <div class="ebook-card-cover">
                    <img src="${book.cover}" alt="${book.title} Cover">
                </div>
                <div class="ebook-card-info">
                    <h3>${book.title}</h3>
                    <p>by ${book.author}</p>
                    <div class="ebook-card-actions">
                        <button class="view-details-btn" data-id="${book.id}">View Details</button>
                    </div>
                </div>
            `;
            ebookListContainer.appendChild(ebookCard);
        });

        // Hide load more button if all books are loaded
        if (endIndex >= eBooksData.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    // Initial load
    renderEbooks();

    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderEbooks();
    });

    // Smooth scroll for "Browse All eBooks" button
    browseAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        browseSection.scrollIntoView({ behavior: 'smooth' });
    });

    // eBook Modal Logic
    ebookListContainer.addEventListener('click', (e) => {
        const viewDetailsBtn = e.target.closest('.view-details-btn');
        if (viewDetailsBtn) {
            const bookId = parseInt(viewDetailsBtn.dataset.id);
            const book = eBooksData.find(b => b.id === bookId);

            if (book) {
                document.querySelector('#ebook-modal h3').textContent = book.title;
                document.querySelector('.modal-cover').src = book.cover;
                document.querySelector('.modal-cover').alt = `${book.title} Cover`;
                document.querySelector('.modal-description').textContent = book.description;
                document.getElementById('modal-author').textContent = book.author;
                document.getElementById('modal-pages').textContent = book.pages;
                document.getElementById('modal-file-size').textContent = book.fileSize;
                document.querySelector('.download-btn').href = book.pdfLink;
                document.querySelector('.demo-file-btn').href = book.demoFileLink;

                // Simple 5-page preview system (conceptual)
                const previewContainer = document.getElementById('modal-preview-container');
                previewContainer.innerHTML = `<h4>Preview:</h4>`; // Clear previous previews
                for (let i = 1; i <= 5; i++) {
                    const previewPage = document.createElement('div');
                    previewPage.classList.add('preview-page');
                    previewPage.setAttribute('data-page', i);
                    previewPage.textContent = `Demo page ${i} of "${book.title}"`;
                    if (i === 1) previewPage.classList.add('active'); // Show first page by default
                    previewContainer.appendChild(previewPage);
                }

                const previewNav = document.createElement('div');
                previewNav.classList.add('preview-navigation');
                previewNav.innerHTML = `
                    <button class="prev-page-btn"><i class="fas fa-chevron-left"></i></button>
                    <span id="current-preview-page">1</span> / <span id="total-preview-pages">5</span>
                    <button class="next-page-btn"><i class="fas fa-chevron-right"></i></button>
                `;
                previewContainer.appendChild(previewNav);

                // Attach preview navigation listeners
                let currentPreviewPageIndex = 1;
                const totalPreviewPages = 5; // Fixed for demo

                const updatePreview = () => {
                    document.querySelectorAll('.preview-page').forEach(page => page.classList.remove('active'));
                    document.querySelector(`.preview-page[data-page="${currentPreviewPageIndex}"]`).classList.add('active');
                    document.getElementById('current-preview-page').textContent = currentPreviewPageIndex;
                };

                previewNav.querySelector('.prev-page-btn').onclick = () => {
                    if (currentPreviewPageIndex > 1) {
                        currentPreviewPageIndex--;
                        updatePreview();
                    }
                };
                previewNav.querySelector('.next-page-btn').onclick = () => {
                    if (currentPreviewPageIndex < totalPreviewPages) {
                        currentPreviewPageIndex++;
                        updatePreview();
                    }
                };

                ebookModal.style.display = 'block';
            }
        }
    });

    // Close Modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            ebookModal.style.display = 'none';
            authModal.style.display = 'none';
            authMessage.textContent = ''; // Clear auth messages
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === ebookModal) {
            ebookModal.style.display = 'none';
        }
        if (event.target === authModal) {
            authModal.style.display = 'none';
            authMessage.textContent = ''; // Clear auth messages
        }
    });

    // Auth Modal Logic
    loginSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        authModal.style.display = 'block';
        // Ensure login tab is active by default when opening
        document.querySelector('.tab-button[data-tab="login"]').click();
    });

    authTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            authTabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            authFormContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${button.dataset.tab}-form`).classList.add('active');
            authMessage.textContent = ''; // Clear message on tab switch
        });
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('#login-email').value;
        const password = loginForm.querySelector('#login-password').value;

        // --- DEMO Login Logic ---
        if (email === 'user@example.com' && password === 'password123') {
            authMessage.textContent = 'Login successful! Redirecting...';
            authMessage.style.color = 'green';
            setTimeout(() => {
                authModal.style.display = 'none';
                alert('You are logged in!'); // Replace with actual redirect/UI update
                // In a real app, you'd handle session/token here
            }, 1000);
        } else {
            authMessage.textContent = 'Invalid email or password.';
            authMessage.style.color = 'red';
        }
        // -----------------------
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = signupForm.querySelector('#signup-username').value;
        const email = signupForm.querySelector('#signup-email').value;
        const password = signupForm.querySelector('#signup-password').value;

        // --- DEMO Signup Logic ---
        // In a real application, you would send this to a server
        // and handle user creation, password hashing, etc.
        if (username && email && password) {
            authMessage.textContent = `Signed up as ${username}! Please login.`;
            authMessage.style.color = 'green';
            signupForm.reset(); // Clear form
            // Automatically switch to login tab after successful signup (demo)
            document.querySelector('.tab-button[data-tab="login"]').click();
        } else {
            authMessage.textContent = 'Please fill in all fields.';
            authMessage.style.color = 'red';
        }
        // -----------------------
    });

    // Navbar active link highlighting
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    const sections = document.querySelectorAll('section'); // Assuming sections have IDs matching nav hrefs

    const highlightNavLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100 && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Call on load to set initial active link

    // Optional: Subtle 3D tilt effect on cards using mousemove
    // This is a more advanced effect and might impact performance with 100+ cards
    // For a robust solution, consider libraries like 'vanilla-tilt.js'
    // or implement a simpler CSS hover transform. The current CSS already has a subtle one.

    /*
    const ebookCards = document.querySelectorAll('.ebook-card');
    ebookCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * 10; // Max 10deg rotation
            const rotateY = ((centerX - x) / centerX) * 10; // Max 10deg rotation

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            card.style.boxShadow = `
                ${-rotateY * 0.5}px ${rotateX * 0.5}px 30px rgba(0, 0, 0, 0.3),
                0 10px 25px var(--shadow-light)
            `; // Dynamic shadow
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            card.style.boxShadow = '0 10px 25px var(--shadow-light)'; // Reset shadow
        });
    });
    */

});
