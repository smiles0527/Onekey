window.addEventListener('load', () => {
    const anchors = document.querySelectorAll('a');
    const transition_el = document.querySelector('main');
    
    if (!transition_el) {
        console.error('Main element not found');
        return;
    }

    // Remove slide-out class on page load
    transition_el.classList.remove('slide-out');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', e => {
            // Only handle navigation links
            if (!anchor.href || anchor.href.includes('#')) return;
            
            e.preventDefault();
            let target = anchor.href;
            
            // Add slide-out class
            transition_el.classList.add('slide-out');
            
            // Navigate after animation
            setTimeout(() => {
                window.location.href = target;
            }, 500);
        });
    });
});
