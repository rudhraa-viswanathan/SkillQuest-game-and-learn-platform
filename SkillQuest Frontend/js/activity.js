const urlParams = new URLSearchParams(window.location.search);

const topic =
    urlParams.get("topic");

const activity =
    urlParams.get("activity");


const activityTopic =
    document.getElementById("activity-topic");

const activityTitle =
    document.getElementById("activity-title");

const activityDescription =
    document.getElementById("activity-description");


if (topic) {
    activityTopic.textContent = topic;
}

if (activity) {
    activityTitle.textContent = activity;
    activityDescription.textContent =
        `Learn the basics of ${activity}.`;
}

const completeButton =
    document.getElementById("complete-activity-btn");


completeButton.addEventListener("click", () => {

    if (!activity) {
        return;
    }

    localStorage.setItem(
        "completed-" + activity,
        "true"
    );

    alert("Activity completed!");

});

const savedCompletion =
    localStorage.getItem("completed-" + activity);


if (savedCompletion === "true") {

    completeButton.textContent =
        "Activity Completed";

    completeButton.disabled = true;

}

const backToCourseButton =
    document.getElementById("back-to-course-btn");


backToCourseButton.addEventListener("click", () => {

    window.location.href = "java-course.html";

});