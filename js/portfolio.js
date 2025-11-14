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
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// Leaf array
let leaves = [];

// Flags
let active = true;  // leaves fall automatically
let storm = false;

// Preload leaf images
const leafImages = ['images/leaf1.png','images/leaf2.png','images/leaf3.png']
  .map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Leaf behavior based on screen
let leafCount, fallSpeedMultiplier;
function setLeafBehavior() {
    const width = window.innerWidth;
    if (width <= 500) {          // small phone
        leafCount = 40;
        fallSpeedMultiplier = 2.2;
    } else if (width <= 768) {   // tablet
        leafCount = 80;
        fallSpeedMultiplier = 1.8;
    } else if (width <= 1200) {  // average PC
        leafCount = 150;
        fallSpeedMultiplier = 1.2;
    } else {                     // large screens
        leafCount = 200;
        fallSpeedMultiplier = 1;
    }
}
setLeafBehavior();
window.addEventListener('resize', setLeafBehavior);

// Leaf class
class Leaf {
    constructor(topOnly = true) {
        this.reset(topOnly);
    }

    reset(topOnly = false) {
        this.x = Math.random() * canvas.width;
        this.y = topOnly ? Math.random() * -canvas.height : -20;
        this.size = Math.random() * 25 + 15;
        this.speedY = (Math.random() * 1.5 + 0.5) * fallSpeedMultiplier;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.rotation = Math.random() * 2 * Math.PI;
        this.rotationSpeed = Math.random() * 0.04 - 0.02;
        this.alpha = 0.7 + Math.random() * 0.3;
        this.img = leafImages[Math.floor(Math.random() * leafImages.length)];
    }

    update() {
        if (active || storm) {
            this.y += this.speedY;
            this.x += Math.sin(this.y / 50) * this.speedX * 20;
            this.rotation += this.rotationSpeed;

            // Wrap around screen to recycle leaves
            if (this.y > canvas.height + this.size) this.reset();
            if (this.x < -this.size) this.x = canvas.width + this.size;
            if (this.x > canvas.width + this.size) this.x = -this.size;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.img, -this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
    }
}

// Initialize leaves
for (let i = 0; i < leafCount; i++) leaves.push(new Leaf(true));

// Animation loop with FPS cap for slow devices
let lastTime = 0;
function animate(time) {
    requestAnimationFrame(animate);
    const delta = time - lastTime;
    if (delta < 16) return; // ~60 FPS cap
    lastTime = time;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    leaves.forEach(leaf => {
        leaf.update();
        leaf.draw();
    });
}
requestAnimationFrame(animate);

// Storm button
const stormBtn = document.getElementById('storm-btn');
stormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    storm = true;
    active = true;

    const extraLeaves = window.innerWidth <= 700 ? 150 : 400;
    for (let i = 0; i < extraLeaves; i++) {
        leaves.push(new Leaf(false));
    }

    setTimeout(() => {
        window.location.assign('projects.html');
    }, 1200); // small delay to let storm start
});

