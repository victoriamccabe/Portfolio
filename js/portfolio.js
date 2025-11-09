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

