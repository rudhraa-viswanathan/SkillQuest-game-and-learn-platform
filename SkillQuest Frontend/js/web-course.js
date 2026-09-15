// =====================================================
// WEB DEVELOPMENT COURSE - SKILLQUEST
// =====================================================


// =====================================================
// 1. WEB COURSE DATA
// =====================================================

const webTopics = [

    // =================================================
    // TOPIC 1 - HTML FUNDAMENTALS
    // =================================================

    {
        title: "HTML Fundamentals",

        activities: [

            {
                name: "HTML Structure",
                type: "quiz"
            },

            {
                name: "Text & Headings",
                type: "fill"
            },

            {
                name: "Links & Images",
                type: "code-output"
            },

            {
                name: "HTML Fundamentals Challenge",
                type: "true-false"
            }

        ]
    },


    // =================================================
    // TOPIC 2 - HTML FORMS & SEMANTIC HTML
    // =================================================

    {
        title: "HTML Forms & Semantic HTML",

        activities: [

            {
                name: "Lists & Tables",
                type: "code-ordering"
            },

            {
                name: "Forms & Inputs",
                type: "matching"
            },

            {
                name: "Semantic HTML",
                type: "quiz"
            },

            {
                name: "HTML Debugging Challenge",
                type: "debugging"
            }

        ]
    },


    // =================================================
    // TOPIC 3 - CSS FUNDAMENTALS
    // =================================================

    {
        title: "CSS Fundamentals",

        activities: [

            {
                name: "CSS Selectors",
                type: "quiz"
            },

            {
                name: "Colors & Typography",
                type: "matching"
            },

            {
                name: "Box Model",
                type: "fill"
            },

            {
                name: "CSS Fundamentals Challenge",
                type: "true-false"
            }

        ]
    },


    // =================================================
    // TOPIC 4 - CSS LAYOUT & RESPONSIVE DESIGN
    // =================================================

    {
        title: "CSS Layout & Responsive Design",

        activities: [

            {
                name: "Flexbox",
                type: "matching"
            },

            {
                name: "CSS Grid",
                type: "code-output"
            },

            {
                name: "Positioning",
                type: "quiz"
            },

            {
                name: "Media Queries",
                type: "fill"
            },

            {
                name: "Responsive CSS Challenge",
                type: "debugging"
            }

        ]
    },


    // =================================================
    // TOPIC 5 - JAVASCRIPT FUNDAMENTALS
    // =================================================

    {
        title: "JavaScript Fundamentals",

        activities: [

            {
                name: "JavaScript Variables & Data Types",
                type: "quiz"
            },

            {
                name: "Operators & Conditions",
                type: "code-output"
            },

            {
                name: "Loops",
                type: "code-ordering"
            },

            {
                name: "Functions",
                type: "fill"
            },

            {
                name: "JavaScript Fundamentals Challenge",
                type: "debugging"
            }

        ]
    },


    // =================================================
    // TOPIC 6 - DOM & EVENTS
    // =================================================

    {
        title: "DOM & Events",

        activities: [

            {
                name: "DOM Selection",
                type: "quiz"
            },

            {
                name: "Changing DOM Content",
                type: "code-output"
            },

            {
                name: "Event Listeners",
                type: "code-ordering"
            },

            {
                name: "Creating Elements",
                type: "matching"
            },

            {
                name: "DOM Challenge",
                type: "code-challenge"
            }

        ]
    }

];


// =====================================================
// 2. DOM ELEMENTS
// =====================================================

const topicsContainer =
    document.getElementById(
        "topics-container"
    );

const courseProgressText =
    document.getElementById(
        "course-progress-text"
    );

const courseProgressFill =
    document.getElementById(
        "course-progress-fill"
    );


// =====================================================
// 3. LOAD COMPLETION DATA
// =====================================================

webTopics.forEach(
    topic => {

        topic.activities.forEach(
            activity => {

                const completionKey =
                    "completed-" +
                    activity.name;

                activity.completed =
                    localStorage.getItem(
                        completionKey
                    ) === "true";

            }
        );

    }
);


// =====================================================
// 4. CHECK TOPIC COMPLETION
// =====================================================

function isTopicCompleted(
    topicIndex
) {

    return webTopics[
        topicIndex
    ].activities.every(
        activity =>
            activity.completed
    );

}


// =====================================================
// 5. CHECK TOPIC UNLOCK STATUS
// =====================================================

function isTopicUnlocked(
    topicIndex
) {

    if (topicIndex === 0) {

        return true;

    }

    return isTopicCompleted(
        topicIndex - 1
    );

}


