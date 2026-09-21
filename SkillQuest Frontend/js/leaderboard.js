document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ========================================
        // ELEMENTS
        // ========================================

        const leaderboardBody =
            document.getElementById(
                "leaderboard-body"
            );

        const filterButtons =
            document.querySelectorAll(
                ".leaderboard-filter"
            );

        const currentRank =
            document.getElementById(
                "current-rank"
            );


        // ========================================
        // COURSE IDS
        // ========================================

        const courseIds = {

            Java: 1,

            SQL: null,

            "Web Development": null

        };


        // ========================================
        // LOAD LEADERBOARD
        // ========================================

        async function loadLeaderboard(
            course
        ) {

            const courseId =
                courseIds[course];


            leaderboardBody.innerHTML = `
    <tr>
        <td colspan="4">
            Loading ${course} leaderboard...
        </td>
    </tr>
`;


currentRank.textContent =
    `Loading ${course} rank...`;


            if (!courseId) {

                leaderboardBody.innerHTML = `
                    <tr>
                        <td colspan="4">
                            ${course} leaderboard
                            will be available after
                            backend course migration.
                        </td>
                    </tr>
                `;


                currentRank.textContent =
                    "Your Rank: -";


                return;

            }


            try {

                const response =
                    await authenticatedFetch(
                        `/leaderboard/courses/${courseId}`
                    );


                if (!response.ok) {

    const errorMessage =
        await getApiErrorMessage(
            response,
            "Unable to load leaderboard."
        );


    leaderboardBody.innerHTML = `
        <tr>
            <td colspan="4">
                ${errorMessage}
            </td>
        </tr>
    `;


    currentRank.textContent =
        `Your ${course} Rank: -`;


    return;

}


                const learners =
                    await response.json();


                displayLeaderboard(
                    learners
                );


                await loadCurrentRank(
                    course,
                    courseId
                );


            } catch (error) {

    console.error(
        "Leaderboard error:",
        error
    );


    leaderboardBody.innerHTML = `
        <tr>
            <td colspan="4">
                Unable to connect to SkillQuest.
                Please try again.
            </td>
        </tr>
    `;


    currentRank.textContent =
        `Your ${course} Rank: -`;

}

        }


        // ========================================
        // DISPLAY LEADERBOARD
        // ========================================

        function displayLeaderboard(
            learners
        ) {

            leaderboardBody.innerHTML =
                "";


            if (learners.length === 0) {

                leaderboardBody.innerHTML = `
                    <tr>
                        <td colspan="4">
                            No leaderboard data yet.
                        </td>
                    </tr>
                `;

                return;

            }


            const currentUsername =
                localStorage.getItem(
                    "username"
                );


            learners.forEach(
                learner => {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    const isCurrentUser =
                        learner.username ===
                        currentUsername;


                    if (isCurrentUser) {

                        row.classList.add(
                            "current-user-row"
                        );

                    }


                    const rankCell =
                        document.createElement(
                            "td"
                        );


                    const learnerCell =
                        document.createElement(
                            "td"
                        );


                    const xpCell =
                        document.createElement(
                            "td"
                        );


                    const statusCell =
                        document.createElement(
                            "td"
                        );


                    if (learner.rank === 1) {

                        rankCell.textContent =
                            "🥇 1";

                    } else if (
                        learner.rank === 2
                    ) {

                        rankCell.textContent =
                            "🥈 2";

                    } else if (
                        learner.rank === 3
                    ) {

                        rankCell.textContent =
                            "🥉 3";

                    } else {

                        rankCell.textContent =
                            learner.rank;

                    }


                    learnerCell.textContent =
                        isCurrentUser
                            ? learner.username +
                              " (You)"
                            : learner.username;


                    xpCell.textContent =
                        learner.xp + " XP";


                    statusCell.textContent =
                        isCurrentUser
                            ? "You"
                            : "Learner";


                    row.appendChild(
                        rankCell
                    );

                    row.appendChild(
                        learnerCell
                    );

                    row.appendChild(
                        xpCell
                    );

                    row.appendChild(
                        statusCell
                    );


                    leaderboardBody.appendChild(
                        row
                    );

                }
            );

        }


        // ========================================
        // CURRENT USER RANK
        // ========================================

        async function loadCurrentRank(
            course,
            courseId
        ) {

            try {

                const response =
                    await authenticatedFetch(
                        `/leaderboard/courses/${courseId}/me`
                    );


                if (
                    response.status === 204
                ) {

                    currentRank.textContent =
                        `Your ${course} Rank: -`;

                    return;

                }


                if (!response.ok) {

    const errorMessage =
        await getApiErrorMessage(
            response,
            "Unable to load your rank."
        );


    console.error(
        errorMessage
    );


    currentRank.textContent =
        `Your ${course} Rank: -`;


    return;

}


                const userRank =
                    await response.json();


                currentRank.textContent =
                    `Your ${course} Rank: #${userRank.rank}`;


            } catch (error) {

                console.error(
                    "Current rank error:",
                    error
                );


                currentRank.textContent =
                    `Your ${course} Rank: -`;

            }

        }


        // ========================================
        // COURSE FILTER
        // ========================================

        filterButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        filterButtons.forEach(
                            filterButton => {

                                filterButton
                                    .classList
                                    .remove(
                                        "active"
                                    );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        loadLeaderboard(
                            button.dataset.course
                        );

                    }
                );

            }
        );


        // ========================================
        // INITIAL LEADERBOARD
        // ========================================

        loadLeaderboard(
            "Java"
        );

    }
);