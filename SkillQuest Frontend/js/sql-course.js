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

            {
                name: "Introduction to SQL",
                type: "quiz"
            },

            {
                name: "Data Types",
                type: "matching"
            },

            {
                name: "Constraints",
                type: "fill"
            },

            {
                name: "SQL Fundamentals Challenge",
                type: "true-false"
            }

        ]
    },


    {
        title: "CRUD Operations",

        description:
            "Learn how to create, read, update and delete database records.",

        activities: [

            {
                name: "INSERT",
                type: "fill"
            },

            {
                name: "SELECT",
                type: "quiz"
            },

            {
                name: "UPDATE",
                type: "code-output"
            },

            {
                name: "DELETE & CRUD Challenge",
                type: "debugging"
            }

        ]
    },


    {
        title: "Filtering & Functions",

        description:
            "Filter SQL results and work with operators, conditions and functions.",

        activities: [

            {
                name: "WHERE & Comparison Operators",
                type: "quiz"
            },

            {
                name: "AND, OR & NOT",
                type: "code-output"
            },

            {
                name: "LIKE, IN & BETWEEN",
                type: "fill"
            },

            {
                name: "SQL Functions Challenge",
                type: "matching"
            }

        ]
    },


    {
        title: "Joins",

        description:
            "Combine information from multiple database tables using SQL joins.",

        activities: [

            {
                name: "INNER JOIN",
                type: "quiz"
            },

            {
                name: "LEFT JOIN",
                type: "code-output"
            },

            {
                name: "RIGHT JOIN",
                type: "matching"
            },

            {
                name: "Multiple Table Joins",
                type: "code-ordering"
            },

            {
                name: "Join Debugging Challenge",
                type: "debugging"
            }

        ]
    },


    {
        title: "Subqueries & Aggregation",

        description:
            "Work with aggregate functions, grouping, HAVING and nested queries.",

        activities: [

            {
                name: "Aggregate Functions",
                type: "matching"
            },

            {
                name: "GROUP BY",
                type: "code-output"
            },

            {
                name: "HAVING",
                type: "fill"
            },

            {
                name: "Subqueries",
                type: "code-ordering"
            },

            {
                name: "Aggregation Challenge",
                type: "debugging"
            }

        ]
    },


    {
        title: "Advanced SQL",

        description:
            "Learn keys, views, indexes, window functions and advanced SQL concepts.",

        activities: [

            {
                name: "Primary & Foreign Keys",
                type: "quiz"
            },

            {
                name: "Views",
                type: "true-false"
            },

            {
                name: "Indexes",
                type: "matching"
            },

            {
                name: "Window Functions",
                type: "code-output"
            },

            {
                name: "Advanced SQL Challenge",
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

    const activityCard =
        document.createElement(
            "div"
        );

    activityCard.classList.add(
        "activity-card"
    );


    const unlocked =
        isActivityUnlocked(
            topicIndex,
            activityIndex
        );


    if (activity.completed) {

        activityCard.classList.add(
            "completed"
        );

    } else if (!unlocked) {

        activityCard.classList.add(
            "locked"
        );

    } else {

        activityCard.classList.add(
            "unlocked"
        );

    }


    const activityInfo =
        document.createElement(
            "div"
        );

    activityInfo.classList.add(
        "activity-info"
    );


    const activityTitle =
        document.createElement(
            "h4"
        );

    activityTitle.textContent =
        activity.name;


    const activityType =
        document.createElement(
            "p"
        );

    activityType.textContent =
        formatActivityType(
            activity.type
        );


    activityInfo.appendChild(
        activityTitle
    );

    activityInfo.appendChild(
        activityType
    );


    const activityStatus =
        document.createElement(
            "span"
        );

    activityStatus.classList.add(
        "activity-status"
    );


    if (activity.completed) {

        activityStatus.textContent =
            "✓ Completed";

    } else if (!unlocked) {

        activityStatus.textContent =
            "🔒 Locked";

    } else {

        activityStatus.textContent =
            "▶ Start";

    }


    activityCard.appendChild(
        activityInfo
    );

    activityCard.appendChild(
        activityStatus
    );


    if (
        unlocked ||
        activity.completed
    ) {

        activityCard.addEventListener(
            "click",
            () => {

                openActivity(
                    topic.title,
                    activity.name
                );

            }
        );

    }


    return activityCard;

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


    const topicHeader =
        document.createElement(
            "div"
        );

    topicHeader.classList.add(
        "topic-header"
    );


    const topicTitleArea =
        document.createElement(
            "div"
        );


    const topicTitle =
        document.createElement(
            "h3"
        );

    topicTitle.textContent =
        topic.title;


    const topicDescription =
        document.createElement(
            "p"
        );

    topicDescription.textContent =
        topic.description;


    topicTitleArea.appendChild(
        topicTitle
    );

    topicTitleArea.appendChild(
        topicDescription
    );


    const completedCount =
        getCompletedActivityCount(
            topic
        );


    const topicProgress =
        document.createElement(
            "span"
        );

    topicProgress.textContent =
        `${completedCount} / ${topic.activities.length} complete`;


    topicHeader.appendChild(
        topicTitleArea
    );

    topicHeader.appendChild(
        topicProgress
    );


    const activitiesContainer =
        document.createElement(
            "div"
        );

    activitiesContainer.classList.add(
        "activities-container"
    );


    topic.activities.forEach(
        (activity, activityIndex) => {

            const activityCard =
                createActivityCard(
                    topic,
                    topicIndex,
                    activity,
                    activityIndex
                );

            activitiesContainer.appendChild(
                activityCard
            );

        }
    );


    topicCard.appendChild(
        topicHeader
    );

    topicCard.appendChild(
        activitiesContainer
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
    topicName,
    activityName
) {

    const url =
        "activity.html" +
        "?course=" +
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