// =====================================================
// SKILLQUEST DASHBOARD
// BACKEND INTEGRATION
// =====================================================


// -----------------------------------------------------
// AUTHENTICATION CHECK
// -----------------------------------------------------

const jwtToken =
    localStorage.getItem(
        "jwtToken"
    );


if (!jwtToken) {

    window.location.href =
        "login.html";

}


// -----------------------------------------------------
// COURSE IDS
// -----------------------------------------------------

const JAVA_COURSE_ID = 1;

// These will be connected when the final
// SQL and Web backend course data is created.

const WEB_COURSE_ID = null;
const SQL_COURSE_ID = null;


// -----------------------------------------------------
// USERNAME
// -----------------------------------------------------

const username =
    localStorage.getItem(
        "username"
    );


const dashboardUserName =
    document.getElementById(
        "dashboard-user-name"
    );


if (
    username &&
    dashboardUserName
) {

    dashboardUserName.textContent =
        username;

}


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    await loadGameStats();

    await loadCourseProgress();

}


// =====================================================
// LOAD REAL XP AND ENERGY
// =====================================================

async function loadGameStats() {

    const stats =
        await getMyGameStats();


    if (!stats) {
        return;
    }


    const xpValue =
        document.getElementById(
            "xp-value"
        );


    const energyValue =
        document.getElementById(
            "energy-value"
        );


    if (xpValue) {

        xpValue.textContent =
            stats.xp + " XP";

    }


    if (energyValue) {

        energyValue.textContent =
            stats.energy + " Energy";

    }

}


// =====================================================
// LOAD COURSE PROGRESS
// =====================================================

async function loadCourseProgress() {

    const courseProgressList = [];


    // -------------------------------------------------
    // JAVA
    // -------------------------------------------------

    const javaProgress =
        await getCourseProgress(
            JAVA_COURSE_ID
        );


    if (javaProgress) {

        displayCourseProgress(
            "java",
            javaProgress
        );

        courseProgressList.push(
            javaProgress.progressPercentage
        );

    }


    // -------------------------------------------------
    // WEB
    // -------------------------------------------------

    if (WEB_COURSE_ID) {

        const webProgress =
            await getCourseProgress(
                WEB_COURSE_ID
            );


        if (webProgress) {

            displayCourseProgress(
                "web",
                webProgress
            );

            courseProgressList.push(
                webProgress.progressPercentage
            );

        }

    } else {

        displayEmptyCourseProgress(
            "web"
        );

    }


    // -------------------------------------------------
    // SQL
    // -------------------------------------------------

    if (SQL_COURSE_ID) {

        const sqlProgress =
            await getCourseProgress(
                SQL_COURSE_ID
            );


        if (sqlProgress) {

            displayCourseProgress(
                "sql",
                sqlProgress
            );

            courseProgressList.push(
                sqlProgress.progressPercentage
            );

        }

    } else {

        displayEmptyCourseProgress(
            "sql"
        );

    }


    updateOverallProgress(
        courseProgressList
    );

}


// =====================================================
// GET COURSE PROGRESS FROM BACKEND
// =====================================================

async function getCourseProgress(
    courseId
) {

    try {

        const response =
            await authenticatedFetch(
                `/progress/courses/${courseId}`
            );


        if (!response.ok) {

            console.error(
                "Unable to load course progress:",
                courseId
            );

            return null;

        }


        return await response.json();


    } catch (error) {

        console.error(
            "Course progress error:",
            error
        );

        return null;

    }

}


// =====================================================
// DISPLAY COURSE PROGRESS
// =====================================================

function displayCourseProgress(
    prefix,
    progress
) {

    const progressPercentage =
        Math.round(
            progress.progressPercentage || 0
        );


    const progressText =
        document.getElementById(
            `${prefix}-progress`
        );


    const lessonsText =
        document.getElementById(
            `${prefix}-lessons`
        );


    const progressFill =
        document.getElementById(
            `${prefix}-progress-fill`
        );


    if (progressText) {

        progressText.textContent =
            progressPercentage + "%";

    }


    if (lessonsText) {

        lessonsText.textContent =
            progress.completedActivities +
            " / " +
            progress.totalActivities +
            " activities completed";

    }


    if (progressFill) {

        progressFill.style.width =
            progressPercentage + "%";

    }

}


// =====================================================
// EMPTY COURSE PROGRESS
// =====================================================

function displayEmptyCourseProgress(
    prefix
) {

    const progressText =
        document.getElementById(
            `${prefix}-progress`
        );


    const lessonsText =
        document.getElementById(
            `${prefix}-lessons`
        );


    const progressFill =
        document.getElementById(
            `${prefix}-progress-fill`
        );


    const xpText =
        document.getElementById(
            `${prefix}-xp`
        );


    if (progressText) {

        progressText.textContent =
            "0%";

    }


    if (lessonsText) {

        lessonsText.textContent =
            "0 / 0 activities completed";

    }


    if (progressFill) {

        progressFill.style.width =
            "0%";

    }


    if (xpText) {

        xpText.textContent =
            "⭐ 0 XP";

    }

}


// =====================================================
// OVERALL PROGRESS
// =====================================================

function updateOverallProgress(
    progressList
) {

    let overallProgress = 0;


    if (progressList.length > 0) {

        const total =
            progressList.reduce(
                (sum, progress) =>
                    sum + progress,
                0
            );


        overallProgress =
            Math.round(
                total /
                progressList.length
            );

    }


    const overallProgressValue =
        document.getElementById(
            "overall-progress-value"
        );


    const progressMessage =
        document.getElementById(
            "progress-message"
        );


    const overallProgressFill =
        document.getElementById(
            "overall-progress-fill"
        );


    if (overallProgressValue) {

        overallProgressValue.textContent =
            overallProgress + "%";

    }


    if (progressMessage) {

        progressMessage.textContent =
            "You've completed " +
            overallProgress +
            "% of your learning journey.";

    }


    if (overallProgressFill) {

        overallProgressFill.style.width =
            overallProgress + "%";

    }

}


// =====================================================
// COURSE NAVIGATION
// =====================================================

const javaContinueButton =
    document.getElementById(
        "java-continue-btn"
    );


if (javaContinueButton) {

    javaContinueButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "java-course.html";

        }
    );

}


const webContinueButton =
    document.getElementById(
        "web-continue-btn"
    );


if (webContinueButton) {

    webContinueButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "web-course.html";

        }
    );

}


const sqlContinueButton =
    document.getElementById(
        "sql-continue-btn"
    );


if (sqlContinueButton) {

    sqlContinueButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "sql-course.html";

        }
    );

}


// =====================================================
// LOGOUT
// =====================================================

const logoutButton =
    document.getElementById(
        "logout-btn"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "jwtToken"
            );

            localStorage.removeItem(
                "isLoggedIn"
            );

            localStorage.removeItem(
                "username"
            );


            window.location.href =
                "login.html";

        }
    );

}


// =====================================================
// START DASHBOARD
// =====================================================

loadDashboard();