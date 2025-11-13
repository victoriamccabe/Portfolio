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




//-------------------------Poerfolio button --------------------------------//

// Get the canvas element and its 2D drawing context
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// Array to store all leaf objects
let leaves = [];

// Flags to control animation states
let active = false; // true when hovering over the button
let storm = false;  // true when button is clicked (storm mode)

// Preload leaf images into an array
const leafImages = ['images/leaf1.png', 'images/leaf2.png', 'images/leaf3.png']
  .map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });

// Function to resize canvas to full window size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // initial sizing

// Detect screen size and set behavior
let leafCount, fallSpeedMultiplier;
function setLeafBehavior() {
  if (window.innerWidth <= 700) {
    leafCount = 2000;             // fewer leaves
    fallSpeedMultiplier = 5;   // faster fall
  } 
  if (window.innerWidth <= 300) {
    leafCount = 200;             // fewer leaves
    fallSpeedMultiplier = 5;   // faster fall
  }
  else {
    leafCount = 300;             // normal amount
    fallSpeedMultiplier = 1;     // normal speed
  }
}
setLeafBehavior();
window.addEventListener('resize', setLeafBehavior);

// Leaf class defines properties and behavior of each leaf
class Leaf {
  constructor(topOnly = true) {
    this.x = Math.random() * canvas.width;
    this.y = topOnly ? Math.random() * -canvas.height : -20;

    this.size = Math.random() * 30 + 20;
    this.speedY = (Math.random() * 2 + 1) * fallSpeedMultiplier; // adjusted speed
    this.speedX = Math.random() * 1 - 0.5;
    this.rotation = Math.random() * 2 * Math.PI;
    this.rotationSpeed = Math.random() * 0.05 - 0.025;
    this.alpha = 0.8 + Math.random() * 1;
    this.stopped = false;
    this.img = leafImages[Math.floor(Math.random() * leafImages.length)];
  }

  update() {
    if ((active || storm) && !this.stopped) {
      this.y += this.speedY;
      this.x += Math.sin(this.y / 50) * this.speedX * 20;
      this.rotation += this.rotationSpeed;

      if (this.y + this.size / 2 >= canvas.height) {
        this.y = canvas.height - this.size / 2;
        this.stopped = true;
      }
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

// Create initial leaves
for (let i = 0; i < leafCount; i++) leaves.push(new Leaf(true));

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  leaves.forEach(leaf => {
    leaf.update();
    leaf.draw();
  });
  requestAnimationFrame(animate);
}
animate();

// Button interactions
const button = document.getElementById('cta-btn');

// Hover → leaves start falling
button.addEventListener('mouseenter', () => active = true);

// Click → trigger storm and redirect
button.addEventListener('click', (event) => {
  event.preventDefault();

  storm = true;
  active = true;
  const totalStormLeaves = window.innerWidth <= 700 ? 300 : 800; // smaller storm on small screens
  let added = 0;

  const spawnInterval = setInterval(() => {
    if (added >= totalStormLeaves) {
      clearInterval(spawnInterval);
      setTimeout(() => window.location.assign('projects.html'), 100);
    } else {
      leaves.push(new Leaf(false));
      added++;
    }
  }, 0.05);
});
