// Disable right click globally
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Extra protection for category cards
document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
});

// Disable dragging
document.querySelectorAll(".slideshow").forEach((slideshow) => {
  const slides = slideshow.querySelectorAll(".slide");
  const prevBtn = slideshow.querySelector(".slide-arrow.prev");
  const nextBtn = slideshow.querySelector(".slide-arrow.next");

  let current = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  if (slides.length > 0) {
    showSlide(current);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    });
  }
});



/* =================================
   DIGITAL PAINTBRUSH CURSOR
================================= */

/* =================================
   DIGITAL PAINTBRUSH CURSOR
================================= */

const paintCanvas = document.getElementById("paint-canvas");

if (paintCanvas) {
    const ctx = paintCanvas.getContext("2d");

    let previous = null;
    let segments = [];
    let animationRunning = false;

    const brushColour = "28, 27, 25";
    const brushSize = 12;
    const brushOpacity = 0.65;
    const trailLifetime = 1200; // milliseconds

    // Set canvas size
    function resizePaintCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        paintCanvas.width = window.innerWidth * dpr;
        paintCanvas.height = window.innerHeight * dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        segments = [];
        previous = null;
    }

    resizePaintCanvas();
    window.addEventListener("resize", resizePaintCanvas);

    // Add new brush strokes
    window.addEventListener("pointermove", function(event) {
        if (event.pointerType !== "mouse") return;

        const current = {
            x: event.clientX,
            y: event.clientY
        };

        if (previous) {
            segments.push({
                x1: previous.x,
                y1: previous.y,
                x2: current.x,
                y2: current.y,
                time: performance.now()
            });
        }

        previous = current;

        if (!animationRunning) {
            animationRunning = true;
            requestAnimationFrame(drawPaint);
        }
    });

    // Redraw and smoothly fade the trail
    function drawPaint() {
        const now = performance.now();

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

        segments = segments.filter(segment => {
            return now - segment.time < trailLifetime;
        });

        segments.forEach(segment => {
            const age = now - segment.time;
            const fade = 1 - (age / trailLifetime);
            const opacity = brushOpacity * fade;

            ctx.beginPath();
            ctx.moveTo(segment.x1, segment.y1);
            ctx.lineTo(segment.x2, segment.y2);

            ctx.strokeStyle = `rgba(${brushColour}, ${opacity})`;
            ctx.lineWidth = brushSize;
            ctx.lineCap = "square";
            ctx.lineJoin = "bevel";

            ctx.stroke();
        });

        if (segments.length > 0) {
            requestAnimationFrame(drawPaint);
        } else {
            animationRunning = false;
            ctx.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );
        }
    }

    // Stop connecting strokes when leaving the page
    document.addEventListener("pointerleave", function() {
        previous = null;
    });

    // Clear the trail when switching tabs
    document.addEventListener("visibilitychange", function() {
        if (document.hidden) {
            segments = [];
            previous = null;
            animationRunning = false;

            ctx.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );
        }
    });
}


/* =================================
   FLOATING EYEBALL - MOUSE TRACKING
================================= */


const floatingEye = document.getElementById("floating-eye");
const eyeIris = document.getElementById("eye-iris");

if (floatingEye && eyeIris) {
    window.addEventListener("pointermove", function(event) {
        if (event.pointerType !== "mouse") return;

        const eyeRect = floatingEye.getBoundingClientRect();

        const eyeCentreX = eyeRect.left + eyeRect.width / 2;
        const eyeCentreY = eyeRect.top + eyeRect.height / 2;

        const differenceX = event.clientX - eyeCentreX;
        const differenceY = event.clientY - eyeCentreY;

        const angle = Math.atan2(differenceY, differenceX);

        const distance = Math.min(
            Math.sqrt(differenceX ** 2 + differenceY ** 2),
            400
        );

        // Increased movement range
        const movement = distance / 400 * 22;

        const pupilX = Math.cos(angle) * movement;
        const pupilY = Math.sin(angle) * movement;

        eyeIris.style.transform =
            `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
    });
}




/* =================================
   FULL PAGE DIGITAL SIGNAL GLITCH
================================= */

// Create the static overlay
const glitchOverlay = document.createElement("div");
glitchOverlay.className = "background-glitch-overlay";
document.body.appendChild(glitchOverlay);

let glitchTimeout;

// Trigger glitch on clicks
document.addEventListener("click", function(event) {

    // Ignore slideshow arrows and controls
    if (event.target.closest(
        ".slide-arrow, .slide-controls, .slideshow button"
    )) {
        return;
    }

    // Restart the glitch animation
    document.body.classList.remove("page-glitch");
    glitchOverlay.classList.remove("active");

    void document.body.offsetWidth;

    document.body.classList.add("page-glitch");
    glitchOverlay.classList.add("active");

    clearTimeout(glitchTimeout);

    glitchTimeout = setTimeout(function() {
        document.body.classList.remove("page-glitch");
        glitchOverlay.classList.remove("active");
    }, 500);
});
