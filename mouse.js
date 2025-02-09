const circle = document.getElementById("circle");

        let mouseX = 0, mouseY = 0; // Mouse target position
        let circleX = 0, circleY = 0; // Circle's current position
        const delay = 0.3; // Delay speed
        var x = document.getElementById("cursorButton")
        var x = document.createElement("BUTTON");


        // function cursorOff() {
            
        // }
        // <button onclick="cursorOff()">Click Me</button>

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

        // Detect lmb down
        document.addEventListener("mousedown", () => {
            circle.style.width = "25px";
            circle.style.height = "25px";
        });

        // Detect lmb up
        document.addEventListener("mouseup", () => {
            circle.style.width = "30px";
            circle.style.height = "30px";
        });

		//allows for scrolling
		document.addEventListener("scroll", () => {
			let scrollY = window.scrollY;
			circle.style.top = `${mouseY + scrollY}px`;
		});
        
        

        animate(); 