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


// Bootstrap Carousel Initialization

document.addEventListener("DOMContentLoaded", function() {
  const myCarousel = document.querySelector('#carouselExampleCaptions');
  const carousel = new bootstrap.Carousel(myCarousel, {
    interval: 3000,
    ride: 'carousel',
    pause: false,
    wrap: true,
    touch: true
  });

  // Smoother fade transitions
  const items = myCarousel.querySelectorAll('.carousel-item');
  items.forEach(item => {
    item.style.transition = 'opacity 1.2s ease-in-out';
  });
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
let windActive = false;  // bounce wind mode

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
const leafImages = ["images/leaf1.png", "images/leaf2.png", "images/leaf3.png"].map((src) => {
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

        // WIND VELOCITIES (0 until wind starts)
        this.vx = 0;
        this.vy = 0;

        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.05 - 0.025;

        this.stopped = false;
        this.img = leafImages[(Math.random() * leafImages.length) | 0];
    }

    update() {
        /****************************************
         * NORMAL SOFT RAIN
         ****************************************/
        if (!windActive) {
            if (active && !this.stopped) {
                this.y += this.speedY;
                this.x += Math.sin(this.y * 0.02) * 1.2;
                this.rotation += this.rotationSpeed;

                if (this.y >= canvas.height - this.size) {
                    this.y = canvas.height - this.size;
                    this.stopped = true;
                }
            }
            return;
        }

        /****************************************
         * BOUNCING WIND MODE
         ****************************************/

        // Leaves stuck on bottom → give velocity when wind starts
        if (this.stopped) {
            this.stopped = false;
            this.vx = (Math.random() * 6 + 4);  // strong push to right
            this.vy = -(Math.random() * 6 + 2); // lift upward
        }

        // If wind just activated, give initial velocities
        if (this.vx === 0 && this.vy === 0) {
            this.vx = 6 + Math.random() * 3;          // horizontal push
            this.vy = -2 + Math.random() * 4;         // slight up/down turbulence
        }

        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // Add rotation speed during wind
        this.rotation += 0.25;

        /****************************************
         * SCREEN BOUNCING
         ****************************************/

        // Left wall
        if (this.x < 0) {
            this.x = 0;
            this.vx *= -1;       // bounce
            this.vx += Math.random() * 1.2; // add chaos
        }

        // Right wall
        if (this.x > canvas.width - this.size) {
            this.x = canvas.width - this.size;
            this.vx *= -1;
            this.vx -= Math.random() * 1.2;
        }

        // Top wall
        if (this.y < 0) {
            this.y = 0;
            this.vy *= -1;
        }

        // Bottom wall
        if (this.y > canvas.height - this.size) {
            this.y = canvas.height - this.size;
            this.vy *= -1;
            this.vy -= Math.random() * 0.5; // slight lift
        }
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
 * ANIMATION LOOP
 ****************************************************/
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let leaf of leaves) {
        leaf.update();
        leaf.draw();
    }

    requestAnimationFrame(animate);
}
animate();

/****************************************************
 * INTERACTION ELEMENTS
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

    active = true;     // leaves start falling if not already
    windActive = true; // activate bouncing wind

    // redirect after 2 seconds of chaos
    setTimeout(() => {
        window.location.assign("projects.html");
    }, 2000);
});
