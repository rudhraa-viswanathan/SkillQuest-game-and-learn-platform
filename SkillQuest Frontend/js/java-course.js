// =====================================================
// SKILLQUEST - JAVA COURSE
// BACKEND INTEGRATION
// =====================================================


// -----------------------------------------------------
// JAVA COURSE ID
// -----------------------------------------------------

const JAVA_COURSE_ID = 1;
let javaTopicProgress = [];


// -----------------------------------------------------
// PAGE ELEMENTS
// -----------------------------------------------------

const topicsContainer =
    document.getElementById(
        "topics-container"
    );

const progressText =
    document.getElementById(
        "course-progress"
    );

const progressFill =
    document.getElementById(
        "progress-fill"
    );


// -----------------------------------------------------
// LOAD JAVA COURSE DATA
// -----------------------------------------------------

async function loadJavaCourse() {

const topicsContainer =
    document.getElementById(
        "topics-container"
    );


topicsContainer.innerHTML = `
    <p class="loading-message">
        Loading Java topics and activities...
    </p>
`;


    try {

        // ---------------------------------------------
        // Load all topics
        // ---------------------------------------------

        const topicsResponse =
            await authenticatedFetch(
                "/topics"
            );


        if (!topicsResponse.ok) {

            alert(
                "Unable to load course topics."
            );

            return;
        }


        const allTopics =
            await topicsResponse.json();


        // ---------------------------------------------
        // Keep only Java topics
        // ---------------------------------------------

        const javaTopics =
            allTopics
                .filter(
                    topic =>
                        topic.courseId ===
                        JAVA_COURSE_ID
                )
                .sort(
                    (firstTopic, secondTopic) =>
                        firstTopic.orderIndex -
                        secondTopic.orderIndex
                );


        // ---------------------------------------------
        // Load all activities
        // ---------------------------------------------

        const activitiesResponse =
            await authenticatedFetch(
                "/activities"
            );


        if (!activitiesResponse.ok) {

            alert(
                "Unable to load course activities."
            );

            return;
        }


        const allActivities =
            await activitiesResponse.json();


        // ---------------------------------------------
        // Connect activities to their topics
        // ---------------------------------------------

        javaTopics.forEach(
            topic => {

                topic.activities =
                    allActivities.filter(
                        activity =>
                            activity.topicId ===
                            topic.id
                    );

            }
        );


        javaTopicProgress =
    await loadTopicProgress();


displayJavaTopics(
    javaTopics
);


    } catch (error) {

        console.error(
            "Java course loading error:",
            error
        );

    }

}

// =====================================================
// LOAD TOPIC PROGRESS
// =====================================================

async function loadTopicProgress() {

    try {

        const response =
            await authenticatedFetch(
                `/progress/courses/${JAVA_COURSE_ID}/topics`
            );


        if (!response.ok) {

    const errorMessage =
        await getApiErrorMessage(
            response,
            "Unable to load topic progress."
        );


    console.error(
        errorMessage
    );


    return [];

}


        return await response.json();


    } catch (error) {

        console.error(
            "Topic progress error:",
            error
        );

        return [];

    }

}
// =====================================================
// DISPLAY JAVA TOPICS
// =====================================================

function displayJavaTopics(
    javaTopics
) {

    topicsContainer.innerHTML = "";


    if (javaTopics.length === 0) {

        topicsContainer.innerHTML = `
            <p>
                No Java topics available.
            </p>
        `;

        return;
    }


    javaTopics.forEach(
        (topic, topicIndex) => {

            createTopicCard(
                topic,
                topicIndex
            );

        }
    );

}


// =====================================================
// CREATE TOPIC CARD
// =====================================================

function createTopicCard(
    topic,
    topicIndex
) {

    const topicProgress =
    javaTopicProgress.find(
        progress =>
            progress.topicId ===
            topic.id
    );


const isUnlocked =
    topicProgress
        ? topicProgress.unlocked
        : false;


const isCompleted =
    topicProgress
        ? topicProgress.completed
        : false;

    const topicCard =
        document.createElement(
            "div"
        );


    topicCard.classList.add(
        "topic-card"
    );

    if (!isUnlocked) {

    topicCard.classList.add(
        "topic-locked"
    );

}


if (isCompleted) {

    topicCard.classList.add(
        "topic-completed"
    );

}

    topicCard.innerHTML = `

        <h3>
            ${topic.name}
        </h3>

        <p>
            ${topic.description}
        </p>

        <p>
            ${topic.activities.length}
            activities
        </p>

        <p class="topic-status">
    ${
        isCompleted
            ? "✅ Completed"
            : isUnlocked
                ? "🔓 Unlocked"
                : "🔒 Locked"
    }
</p>

        <div class="activities-container">
        </div>

    `;


    const activitiesContainer =
        topicCard.querySelector(
            ".activities-container"
        );


    // -------------------------------------------------
    // No activities
    // -------------------------------------------------

    if (topic.activities.length === 0) {

        activitiesContainer.innerHTML = `
            <p>
                No activities available yet.
            </p>
        `;

    }


    // -------------------------------------------------
    // Create activities
    // -------------------------------------------------

    topic.activities.forEach(
        (activity, activityIndex) => {

            createActivityItem(
    activity,
    topic,
    activityIndex,
    activitiesContainer,
    isUnlocked
);

        }
    );


    topicsContainer.appendChild(
        topicCard
    );

}


// =====================================================
// CREATE ACTIVITY ITEM
// =====================================================

