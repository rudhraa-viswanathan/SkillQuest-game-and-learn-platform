// =====================================================
// SKILLQUEST - JAVA COURSE
// =====================================================


// -----------------------------------------------------
// 1. JAVA COURSE STRUCTURE
// -----------------------------------------------------

const topics = [

    // =================================================
    // TOPIC 1 - JAVA FUNDAMENTALS
    // =================================================

    {
        id: "java-fundamentals",

        name: "Java Fundamentals",

        activities: [

            {
                name: "Variables & Data Types",
                completed: false
            },

            {
                name: "Operators",
                completed: false
            },

            {
                name: "Control Statements",
                completed: false
            },

            {
                name: "Fundamentals Challenge",
                completed: false
            }

        ]
    },


    // =================================================
    // TOPIC 2 - ARRAYS & STRINGS
    // =================================================

    {
        id: "arrays-strings",

        name: "Arrays & Strings",

        activities: [

            {
                name: "Arrays",
                completed: false
            },

            {
                name: "Strings",
                completed: false
            },

            {
                name: "StringBuilder & StringBuffer",
                completed: false
            },

            {
                name: "Arrays & Strings Challenge",
                completed: false
            }

        ]
    },


    // =================================================
    // TOPIC 3 - OBJECT-ORIENTED PROGRAMMING
    // =================================================

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
            },

            {
                name: "OOP Debugging Challenge",
                completed: false
            }

        ]
    },


    // =================================================
    // TOPIC 4 - EXCEPTION HANDLING
    // =================================================

    {
        id: "exceptions",

        name: "Exception Handling",

        activities: [

            {
                name: "Try-Catch",
                completed: false
            },

            {
                name: "Multiple Catch Blocks",
                completed: false
            },

            {
                name: "Finally",
                completed: false
            },

            {
                name: "Throw & Throws",
                completed: false
            },

            {
                name: "Exception Debugging",
                completed: false
            }

        ]
    },


    // =================================================
    // TOPIC 5 - FILE HANDLING
    // =================================================

    {
        id: "file-handling",

        name: "File Handling",

        activities: [

            {
                name: "Reading Files",
                completed: false
            },

            {
                name: "Writing Files",
                completed: false
            },

            {
                name: "File Handling Challenge",
                completed: false
            }

        ]
    },


    // =================================================
    // TOPIC 6 - MULTITHREADING
    // =================================================

    {
        id: "multithreading",

        name: "Multithreading",

        activities: [

            {
                name: "Creating Threads",
                completed: false
            },

            {
                name: "Thread Lifecycle",
                completed: false
            },

            {
                name: "Synchronization",
                completed: false
            },

            {
                name: "Multithreading Challenge",
                completed: false
            }

        ]
    }

];


// =====================================================
// 2. COMPLETION CHECK
// =====================================================

function isActivityCompleted(
    activityName
) {

    return (
        localStorage.getItem(
            "completed-" + activityName
        ) === "true"
    );

}


// =====================================================
// 3. LOAD SAVED COMPLETION DATA
// =====================================================

topics.forEach(
    topic => {

        topic.activities.forEach(
            activity => {

                activity.completed =
                    isActivityCompleted(
                        activity.name
                    );

            }
        );

    }
);


// =====================================================
// 4. TOPICS CONTAINER
// =====================================================

const topicsContainer =
    document.getElementById(
        "topics-container"
    );


// =====================================================
// 5. CREATE TOPICS
// =====================================================

