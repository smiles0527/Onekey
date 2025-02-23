document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    const logo = document.querySelector('.logo');
    const header = document.querySelector('header');

    // Add console logs to debug
    console.log('Menu Toggle:', menuToggle);
    console.log('Nav Links:', navLinks);
    console.log('Logo:', logo);

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        logo.classList.toggle('menu-active');
        menuToggle.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            logo.classList.remove('menu-active');
            menuToggle.classList.remove('active');
            body.style.overflow = 'auto';
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

    // Add aria labels and roles for accessibility
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    menuToggle.setAttribute('role', 'button');
    menuToggle.setAttribute('tabindex', '0');

    // Add transparent menu styles
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

    // Add scroll animation
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