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
// Get canvas and context
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d", { alpha: true });

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas, { passive: true });
resizeCanvas();

// ------------------ GLOBAL STATES ------------------
let leaves = [];
let active = true;      // soft rain starts automatically
let windActive = false; // storm/wind mode

// ------------------ PERFORMANCE SETTINGS ------------------
let leafCount, fallSpeedMult;
function setPerformance() {
    const width = window.innerWidth;
    if (width <= 500) {          
        leafCount = 30;
        fallSpeedMult = 1.8;
    } else if (width <= 768) {   
        leafCount = 70;
        fallSpeedMult = 1.5;
    } else if (width <= 1200) {  
        leafCount = 120;
        fallSpeedMult = 1.2;
    } else {                     
        leafCount = 200;
        fallSpeedMult = 1.0;
    }
}
setPerformance();
window.addEventListener("resize", setPerformance, { passive: true });

// ------------------ PRELOAD LEAF IMAGES ------------------
const leafImages = ["images/leaf1.png","images/leaf2.png","images/leaf3.png"].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// ------------------ LEAF CLASS ------------------
class Leaf {
    constructor(topOnly = true) {
        this.reset(topOnly);
    }

    reset(topOnly = false) {
        this.x = Math.random() * canvas.width;
        this.y = topOnly ? Math.random() * -canvas.height : -20;
        this.size = Math.random() * 20 + 15; // size variation
        this.speedY = (Math.random() * 1.5 + 0.5) * fallSpeedMult;
        this.speedX = Math.random() * 0.6 - 0.3;

        // wind velocities
        this.vx = 0;
        this.vy = 0;

        // rotation
        this.rotation = Math.random() * 2 * Math.PI;
        this.rotationSpeed = (Math.random() * 0.04 - 0.02) * (Math.random() < 0.5 ? 1 : -1); // vary direction

        // sway amplitude for natural drifting
        this.swayAmplitude = Math.random() * 1.5 + 0.5;
        this.swayFrequency = Math.random() * 0.02 + 0.01;

        this.alpha = 0.6 + Math.random() * 0.4; // depth effect
        this.stopped = false;
        this.img = leafImages[Math.floor(Math.random() * leafImages.length)];
    }

    update(delta) {
        // --------- SOFT RAIN ---------
        if (!windActive) {
            this.y += this.speedY * delta;
            this.x += Math.sin(this.y * this.swayFrequency) * this.swayAmplitude * delta;
            this.rotation += this.rotationSpeed * delta;

            if (this.y > canvas.height) {
                this.y = -this.size;
                this.x = Math.random() * canvas.width;
            }
            return;
        }

        // --------- BOUNCING WIND ---------
        if (this.stopped) {
            this.stopped = false;
            this.vx = (Math.random() * 6 + 4) * (Math.random() < 0.5 ? 1 : -1);
            this.vy = -(Math.random() * 6 + 2);
        }

        if (this.vx === 0 && this.vy === 0) {
            this.vx = 4 + Math.random() * 3;
            this.vy = -2 + Math.random() * 4;
        }

        this.x += this.vx * delta;
        this.y += this.vy * delta;
        this.rotation += this.rotationSpeed * delta * 2;

        // bounce off edges
        if (this.x < 0) { this.x = 0; this.vx *= -1; }
        if (this.x > canvas.width - this.size) { this.x = canvas.width - this.size; this.vx *= -1; }
        if (this.y < 0) { this.y = 0; this.vy *= -1; }
        if (this.y > canvas.height - this.size) { this.y = canvas.height - this.size; this.vy *= -1; }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

// ------------------ INITIAL LEAVES ------------------
for (let i = 0; i < leafCount; i++) {
    leaves.push(new Leaf(true));
}

// ------------------ ANIMATION LOOP ------------------
let lastTime = performance.now();
function animate(now) {
    requestAnimationFrame(animate);

    let delta = (now - lastTime) / 16.666;
    delta = Math.min(delta, 2); // clamp for slow frames
    lastTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let leaf of leaves) {
        leaf.update(delta);
        leaf.draw();
    }
}
requestAnimationFrame(animate);

// ------------------ INTERACTIONS ------------------
const stormBtn = document.getElementById("storm-btn");

// Storm triggers bouncing wind + extra leaves
document.querySelectorAll(".storm-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        windActive = true;

        const extraLeaves = window.innerWidth <= 700 ? 50 : 100;
        for (let i = 0; i < extraLeaves; i++) {
            leaves.push(new Leaf(false));
        }

        setTimeout(() => {
            window.location.assign("projects.html");
        }, 3000);
    });
});