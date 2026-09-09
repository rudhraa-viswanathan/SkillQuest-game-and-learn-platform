const feedbackForm = document.getElementById("feedback-form");
const formMessage = document.getElementById("form-message");
const submitButton = feedbackForm.querySelector("button");

feedbackForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

   if (name === "" || email === "" || message === "") {
    formMessage.classList.remove("success-message");
    formMessage.classList.add("error-message");

    formMessage.textContent = "Please fill in all fields.";
    return;
}

    formMessage.classList.remove("error-message");
    formMessage.classList.add("success-message");
    formMessage.innerHTML = "<strong>Feedback submitted successfully!</strong>";
    submitButton.disabled = true;

    feedbackForm.reset();

    console.log(name);
    console.log(email);
    console.log(message);
});
const courseCards = document.querySelectorAll(".course-card");
const selectedcourse = document.getElementById("selectedCourse");

courseCards.forEach(function(card) {

    card.addEventListener("click", function() {

        courseCards.forEach(function(card) {
            card.classList.remove("selected");
        });

        this.classList.add("selected");

        selectedcourse.textContent =
            "Selected Course: " + this.querySelector("h3").textContent;

    });

});

const selectedCourse = document.getElementById("selectedCourse");
const questSelection = document.getElementById("questSelection");