topics.forEach(
    (topic, topicIndex) => {

        const topicCard =
            document.createElement(
                "div"
            );


        topicCard.classList.add(
            "topic-card"
        );


        // ---------------------------------------------
        // Count completed activities
        // ---------------------------------------------

        const completedTopicActivities =
            topic.activities.filter(
                activity =>
                    activity.completed
            ).length;


        const topicCompleted =
            completedTopicActivities ===
            topic.activities.length;


        // ---------------------------------------------
        // Create topic header
        // ---------------------------------------------

        topicCard.innerHTML = `

            <h3>
                ${topic.name}
            </h3>

            <p>
                ${topic.activities.length}
                activities
                •
                ${completedTopicActivities}
                completed
            </p>

            ${
                topicCompleted

                    ? `
                        <p class="topic-completed">
                            Topic Completed ✅
                        </p>
                    `

                    : `
                        <p class="topic-in-progress">
                            Topic In Progress
                        </p>
                    `
            }

            <div class="activities-container">
            </div>

        `;


        const activitiesContainer =
            topicCard.querySelector(
                ".activities-container"
            );


        // =================================================
        // 6. CREATE ACTIVITIES
        // =================================================

        topic.activities.forEach(
            (activity, index) => {


                // -----------------------------------------
                // Check previous topic
                // -----------------------------------------

                let previousTopicCompleted =
                    true;


                if (topicIndex > 0) {

                    previousTopicCompleted =
                        topics[
                            topicIndex - 1
                        ]
                            .activities
                            .every(
                                previousActivity =>
                                    previousActivity
                                        .completed
                            );

                }


                // -----------------------------------------
                // Determine activity lock
                // -----------------------------------------

                const isUnlocked =

                    activity.completed ||

                    (
                        index === 0 &&
                        previousTopicCompleted
                    ) ||

                    (
                        index > 0 &&
                        topic.activities[
                            index - 1
                        ].completed
                    );


                // -----------------------------------------
                // Activity status icon
                // -----------------------------------------

                let activityStatus;


                if (activity.completed) {

                    activityStatus =
                        "✅";

                }

                else if (isUnlocked) {

                    activityStatus =
                        "🔓";

                }

                else {

                    activityStatus =
                        "🔒";

                }


                // -----------------------------------------
                // Create activity
                // -----------------------------------------

                const activityItem =
                    document.createElement(
                        "div"
                    );


                activityItem.classList.add(
                    "activity-item"
                );


                if (isUnlocked) {

                    activityItem.classList.add(
                        "activity-unlocked"
                    );

                } else {

                    activityItem.classList.add(
                        "activity-locked"
                    );

                }


                activityItem.dataset.activity =
                    activity.name;


                activityItem.dataset.topic =
                    topic.name;


                activityItem.innerHTML = `

                    <span>
                        ${index + 1}.
                        ${activity.name}
                    </span>

                    <span class="activity-status">
                        ${activityStatus}
                    </span>

                `;


                activitiesContainer.appendChild(
                    activityItem
                );

            }
        );


        topicsContainer.appendChild(
            topicCard
        );

    }
);


// =====================================================
// 7. ACTIVITY NAVIGATION
// =====================================================

const activityItems =
    document.querySelectorAll(
        ".activity-unlocked"
    );


activityItems.forEach(
    activity => {

        activity.addEventListener(
            "click",
            () => {

                const activityTitle =
                    activity.dataset.activity;


                const topicName =
                    activity.dataset.topic;


                window.location.href =
                    `activity.html?topic=${encodeURIComponent(
                        topicName
                    )}&activity=${encodeURIComponent(
                        activityTitle
                    )}`;

            }
        );

    }
);


// =====================================================
// 8. COURSE PROGRESS
// =====================================================

const allActivities =
    topics.flatMap(
        topic =>
            topic.activities
    );


const completedActivities =
    allActivities.filter(
        activity =>
            activity.completed
    );


let courseProgress = 0;


if (allActivities.length > 0) {

    courseProgress =
        Math.round(
            (
                completedActivities.length /
                allActivities.length
            ) * 100
        );

}


// =====================================================
// 9. UPDATE PROGRESS DISPLAY
// =====================================================

const progressText =
    document.getElementById(
        "course-progress"
    );


const progressFill =
    document.getElementById(
        "progress-fill"
    );


if (progressText) {

    progressText.textContent =
        courseProgress + "%";

}


if (progressFill) {

    progressFill.style.width =
        courseProgress + "%";

}