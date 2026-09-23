// =====================================================
// SQL COURSE - SKILLQUEST
// =====================================================


// =====================================================
// 1. SQL COURSE DATA
// =====================================================

const sqlTopics = [

    {
        title: "SQL Fundamentals",

        description:
            "Learn SQL basics, data types, constraints and core database concepts.",

        activities: [

           { id: 33, name: "Introduction to SQL", type: "quiz" },
{ id: 34, name: "Data Types", type: "matching" },
{ id: 35, name: "Constraints", type: "fill" },
{ id: 36, name: "SQL Fundamentals Challenge", type: "true-false" }

        ]
    },


    {
        title: "CRUD Operations",

        description:
            "Learn how to create, read, update and delete database records.",

        activities: [

           { id: 37, name: "INSERT", type: "fill" },
{ id: 38, name: "SELECT", type: "quiz" },
{ id: 39, name: "UPDATE", type: "code-output" },
{ id: 40, name: "DELETE & CRUD Challenge", type: "debugging" }

        ]
    },


    {
        title: "Filtering & Functions",

        description:
            "Filter SQL results and work with operators, conditions and functions.",

        activities: [

           { id: 41, name: "WHERE & Comparison Operators", type: "quiz" },
{ id: 42, name: "AND, OR & NOT", type: "code-output" },
{ id: 43, name: "LIKE, IN & BETWEEN", type: "fill" },
{ id: 44, name: "SQL Functions Challenge", type: "matching" }

        ]
    },


    {
        title: "Joins",

        description:
            "Combine information from multiple database tables using SQL joins.",

        activities: [

            { id: 45, name: "INNER JOIN", type: "quiz" },
{ id: 46, name: "LEFT JOIN", type: "code-output" },
{ id: 47, name: "RIGHT JOIN", type: "matching" },
{ id: 48, name: "Multiple Table Joins", type: "code-ordering" },
{ id: 49, name: "Join Debugging Challenge", type: "debugging" }

        ]
    },


    {
        title: "Subqueries & Aggregation",

        description:
            "Work with aggregate functions, grouping, HAVING and nested queries.",

        activities: [

           { id: 50, name: "Aggregate Functions", type: "matching" },
{ id: 51, name: "GROUP BY", type: "code-output" },
{ id: 52, name: "HAVING", type: "fill" },
{ id: 53, name: "Subqueries", type: "code-ordering" },
{ id: 54, name: "Aggregation Challenge", type: "debugging" }
        ]
    },


    {
        title: "Advanced SQL",

        description:
            "Learn keys, views, indexes, window functions and advanced SQL concepts.",

        activities: [

            { id: 55, name: "Primary & Foreign Keys", type: "quiz" },
{ id: 56, name: "Views", type: "true-false" },
{ id: 57, name: "Indexes", type: "matching" },
{ id: 58, name: "Window Functions", type: "code-output" },
{ id: 59, name: "Advanced SQL Challenge", type: "code-challenge" }

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

sqlTopics.forEach(topic => {

    topic.activities.forEach(activity => {

        const completionKey =
            "completed-" + activity.name;

        activity.completed =
            localStorage.getItem(
                completionKey
            ) === "true";

    });

});


// =====================================================
// 4. CHECK TOPIC COMPLETION
// =====================================================

function isTopicCompleted(topicIndex) {

    return sqlTopics[
        topicIndex
    ].activities.every(
        activity =>
            activity.completed
    );

}


// =====================================================
// 5. CHECK TOPIC UNLOCK STATUS
// =====================================================

function isTopicUnlocked(topicIndex) {

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
        !isTopicUnlocked(topicIndex)
    ) {
        return false;
    }

    if (activityIndex === 0) {
        return true;
    }

    return sqlTopics[
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
// 8. CREATE ACTIVITY CARD
// =====================================================

function createActivityCard(
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


    if (unlocked || activity.completed) {

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

        activityStatus = "✅";

    } else if (unlocked) {

        activityStatus = "🔓";

    } else {

        activityStatus = "🔒";

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
    activity.id,
    topic.title,
    activity.name
);

            }
        );

    }


    return activityItem;

}


// =====================================================
// 9. FORMAT ACTIVITY TYPE
// =====================================================

function formatActivityType(type) {

    const typeNames = {

        "quiz":
            "Multiple Choice Quiz",

        "fill":
            "Fill in the Blank",

        "matching":
            "Matching",

        "true-false":
            "True / False",

        "code-output":
            "Code Output",

        "debugging":
            "Debugging",

        "code-ordering":
            "Code Ordering",

        "code-challenge":
            "Code Challenge"

    };

    return typeNames[type] || type;

}


// =====================================================
// 10. CREATE TOPIC CARD
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
                createActivityCard(
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
// 11. RENDER TOPICS
// =====================================================

function renderTopics() {

    if (!topicsContainer) {
        return;
    }

    topicsContainer.innerHTML = "";


    sqlTopics.forEach(
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
// 12. OPEN ACTIVITY
// =====================================================

function openActivity(
    activityId,
    topicName,
    activityName
) {

    const url =
        "activity.html" +
        "?activityId=" +
        encodeURIComponent(activityId) +
        "&course=" +
        encodeURIComponent("SQL") +
        "&topic=" +
        encodeURIComponent(topicName) +
        "&activity=" +
        encodeURIComponent(activityName);

    window.location.href = url;
}


// =====================================================
// 13. UPDATE COURSE PROGRESS
// =====================================================

function updateCourseProgress() {

    const allActivities =
        sqlTopics.flatMap(
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
        "sqlProgress",
        progress
    );

}


// =====================================================
// 14. INITIAL LOAD
// =====================================================

renderTopics();

updateCourseProgress();