const topics = [
    {
        id: "java-fundamentals",
        name: "Java Fundamentals",
        activities: [
            {
                name: "Variables & Data Types",
                completed: true
            },
            {
                name: "Operators",
                completed: true
            },
            {
                name: "Control Statements",
                completed: false
            },
            {
                name: "Arrays",
                completed: false
            }
        ]
    },
    {
        id: "oops",
        name: "Object-Oriented Programming",
        activities: [
            {
                name: "Classes & Objects",
                completed: false
            },
            {
                name: "Constructors",
                completed: false
            },
            {
                name: "Inheritance",
                completed: false
            },
            {
                name: "Polymorphism",
                completed: false
            },
            {
                name: "Abstraction",
                completed: false
            },
            {
                name: "Encapsulation",
                completed: false
            }
        ]
    },
    {
        id: "exceptions",
        name: "Exception Handling",
        activities: [
            {
                name: "Exception Basics",
                completed: false
            },
            {
                name: "try-catch",
                completed: false
            },
            {
                name: "finally",
                completed: false
            },
            {
                name: "Custom Exceptions",
                completed: false
            }
        ]
    }
];



function isActivityCompleted(activityName) {

    return localStorage.getItem(
        "completed-" + activityName
    ) === "true";

}



const topicsContainer =
    document.getElementById("topics-container");



topics.forEach((topic, topicIndex) => {

    const topicCard =
        document.createElement("div");

    topicCard.classList.add("topic-card");

   topic.activities.forEach(activity => {

    if (isActivityCompleted(activity.name)) {

        activity.completed = true;

    }

});


const completedTopicActivities =
    topic.activities.filter(
        activity => activity.completed
    ).length;


const topicCompleted =
    completedTopicActivities ===
    topic.activities.length;


topicCard.innerHTML = `
    <h3>${topic.name}</h3>

    <p>
        ${topic.activities.length} activities
        • ${completedTopicActivities} completed
    </p>

    ${
    topicCompleted
        ? `<p class="topic-completed">Topic Completed ✅</p>`
        : `<p class="topic-in-progress">Topic In Progress</p>`
}

    <div class="activities-container"></div>
`;


    const activitiesContainer =
        topicCard.querySelector(".activities-container");


    topic.activities.forEach((activity, index) => {

        /*
         * Check localStorage.
         * If the activity was completed earlier,
         * update its completion status.
         */

        if (isActivityCompleted(activity.name)) {

            activity.completed = true;

        }


        /*
         * An activity is unlocked when:
         * 1. It is the first activity
         * OR
         * 2. The previous activity is completed
         */

        let previousTopicCompleted = true;

if (topicIndex > 0) {

    previousTopicCompleted =
        topics[topicIndex - 1].activities.every(
            activity => activity.completed
        );

}


const isUnlocked =
    activity.completed ||
    (
        index === 0 &&
        previousTopicCompleted
    ) ||
    (
        index > 0 &&
        topic.activities[index - 1].completed
    );


        let activityStatus;


        if (activity.completed) {

            activityStatus = "✅";

        } else if (isUnlocked) {

            activityStatus = "🔓";

        } else {

            activityStatus = "🔒";

        }


        const activityItem =
            document.createElement("div");

        activityItem.classList.add("activity-item");


        if (isUnlocked) {

            activityItem.classList.add(
                "activity-unlocked"
            );

        }


        activityItem.innerHTML = `
            <span>
                ${index + 1}. ${activity.name}
            </span>

            <span class="activity-status">
                ${activityStatus}
            </span>
        `;


        activitiesContainer.appendChild(
            activityItem
        );

    });


    topicsContainer.appendChild(topicCard);

});



/*
 * Activity navigation
 */

const activityItems =
    document.querySelectorAll(
        ".activity-unlocked"
    );


activityItems.forEach(activity => {

    activity.addEventListener("click", () => {

        const activityName =
            activity.querySelector(
                "span"
            ).textContent.trim();


        const activityTitle =
            activityName.substring(
                activityName.indexOf(".") + 1
            ).trim();


        const topicName =
            activity
                .closest(".topic-card")
                .querySelector("h3")
                .textContent.trim();


        window.location.href =
            `activity.html?topic=${encodeURIComponent(topicName)}&activity=${encodeURIComponent(activityTitle)}`;

    });

});



/*
 * Calculate course progress
 */

const allActivities =
    topics.flatMap(
        topic => topic.activities
    );


const completedActivities =
    allActivities.filter(
        activity => activity.completed
    );


const courseProgress =
    Math.round(
        (completedActivities.length /
            allActivities.length) * 100
    );


const progressText =
    document.getElementById(
        "course-progress"
    );


const progressFill =
    document.getElementById(
        "progress-fill"
    );


progressText.textContent =
    courseProgress + "%";


progressFill.style.width =
    courseProgress + "%";