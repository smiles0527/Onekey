// Admin Authentication System JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Admin credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin';
    const ADMIN_EMAIL = 'on3keymusic@gmail.com';
    
    // Get modal elements
    const loginModal = document.getElementById('loginModal');
    
    // Get button elements
    const loginBtn = document.getElementById('loginBtn');
    const closeLogin = document.getElementById('closeLogin');
    
    // Get form elements
    const loginForm = document.getElementById('loginForm');

    // Open Login Modal
    loginBtn.addEventListener('click', function() {
        openModal(loginModal);
    });

    // Close Login Modal
    closeLogin.addEventListener('click', function() {
        closeModal(loginModal);
    });

    // Close modal when clicking outside
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            closeModal(loginModal);
        }
    });

    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        // Add loading state
        const submitBtn = this.querySelector('.auth-submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Logging in...';
        
        // Check admin credentials
        setTimeout(() => {
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                showMessage('success', 'Admin login successful! Welcome to OneKey.');
                closeModal(loginModal);
                updateUIForLoggedInUser();
            } else {
                showMessage('error', 'Invalid admin credentials. Please try again.');
            }
            
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Login';
        }, 1000);
    });

    // Handle ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal(loginModal);
        }
    });

    // Utility Functions
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Clear any previous messages
        const existingMessages = modal.querySelectorAll('.auth-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 300);
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear form data
        const form = modal.querySelector('form');
        if (form) form.reset();
        
        // Clear any messages
        const messages = modal.querySelectorAll('.auth-message');
        messages.forEach(msg => msg.remove());
    }

    function showMessage(type, text) {
        // Remove existing messages
        document.querySelectorAll('.auth-message').forEach(msg => msg.remove());
        
        // Create new message
        const message = document.createElement('div');
        message.className = `auth-message ${type}`;
        message.textContent = text;
        
        // Insert at top of active form
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            const form = activeModal.querySelector('.auth-form');
            form.insertBefore(message, form.firstChild);
        }
        
        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                message.remove();
            }, 3000);
        }
    }

    function updateUIForLoggedInUser() {
        // Update auth buttons to show admin is logged in
        const authButtons = document.querySelector('.auth-buttons');
        authButtons.innerHTML = `
            <div class="user-menu">
                <button class="user-btn" id="userBtn">
                    <i class="fas fa-shield-alt"></i>
                    <span class="user-email">Admin</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-dropdown" id="userDropdown">
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-tachometer-alt"></i>
                        Dashboard
                    </a>
                    <a href="html/timeline.html" class="dropdown-item">
                        <i class="fas fa-edit"></i>
                        Manage Timeline
                    </a>
                    <hr class="dropdown-divider">
                    <a href="#" class="dropdown-item" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </a>
                </div>
            </div>
        `;
        
        // Add user dropdown functionality
        const userBtn = document.getElementById('userBtn');
        const userDropdown = document.getElementById('userDropdown');
        const logoutBtn = document.getElementById('logoutBtn');
        
        userBtn.addEventListener('click', function() {
            userDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userBtn.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
        
        // Handle logout
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
        
        // Store login state
        localStorage.setItem('onekey_admin_logged_in', 'true');
    }

    function logout() {
        // Clear stored data
        localStorage.removeItem('onekey_admin_logged_in');
        
        // Reset auth buttons
        const authButtons = document.querySelector('.auth-buttons');
        authButtons.innerHTML = `
            <button class="login-btn" id="loginBtn">
                <i class="fas fa-user"></i>
                Login
            </button>
        `;
        
        // Re-attach event listener
        document.getElementById('loginBtn').addEventListener('click', function() {
            openModal(loginModal);
        });
        
        showMessage('success', 'Admin logged out successfully.');
    }

    // Check if admin is already logged in on page load
    function checkLoginState() {
        const isLoggedIn = localStorage.getItem('onekey_admin_logged_in');
        
        if (isLoggedIn === 'true') {
            updateUIForLoggedInUser();
        }
    }

    // Initialize login state check
    checkLoginState();
});

// Add CSS for user dropdown (injected via JavaScript)
const userDropdownCSS = `
    .user-menu {
        position: relative;
    }
    
    .user-btn {
        padding: 0.6rem 1.2rem;
        border: 2px solid #e0e6ed;
        border-radius: 25px;
        background: white;
        color: #2c3e50;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .user-btn:hover {
        border-color: #667eea;
        color: #667eea;
        transform: translateY(-2px);
    }
    
    .user-email {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .user-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 0.5rem;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        border: 1px solid #e0e6ed;
        min-width: 180px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .user-dropdown.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.8rem 1rem;
        color: #2c3e50;
        text-decoration: none;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }
    
    .dropdown-item:hover {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
    }
    
    .dropdown-item:first-child {
        border-radius: 10px 10px 0 0;
    }
    
    .dropdown-item:last-child {
        border-radius: 0 0 10px 10px;
    }
    
    .dropdown-divider {
        margin: 0;
        border: none;
        border-top: 1px solid #e0e6ed;
    }
    
    @media (max-width: 768px) {
        .user-menu {
            display: none;
        }
    }
`;

// Inject the CSS
const style = document.createElement('style');
style.textContent = userDropdownCSS;
document.head.appendChild(style); 