function createActivityItem(
    activity,
    topic,
    activityIndex,
    activitiesContainer,
    isTopicUnlocked
) {

    const activityItem =
        document.createElement(
            "div"
        );


    activityItem.classList.add(
        "activity-item"
    );

   if (isTopicUnlocked) {

    activityItem.classList.add(
        "activity-unlocked"
    );

} else {

    activityItem.classList.add(
        "activity-locked"
    );

}


    activityItem.dataset.activityId =
        activity.id;

    activityItem.dataset.activity =
        activity.title;

    activityItem.dataset.topicId =
        topic.id;

    activityItem.dataset.topic =
        topic.name;

    activityItem.dataset.type =
        activity.type;


    activityItem.innerHTML = `

        <span>
            ${activityIndex + 1}.
            ${activity.title}
        </span>

        <span class="activity-status">
    ${isTopicUnlocked ? "🔓" : "🔒"}
</span>

    `;


    activityItem.addEventListener(
    "click",
    () => {

        if (!isTopicUnlocked) {

            alert(
                "Complete the previous topic to unlock this activity."
            );

            return;
        }


        openActivity(
            activity,
            topic
        );

    }
);


    activitiesContainer.appendChild(
        activityItem
    );

}


// =====================================================
// ACTIVITY NAVIGATION
// =====================================================

function openActivity(
    activity,
    topic
) {

    const params =
        new URLSearchParams();


    params.set(
        "activityId",
        activity.id
    );

    params.set(
        "topicId",
        topic.id
    );

    params.set(
        "topic",
        topic.name
    );

    params.set(
        "activity",
        activity.title
    );

    params.set(
        "type",
        activity.type
    );


    window.location.href =
        `activity.html?${params.toString()}`;

}

// =====================================================
// LOAD REAL COURSE PROGRESS
// =====================================================

async function loadJavaProgress() {

    try {

        const response =
            await authenticatedFetch(
                `/progress/courses/${JAVA_COURSE_ID}`
            );


        if (!response.ok) {

    const errorMessage =
        await getApiErrorMessage(
            response,
            "Unable to load Java progress."
        );


    console.error(
        errorMessage
    );


    if (progressText) {

        progressText.textContent =
            "Unavailable";

    }


    return;

}


        const progress =
            await response.json();


        const percentage =
            Math.round(
                progress.progressPercentage || 0
            );


        if (progressText) {

            progressText.textContent =
                percentage + "%";

        }


        if (progressFill) {

            progressFill.style.width =
                percentage + "%";

        }


    } catch (error) {

        console.error(
            "Java progress error:",
            error
        );

    }

}

// =====================================================
// LOAD COURSE BADGES
// =====================================================

async function loadJavaBadges() {

    try {

        const response =
            await authenticatedFetch(
                `/badges/courses/${JAVA_COURSE_ID}`
            );


        if (!response.ok) {

    const errorMessage =
        await getApiErrorMessage(
            response,
            "Unable to load Java badges."
        );


    console.error(
        errorMessage
    );


    return [];

}


        const badges =
            await response.json();


        console.log(
            "Java badges:",
            badges
        );


        return badges;


    } catch (error) {

        console.error(
            "Badge loading error:",
            error
        );

        return [];

    }

}

// ========================================
// PROGRAMMING ASSESSMENT
// ========================================

async function loadProgrammingAssessment() {

    const assessmentStatus =
        document.getElementById(
            "assessment-status"
        );

    const assessmentButton =
        document.getElementById(
            "assessment-button"
        );


    if (
        !assessmentStatus ||
        !assessmentButton
    ) {
        return;
    }


    try {

        const response =
            await authenticatedFetch(
                `/assessments/courses/${JAVA_COURSE_ID}`
            );


        // ========================================
        // ASSESSMENT AVAILABLE
        // ========================================

        if (response.ok) {

            const assessment =
                await response.json();


            console.log(
                "Java assessment:",
                assessment
            );


            assessmentStatus.textContent =
                "You have unlocked the Java Programming Assessment.";


            assessmentButton.disabled =
                false;


            assessmentButton.textContent =
                "🔓 Start Assessment";


            assessmentButton.addEventListener(
                "click",
                function () {

                    window.location.href =
                        `assessment.html?courseId=${JAVA_COURSE_ID}`;

                }
            );


            return;
        }


        // ========================================
        // ASSESSMENT LOCKED
        // ========================================

        if (
            response.status === 400 ||
            response.status === 403
        ) {

            assessmentStatus.textContent =
                "Reach 75% course progress to unlock this assessment.";


            assessmentButton.disabled =
                true;


            assessmentButton.textContent =
                "🔒 Assessment Locked";


            return;
        }


        // ========================================
        // OTHER ERROR
        // ========================================


        const errorMessage =
    await getApiErrorMessage(
        response,
        "Assessment is currently unavailable."
    );


console.error(
    errorMessage
);


        assessmentStatus.textContent =
            "Assessment is currently unavailable.";


        assessmentButton.disabled =
            true;


        assessmentButton.textContent =
            "Assessment Unavailable";


    } catch (error) {

        console.error(
            "Assessment loading error:",
            error
        );


        assessmentStatus.textContent =
            "Assessment is currently unavailable.";


        assessmentButton.disabled =
            true;


        assessmentButton.textContent =
            "Assessment Unavailable";

    }

}

// =====================================================
// START
// =====================================================

loadJavaCourse();
loadJavaProgress();
loadJavaBadges();
loadProgrammingAssessment();