// These functions open and close the contact form
function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}



// This code will create close the contact form when the user clicks off of it
// The first step is to add an event listener for any clicks on the website
document.addEventListener("click", function(event){
    // Here we state that if the click happens on the cancel button OR anywhere that is not the contact form AND the click does not happen on any element with the contact class then call the closeForm() function
    if (event.target.matches(".cancel") || !event.target.closest(".form-popup") && !event.target.closest(".Pop_Up_Button") && !event.target.closest(".contact")){
        closeForm()
    }
}, false )

function openForm() {
    document.getElementById("myForm").style.display = "block";
    document.getElementById("contact-overlay").style.display = "flex";
}
function closeForm() {
    document.getElementById("myForm").style.display = "none";
    document.getElementById("contact-overlay").style.display = "none";
}

function toggleForm() {
    const form = document.getElementById("myForm");
    const overlay = document.getElementById("contact-overlay");
    if (form.style.display === "block") {
        form.style.display = "none";
        overlay.style.display = "none";
    } else {
        form.style.display = "block";
        overlay.style.display = "flex";
    }
}

//---------------------------------------------------------//


/****************************************************
 * CARROUSEL
 ****************************************************/

document.addEventListener("DOMContentLoaded", function() {
  // Select the carousel element
  const myCarousel = document.querySelector('#carouselExampleCaptions');

  // Initialize Bootstrap Carousel with custom options
  const carousel = new bootstrap.Carousel(myCarousel, {
    interval: 3000,   // Time between slides in milliseconds
    ride: 'carousel', // Start cycling automatically
    pause: false,     // Do not pause on hover
    wrap: true,       // Loop back to first slide
    touch: true       // Enable swipe on touch devices
  });

  // Select all carousel items (slides)
  const items = myCarousel.querySelectorAll('.carousel-item');

  // Apply smooth opacity and scale transitions to all slides
  items.forEach(item => {
    item.style.transition = 'opacity 1.2s ease-in-out, transform 1.2s ease-in-out';
  });

  // Animate scale on slide change for a subtle zoom effect
  myCarousel.addEventListener('slide.bs.carousel', (e) => {
    // Shrink all slides slightly
    items.forEach(item => item.style.transform = 'scale(0.95)');
    // Zoom in the slide that is about to become active
    e.relatedTarget.style.transform = 'scale(1)';
  });

  // Initialize the first slide scale to 1 (normal size)
  const activeItem = myCarousel.querySelector('.carousel-item.active');
  if (activeItem) activeItem.style.transform = 'scale(1)';
});



/****************************************************
 * CANVAS SETUP
 ****************************************************/
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d", { alpha: true });

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas, { passive: true });
resizeCanvas();

/****************************************************
 * GLOBAL STATES
 ****************************************************/
let leaves = [];
let active = false;      // soft rain mode
let windActive = false;  // bouncing wind mode

/****************************************************
 * PERFORMANCE SETTINGS
 ****************************************************/
let leafCount, fallSpeedMult;
function setPerformance() {
    const small = window.innerWidth <= 700;
    leafCount = small ? 40 : 150;
    fallSpeedMult = small ? 1.7 : 1.0;
}
setPerformance();
window.addEventListener("resize", setPerformance, { passive: true });

/****************************************************
 * PRELOAD LEAF IMAGES
 ****************************************************/
const leafImages = ["images/leaf1.png", "images/leaf2.png", "images/leaf3.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

/****************************************************
 * LEAF CLASS
 ****************************************************/
class Leaf {
    constructor(topOnly = true) {
        this.x = Math.random() * window.innerWidth;
        this.y = topOnly ? Math.random() * -window.innerHeight : -20;

        this.size = Math.random() * 25 + 20;
        this.speedY = (Math.random() * 2 + 1) * fallSpeedMult;
        this.speedX = Math.random() * 1 - 0.5;

        // Wind velocities (used only in wind mode)
        this.vx = 0;
        this.vy = 0;

        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.05 - 0.025;

        this.stopped = false;
        this.img = leafImages[(Math.random() * leafImages.length) | 0];
    }

    update(delta) {
        /****************************************
         * SOFT RAIN
         ****************************************/
        if (!windActive) {
            if (active && !this.stopped) {
                this.y += this.speedY * delta;
                this.x += Math.sin(this.y * 0.02) * 1.5 * delta;
                this.rotation += this.rotationSpeed * delta;

                if (this.y >= canvas.height - this.size) {
                    this.y = canvas.height - this.size;
                    this.stopped = true;
                }
            }
            return;
        }

        /****************************************
         * BOUNCING WIND
         ****************************************/
        // Unstick leaves
        if (this.stopped) {
            this.stopped = false;
            this.vx = (Math.random() * 6 + 4);
            this.vy = -(Math.random() * 6 + 2);
        }

        // Give velocity if not initialized
        if (this.vx === 0 && this.vy === 0) {
            this.vx = 6 + Math.random() * 3;
            this.vy = -2 + Math.random() * 4;
        }

        // Apply velocity
        this.x += this.vx * delta;
        this.y += this.vy * delta;
        this.rotation += 0.25 * delta;

        // Bounce off edges
        if (this.x < 0) { this.x = 0; this.vx *= -1; }
        if (this.x > canvas.width - this.size) { this.x = canvas.width - this.size; this.vx *= -1; }

        if (this.y < 0) { this.y = 0; this.vy *= -1; }
        if (this.y > canvas.height - this.size) { this.y = canvas.height - this.size; this.vy *= -1; }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

/****************************************************
 * INITIAL LEAVES
 ****************************************************/
for (let i = 0; i < leafCount; i++) {
    leaves.push(new Leaf(true));
}

/****************************************************
 * ANIMATION LOOP (DELTA TIME BASED)
 ****************************************************/
let lastTime = performance.now();
function animate(now) {
    const delta = (now - lastTime) / 16.666; // normalize to 60 FPS
    lastTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let leaf of leaves) {
        leaf.update(delta);
        leaf.draw();
    }

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

/****************************************************
 * INTERACTIONS
 ****************************************************/
const hoverArea = document.getElementById("hover-area");
const stormBtn = document.getElementById("storm-btn");

/****************************************
 * SOFT RAIN (starts once, stays on)
 ****************************************/
hoverArea.addEventListener("mouseenter", () => {
    active = true;
});

/****************************************
 * BOUNCING WIND + REDIRECT
 ****************************************/
stormBtn.addEventListener("click", (event) => {
    event.preventDefault();

    active = true;      // leaves start falling if not already
    windActive = true;  // activate bouncing wind

    // redirect after 2 seconds of chaotic wind
    setTimeout(() => {
        window.location.assign("projects.html");
    }, 2000);
});
