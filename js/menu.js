document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    const logo = document.querySelector('.logo');
    const header = document.querySelector('header');
    const navItems = document.querySelectorAll('.nav-links li');

    // Add console logs to debug
    console.log('Menu Toggle:', menuToggle);
    console.log('Nav Links:', navLinks);
    console.log('Logo:', logo);

    // Add transition duration variable
    const TRANSITION_DURATION = 400; // 400ms = 0.4 seconds (matches CSS)

    let isAnimating = false;

    // Initialize menu state
    const initializeMenu = () => {
        navLinks.classList.add('nav-transition');
        logo.classList.add('menu-transition');
        menuToggle.classList.add('menu-transition');
    };

    // Run initialization
    initializeMenu();

    // Fix cursor issues
    document.documentElement.style.cursor = 'auto';
    document.body.style.cursor = 'auto';
    
    const links = document.querySelectorAll('a, button, .menu-toggle');
    links.forEach(link => {
        link.style.cursor = 'pointer';
    });

    // Toggle menu with proper animations
    menuToggle.addEventListener('click', () => {
        // Prevent multiple clicks during animation
        if (isAnimating) return;
        isAnimating = true;
        
        const isOpening = !navLinks.classList.contains('active');
        
        navLinks.classList.toggle('active');
        logo.classList.toggle('menu-active');
        menuToggle.classList.toggle('active');
        
        // Handle body overflow
        body.style.overflow = isOpening ? 'hidden' : 'auto';
        
        // Reset animation state after transition completes
        setTimeout(() => {
            isAnimating = false;
        }, TRANSITION_DURATION);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) {
            // Prevent multiple clicks during animation
            if (isAnimating) return;
            isAnimating = true;
            
            navLinks.classList.remove('active');
            logo.classList.remove('menu-active');
            menuToggle.classList.remove('active');
            body.style.overflow = 'auto';
            
            // Reset animation state after transition completes
            setTimeout(() => {
                isAnimating = false;
            }, TRANSITION_DURATION);
        }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navLinks.classList.remove('active');
            logo.classList.remove('menu-active');
            menuToggle.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });

    // Handle link clicks for smooth transitions
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Start closing animation
            navLinks.classList.remove('active');
            logo.classList.remove('menu-active');
            menuToggle.classList.remove('active');
            
            // Navigate after transition
            setTimeout(() => {
                window.location.href = href;
            }, TRANSITION_DURATION);
        });
    });

    // Add aria labels and roles for accessibility
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    menuToggle.setAttribute('role', 'button');
    menuToggle.setAttribute('tabindex', '0');

    // Add transparent menu styles for top bar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Handle keyboard navigation
    menuToggle.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            menuToggle.click();
        }
    });

    // Initialize intersection observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    // Select all sections and elements you want to animate
    document.querySelectorAll('section, .card, .project-card').forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}); 