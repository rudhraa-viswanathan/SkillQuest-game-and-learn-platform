document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // ELEMENTS
    // ========================================

    const leaderboardBody =
        document.getElementById("leaderboard-body");

    const filterButtons =
        document.querySelectorAll(".leaderboard-filter");

        const currentRank =
    document.getElementById("current-rank");

    // ========================================
    // SAMPLE LEADERBOARD DATA
    // ========================================

    const leaderboardData = {

        Java: [

            {
                name: "Arun",
                xp: 1450,
                progress: 92
            },

            {
                name: "Priya",
                xp: 1320,
                progress: 86
            },

            {
                name: "Kavin",
                xp: 1100,
                progress: 78
            },

            {
                name: "Meena",
                xp: 980,
                progress: 70
            }

        ],


        SQL: [

            {
                name: "Priya",
                xp: 1380,
                progress: 90
            },

            {
                name: "Meena",
                xp: 1200,
                progress: 82
            },

            {
                name: "Arun",
                xp: 1050,
                progress: 74
            },

            {
                name: "Kavin",
                xp: 900,
                progress: 65
            }

        ],


        "Web Development": [

            {
                name: "Kavin",
                xp: 1500,
                progress: 95
            },

            {
                name: "Arun",
                xp: 1250,
                progress: 84
            },

            {
                name: "Meena",
                xp: 1080,
                progress: 76
            },

            {
                name: "Priya",
                xp: 950,
                progress: 68
            }

        ]

    };

    // ========================================
// CURRENT USER
// ========================================

const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));

const currentUserName =
    loggedInUser?.name || "You";

const javaProgress =
    Number(localStorage.getItem("javaProgress")) || 0;

const sqlProgress =
    Number(localStorage.getItem("sqlProgress")) || 0;

const webProgress =
    Number(localStorage.getItem("webProgress")) || 0;

const totalXp =
    Number(localStorage.getItem("xp")) || 0;


// Add current user to Java leaderboard

leaderboardData.Java.push({

    name: currentUserName,
    xp: totalXp,
    progress: javaProgress,
    isCurrentUser: true

});


// Add current user to SQL leaderboard

leaderboardData.SQL.push({

    name: currentUserName,
    xp: totalXp,
    progress: sqlProgress,
    isCurrentUser: true

});


// Add current user to Web Development leaderboard

leaderboardData["Web Development"].push({

    name: currentUserName,
    xp: totalXp,
    progress: webProgress,
    isCurrentUser: true

});

    // ========================================
    // RENDER LEADERBOARD
    // ========================================

    function renderLeaderboard(course) {

        leaderboardBody.innerHTML = "";

        const learners =
            [...leaderboardData[course]];


        // Highest XP should appear first

        learners.sort(function (a, b) {

            return b.xp - a.xp;

        });

        const currentUserIndex =
    learners.findIndex(function (learner) {

        return learner.isCurrentUser;

    });


if (currentUserIndex !== -1) {

    currentRank.textContent =
        "Your " +
        course +
        " Rank: #" +
        (currentUserIndex + 1);

} else {

    currentRank.textContent =
        "Your Rank: -";

}


        learners.forEach(function (learner, index) {

            const row =
                document.createElement("tr");

                if (learner.isCurrentUser) {

    row.classList.add(
        "current-user-row"
    );

}

            const rankCell =
                document.createElement("td");

            const learnerCell =
                document.createElement("td");

            const xpCell =
                document.createElement("td");

            const progressCell =
                document.createElement("td");


            if (index === 0) {

    rankCell.textContent = "🥇 1";

} else if (index === 1) {

    rankCell.textContent = "🥈 2";

} else if (index === 2) {

    rankCell.textContent = "🥉 3";

} else {

    rankCell.textContent =
        index + 1;

}

            learnerCell.textContent =
    learner.isCurrentUser
        ? learner.name + " (You)"
        : learner.name;

            xpCell.textContent =
                learner.xp + " XP";

            progressCell.textContent =
                learner.progress + "%";


            row.appendChild(rankCell);

            row.appendChild(learnerCell);

            row.appendChild(xpCell);

            row.appendChild(progressCell);


            leaderboardBody.appendChild(row);

        });

    }

    // ========================================
// COURSE FILTER
// ========================================

filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            filterButtons.forEach(
                function (filterButton) {

                    filterButton.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            const selectedCourse =
                button.dataset.course;


            renderLeaderboard(
                selectedCourse
            );

        }
    );

});

    // ========================================
    // INITIAL LEADERBOARD
    // ========================================

    renderLeaderboard("Java");

});