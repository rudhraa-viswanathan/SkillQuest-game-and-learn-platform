const isLoggedIn =
    localStorage.getItem(
        "isLoggedIn"
    );


if (isLoggedIn !== "true") {

    window.location.href =
        "login.html";

}

// ========================================
// SkillQuest Dashboard Data
// ========================================

const dashboardData = {

    // User Stats
    xp: 850,
    energy: 80,
    maxEnergy: 100,
    overallProgress: 65,

    // User Courses
    courses: [

        {
            name: "Java Development",
            progress: 72,
            completedLessons: 18,
            totalLessons: 25,
            xp: 850
        },

        {
            name: "Web Development",
            progress: 48,
            completedLessons: 12,
            totalLessons: 25,
            xp: 620
        },

        {
            name: "SQL & Database",
            progress: 35,
            completedLessons: 9,
            totalLessons: 25,
            xp: 430
        }

    ]

};


// ========================================
// Load XP from localStorage
// ========================================

const savedXP = localStorage.getItem("xp");

if (savedXP !== null) {
    dashboardData.xp = Number(savedXP);
}


// ========================================
// Save XP if it doesn't already exist
// ========================================

if (savedXP === null) {
    localStorage.setItem("xp", dashboardData.xp);
}


// ========================================
// Connect XP to Dashboard
// ========================================

const xpValue = document.getElementById("xp-value");

xpValue.textContent =
    dashboardData.xp + " XP";


// ========================================
// Load Energy from localStorage
// ========================================

const savedEnergy = localStorage.getItem("energy");

if (savedEnergy !== null) {
    dashboardData.energy = Number(savedEnergy);
}


// ========================================
// Save Energy if it doesn't already exist
// ========================================

if (savedEnergy === null) {
    localStorage.setItem("energy", dashboardData.energy);
}


// ========================================
// Connect Energy to Dashboard
// ========================================

const energyValue =
    document.getElementById("energy-value");

energyValue.textContent =
    dashboardData.energy +
    " / " +
    dashboardData.maxEnergy;


// ========================================
// Load Overall Progress from localStorage
// ========================================

const savedOverallProgress =
    localStorage.getItem("overallProgress");

if (savedOverallProgress !== null) {
    dashboardData.overallProgress =
        Number(savedOverallProgress);
}


// ========================================
// Save Overall Progress if it doesn't exist
// ========================================

if (savedOverallProgress === null) {
    localStorage.setItem(
        "overallProgress",
        dashboardData.overallProgress
    );
}


// ========================================
// Connect Overall Progress to Dashboard
// ========================================

const overallProgressValue =
    document.getElementById("overall-progress-value");

const progressMessage =
    document.getElementById("progress-message");

const overallProgressFill =
    document.getElementById("overall-progress-fill");


overallProgressValue.textContent =
    dashboardData.overallProgress + "%";

progressMessage.textContent =
    "You've completed " +
    dashboardData.overallProgress +
    "% of your learning journey.";

overallProgressFill.style.width =
    dashboardData.overallProgress + "%";


// ========================================
// Load Java Course Progress
// ========================================

const savedJavaProgress =
    localStorage.getItem("javaProgress");

if (savedJavaProgress !== null) {
    dashboardData.courses[0].progress =
        Number(savedJavaProgress);
}


// ========================================
// Save Java Course Progress
// ========================================

if (savedJavaProgress === null) {
    localStorage.setItem(
        "javaProgress",
        dashboardData.courses[0].progress
    );
}


// ========================================
// Load Web Course Progress
// ========================================

const savedWebProgress =
    localStorage.getItem("webProgress");

if (savedWebProgress !== null) {
    dashboardData.courses[1].progress =
        Number(savedWebProgress);
}


// ========================================
// Save Web Course Progress
// ========================================

if (savedWebProgress === null) {
    localStorage.setItem(
        "webProgress",
        dashboardData.courses[1].progress
    );
}


// ========================================
// Load SQL Course Progress
// ========================================

const savedSQLProgress =
    localStorage.getItem("sqlProgress");

if (savedSQLProgress !== null) {
    dashboardData.courses[2].progress =
        Number(savedSQLProgress);
}


// ========================================
// Save SQL Course Progress
// ========================================

if (savedSQLProgress === null) {
    localStorage.setItem(
        "sqlProgress",
        dashboardData.courses[2].progress
    );
}


// ========================================
// Connect Course Data to Dashboard
// ========================================

const javaCourse = dashboardData.courses[0];
const webCourse = dashboardData.courses[1];
const sqlCourse = dashboardData.courses[2];


// ========================================
// Java Course
// ========================================

document.getElementById("java-xp").textContent =
    "⭐ " + javaCourse.xp + " XP";

document.getElementById("java-progress").textContent =
    javaCourse.progress + "%";

document.getElementById("java-lessons").textContent =
    javaCourse.completedLessons +
    " / " +
    javaCourse.totalLessons +
    " lessons completed";


// ========================================
// Web Development Course
// ========================================

document.getElementById("web-xp").textContent =
    "⭐ " + webCourse.xp + " XP";

document.getElementById("web-progress").textContent =
    webCourse.progress + "%";

document.getElementById("web-lessons").textContent =
    webCourse.completedLessons +
    " / " +
    webCourse.totalLessons +
    " lessons completed";


// ========================================
// SQL Course
// ========================================

document.getElementById("sql-xp").textContent =
    "⭐ " + sqlCourse.xp + " XP";

document.getElementById("sql-progress").textContent =
    sqlCourse.progress + "%";

document.getElementById("sql-lessons").textContent =
    sqlCourse.completedLessons +
    " / " +
    sqlCourse.totalLessons +
    " lessons completed";


// ========================================
// Connect Course Progress Bars
// ========================================

document.getElementById("java-progress-fill").style.width =
    javaCourse.progress + "%";

document.getElementById("web-progress-fill").style.width =
    webCourse.progress + "%";

document.getElementById("sql-progress-fill").style.width =
    sqlCourse.progress + "%";


// ========================================
// Java Continue Learning Button
// ========================================

const javaContinueButton =
    document.getElementById("java-continue-btn");

javaContinueButton.addEventListener("click", function () {

    window.location.href = "java-course.html";

});


// ========================================
// Web Continue Learning Button
// ========================================

const webContinueButton =
    document.getElementById("web-continue-btn");

webContinueButton.addEventListener("click", function () {

    window.location.href = "web-course.html";

});


// ========================================
// SQL Continue Learning Button
// ========================================

const sqlContinueButton =
    document.getElementById("sql-continue-btn");

sqlContinueButton.addEventListener("click", function () {

    window.location.href = "sql-course.html";

});

const savedUser =
    localStorage.getItem(
        "skillQuestUser"
    );


if (savedUser) {

    const user =
        JSON.parse(savedUser);


    const dashboardUserName =
        document.getElementById(
            "dashboard-user-name"
        );


    if (dashboardUserName) {

        dashboardUserName.textContent =
            user.name;

    }

}

const logoutButton =
    document.getElementById(
        "logout-btn"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "isLoggedIn"
            );


            window.location.href =
                "login.html";

        }
    );

}