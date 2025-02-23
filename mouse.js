let circle = document.getElementById("circle");
if (!circle) {
    circle = document.createElement("div");
    circle.id = "circle";
    document.body.appendChild(circle);
}

// to inject css
const style = document.createElement("style");
style.innerHTML = `
    #circle {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: rgba(51, 51, 51, 0.5) !important;
        pointer-events: none;
        opacity: 0.65;
        z-index: 999999;
        transition: width 0.1s, height 0.1s;
    }
`;
document.head.appendChild(style);

// Remove the color setting
circle.style.mixBlendMode = "normal";

let mouseX = 0, mouseY = 0; // Mouse target position
let circleX = 0, circleY = 0; // Circle's current position
const delay = 0.3; // Delay speed

// Track mouse position
document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// Animate the circle following the cursor
function animate() {
    circleX += (mouseX - circleX) * delay;
    circleY += (mouseY - circleY) * delay;
    
    circle.style.left = `${circleX}px`;
    circle.style.top = `${circleY}px`;

    requestAnimationFrame(animate); // Keep animating
}

// Restore mousedown/mouseup size changes
document.addEventListener("mousedown", () => {
    circle.style.width = "15px";
    circle.style.height = "15px";
});

document.addEventListener("mouseup", () => {
    circle.style.width = "20px";
    circle.style.height = "20px";
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

animate();
