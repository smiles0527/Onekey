// Create and style cursor
let circle = document.createElement("div");
circle.id = "circle";
document.body.appendChild(circle);

document.head.appendChild(Object.assign(document.createElement("style"), {
    innerHTML: `
        #circle {
            position: fixed;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: rgba(145, 145, 145, 1);
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
        }
        
        #circle.menu-hover {
            width: 32px;
            height: 24px;
            border-radius: 4px;
            transition: width 0.15s ease-out, height 0.15s ease-out, border-radius 0.15s ease-out;
        }
    `
}));

// Simple mouse following without any delay
document.addEventListener("mousemove", e => {
    circle.style.left = e.clientX + 'px';
    circle.style.top = e.clientY + 'px';
});

// Add hover effect ONLY for menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const logo = document.querySelector('.logo');

menuToggle.addEventListener('mouseenter', () => circle.classList.add('menu-hover'));
menuToggle.addEventListener('mouseleave', () => circle.classList.remove('menu-hover'));

logo.addEventListener('mouseenter', () => {
    circle.style.width = '24px';
    circle.style.height = '24px';
});

logo.addEventListener('mouseleave', () => {
    circle.style.width = '16px';
    circle.style.height = '16px';
});

// Mouse click effect
document.addEventListener("mousedown", () => {
    circle.style.width = "15px";
    circle.style.height = "15px";
});

document.addEventListener("mouseup", () => {
    circle.style.width = "16px";
    circle.style.height = "16px";
});

// allows for scrolling
document.addEventListener("scroll", () => {
    let scrollY = window.scrollY;
    circle.style.top = `${mouseY + scrollY}px`;
});

// Remove the click color change
document.addEventListener("click", () => {
    // Empty function to override any previous click handlers
});

document.addEventListener("mouseleave", () => {
    circle.style.opacity = "0";
});

document.addEventListener("mouseenter", () => {
    circle.style.opacity = "0.65";
});