// =====================================================
// 6. CHECK ACTIVITY UNLOCK STATUS
// =====================================================

function isActivityUnlocked(
    topicIndex,
    activityIndex
) {

    if (
        !isTopicUnlocked(
            topicIndex
        )
    ) {

        return false;

    }


    if (activityIndex === 0) {

        return true;

    }


    return webTopics[
        topicIndex
    ].activities[
        activityIndex - 1
    ].completed;

}


// =====================================================
// 7. COUNT COMPLETED ACTIVITIES
// =====================================================

function getCompletedActivityCount(
    topic
) {

    return topic.activities.filter(
        activity =>
            activity.completed
    ).length;

}


// =====================================================
// 8. CREATE ACTIVITY ITEM
// =====================================================

function createActivityItem(
    topic,
    topicIndex,
    activity,
    activityIndex
) {

    const activityItem =
        document.createElement(
            "div"
        );

    activityItem.classList.add(
        "activity-item"
    );


    const unlocked =
        isActivityUnlocked(
            topicIndex,
            activityIndex
        );


    if (
        unlocked ||
        activity.completed
    ) {

        activityItem.classList.add(
            "activity-unlocked"
        );

    } else {

        activityItem.classList.add(
            "activity-locked"
        );

    }


    let activityStatus;


    if (activity.completed) {

        activityStatus =
            "✅";

    } else if (unlocked) {

        activityStatus =
            "🔓";

    } else {

        activityStatus =
            "🔒";

    }


    activityItem.innerHTML = `

        <span>
            ${activityIndex + 1}.
            ${activity.name}
        </span>

        <span class="activity-status">
            ${activityStatus}
        </span>

    `;


    if (
        unlocked ||
        activity.completed
    ) {

        activityItem.addEventListener(
            "click",
            () => {

                openActivity(
                    topic.title,
                    activity.name
                );

            }
        );

    }


    return activityItem;

}


// =====================================================
// 9. CREATE TOPIC CARD
// =====================================================

function createTopicCard(
    topic,
    topicIndex
) {

    const topicCard =
        document.createElement(
            "div"
        );

    topicCard.classList.add(
        "topic-card"
    );


    const unlocked =
        isTopicUnlocked(
            topicIndex
        );


    if (!unlocked) {

        topicCard.classList.add(
            "locked-topic"
        );

    }


    const completedCount =
        getCompletedActivityCount(
            topic
        );


    const topicCompleted =
        completedCount ===
        topic.activities.length;


    topicCard.innerHTML = `

        <h3>
            ${topic.title}
        </h3>

        <p>
            ${topic.activities.length}
            activities
            •
            ${completedCount}
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


    topic.activities.forEach(
        (activity, activityIndex) => {

            const activityItem =
                createActivityItem(
                    topic,
                    topicIndex,
                    activity,
                    activityIndex
                );

            activitiesContainer.appendChild(
                activityItem
            );

        }
    );


    return topicCard;

}


// =====================================================
// 10. RENDER TOPICS
// =====================================================

function renderTopics() {

    if (!topicsContainer) {

        return;

    }


    topicsContainer.innerHTML = "";


    webTopics.forEach(
        (topic, topicIndex) => {

            const topicCard =
                createTopicCard(
                    topic,
                    topicIndex
                );

            topicsContainer.appendChild(
                topicCard
            );

        }
    );

}


// =====================================================
// 11. OPEN ACTIVITY
// =====================================================

function openActivity(
    topicName,
    activityName
) {

    const url =
        "activity.html" +
        "?course=" +
        encodeURIComponent(
            "Web Development"
        ) +
        "&topic=" +
        encodeURIComponent(
            topicName
        ) +
        "&activity=" +
        encodeURIComponent(
            activityName
        );


    window.location.href =
        url;

}


// =====================================================
// 12. UPDATE COURSE PROGRESS
// =====================================================

function updateCourseProgress() {

    const allActivities =
        webTopics.flatMap(
            topic =>
                topic.activities
        );


    const completedActivities =
        allActivities.filter(
            activity =>
                activity.completed
        ).length;


    const totalActivities =
        allActivities.length;


    const progress =
        totalActivities === 0
            ? 0
            : Math.round(
                (
                    completedActivities /
                    totalActivities
                ) * 100
            );


    if (courseProgressText) {

        courseProgressText.textContent =
            progress + "%";

    }


    if (courseProgressFill) {

        courseProgressFill.style.width =
            progress + "%";

    }


    localStorage.setItem(
        "webProgress",
        progress
    );

}


// =====================================================
// 13. INITIAL LOAD
// =====================================================

renderTopics();

updateCourseProgress();