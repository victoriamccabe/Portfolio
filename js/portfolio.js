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
const leafImages = ['images/leaf1.png','images/leaf2.png','images/leaf3.png']
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

// Keep canvas responsive on window resize
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // initial sizing

// Leaf class defines properties and behavior of each leaf
class Leaf {
  constructor(topOnly=true){
    // Random starting position
    this.x = Math.random() * canvas.width;
    this.y = topOnly ? Math.random() * -canvas.height : -20; // spawn above screen or just above top

    // Random size and movement
    this.size = Math.random() * 30 + 20;       // leaf size between 20–50px
    this.speedY = Math.random() * 2 + 1;       // falling speed
    this.speedX = Math.random() * 1 - 0.5;     // horizontal drift
    this.rotation = Math.random() * 2 * Math.PI; // initial rotation angle
    this.rotationSpeed = Math.random() * 0.05 - 0.025; // spin speed
    this.alpha = 0.8 + Math.random() * 1;    // transparency (0.5–1.0)
    this.stopped = false;                      // whether leaf has landed
    this.img = leafImages[Math.floor(Math.random()*leafImages.length)]; // random image
  }

  // Update leaf position and rotation
  update() {
    if((active || storm) && !this.stopped){
      this.y += this.speedY; // fall down
      this.x += Math.sin(this.y/50) * this.speedX * 20; // horizontal sway
      this.rotation += this.rotationSpeed; // spin

      // Stop leaf when it hits the bottom
      if(this.y + this.size/2 >= canvas.height){ 
        this.y = canvas.height - this.size/2; 
        this.stopped = true; 
      }
    }
  }

  // Draw leaf on canvas
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha; // set transparency
    ctx.translate(this.x,this.y); // move to leaf position
    ctx.rotate(this.rotation);    // rotate leaf
    ctx.drawImage(this.img, -this.size/2, -this.size/2, this.size, this.size); // draw centered
    ctx.restore();
  }
}

// Create initial batch of leaves (300)
for(let i=0;i<300;i++) leaves.push(new Leaf(true));

// Animation loop
function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height); // clear canvas
  leaves.forEach(leaf => { 
    leaf.update(); 
    leaf.draw(); 
  });
  requestAnimationFrame(animate); // repeat
}
animate();

// Button interactions
const button = document.getElementById('cta-btn');

// Hover → leaves start falling
button.addEventListener('mouseenter', ()=> active=true);
;

// Click → trigger storm and redirect
button.addEventListener('click', ()=>{
  storm = true;
  active = true;
  const totalStormLeaves = 800; // number of extra leaves for storm
  let added = 0;

  // Spawn leaves rapidly until storm is full
  const spawnInterval = setInterval(()=>{
    if(added >= totalStormLeaves){ 
      clearInterval(spawnInterval);
      // After short delay, redirect to another page
      setTimeout(()=> window.location.href='projects.html', 100); 
    } else {
      leaves.push(new Leaf(false)); // add new leaf
      added++;
    }
  }, .030); // spawn every 10ms
});