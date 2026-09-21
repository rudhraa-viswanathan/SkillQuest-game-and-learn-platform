document.addEventListener(
    "DOMContentLoaded",
    async function () {


        // ========================================
        // PROFILE ELEMENTS
        // ========================================

        const profileName =
            document.getElementById(
                "profile-name"
            );

        const profileEmail =
            document.getElementById(
                "profile-email"
            );

        const profileXp =
            document.getElementById(
                "profile-xp"
            );

        const profileOverallProgress =
            document.getElementById(
                "profile-overall-progress"
            );

        const profileJavaProgress =
            document.getElementById(
                "profile-java-progress"
            );

        const profileSqlProgress =
            document.getElementById(
                "profile-sql-progress"
            );

        const profileWebProgress =
            document.getElementById(
                "profile-web-progress"
            );

        const javaProgressFill =
            document.getElementById(
                "profile-java-progress-fill"
            );

        const sqlProgressFill =
            document.getElementById(
                "profile-sql-progress-fill"
            );

        const webProgressFill =
            document.getElementById(
                "profile-web-progress-fill"
            );

        const darkModeSetting =
            document.getElementById(
                "dark-mode-setting"
            );

        const clickSoundSetting =
            document.getElementById(
                "click-sound-setting"
            );


        // ========================================
        // USER INFORMATION
        // ========================================

        const username =
            localStorage.getItem(
                "username"
            );


        profileName.textContent =
            username || "Learner";


        /*
         * Login currently stores username + JWT.
         * We do not currently have the user's email
         * stored safely as profile data.
         *
         * We will connect full user/profile details
         * when the profile backend is expanded.
         */

        profileEmail.textContent =
            "Connected SkillQuest account";


        // ========================================
        // LOAD REAL GAME STATS
        // ========================================

profileXp.textContent =
    "Loading...";

profileOverallProgress.textContent =
    "Loading...";

profileJavaProgress.textContent =
    "Loading...";

        const stats =
            await getMyGameStats();


        if (stats) {

            profileXp.textContent =
                stats.xp;

        } else {

            profileXp.textContent =
                "0";

        }


        // ========================================
        // LOAD JAVA PROGRESS
        // ========================================

        let javaProgress = 0;


        try {

            const response =
                await authenticatedFetch(
                    "/progress/courses/1"
                );


            if (response.ok) {

                const progress =
                    await response.json();


                javaProgress =
                    Math.round(
                        progress.progressPercentage ||
                        0
                    );

            }

        } catch (error) {

            console.error(
                "Profile Java progress error:",
                error
            );

        }


        profileJavaProgress.textContent =
            javaProgress + "%";

        javaProgressFill.style.width =
            javaProgress + "%";


        // ========================================
        // SQL + WEB
        // ========================================

        /*
         * Final SQL and Web backend courses
         * have not been migrated yet.
         */

        const sqlProgress = 0;
        const webProgress = 0;


        profileSqlProgress.textContent =
            sqlProgress + "%";

        profileWebProgress.textContent =
            webProgress + "%";


        sqlProgressFill.style.width =
            sqlProgress + "%";

        webProgressFill.style.width =
            webProgress + "%";


        // ========================================
        // OVERALL PROGRESS
        // ========================================

        /*
         * At this stage Java is the only real
         * portfolio course stored in the backend.
         *
         * Do not average Java with two nonexistent
         * backend courses.
         */

        profileOverallProgress.textContent =
            javaProgress + "%";


        // ========================================
        // DARK MODE
        // ========================================

        const savedDarkMode =
            localStorage.getItem(
                "darkMode"
            );


        if (savedDarkMode === null) {

            darkModeSetting.checked =
                true;

            localStorage.setItem(
                "darkMode",
                "true"
            );

        } else {

            darkModeSetting.checked =
                savedDarkMode === "true";

        }


        function applyDarkMode() {

            if (darkModeSetting.checked) {

                document.body.classList.remove(
                    "light-mode"
                );

            } else {

                document.body.classList.add(
                    "light-mode"
                );

            }

        }


        applyDarkMode();


        darkModeSetting.addEventListener(
            "change",
            function () {

                localStorage.setItem(
                    "darkMode",
                    darkModeSetting.checked
                );

                applyDarkMode();

            }
        );


        // ========================================
        // CLICK SOUND
        // ========================================

        const savedClickSound =
            localStorage.getItem(
                "clickSound"
            );


        if (savedClickSound === null) {

            clickSoundSetting.checked =
                false;

            localStorage.setItem(
                "clickSound",
                "false"
            );

        } else {

            clickSoundSetting.checked =
                savedClickSound === "true";

        }


        clickSoundSetting.addEventListener(
            "change",
            function () {

                localStorage.setItem(
                    "clickSound",
                    clickSoundSetting.checked
                );

            }
        );


        function playClickSound() {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;


            const audioContext =
                new AudioContext();


            const oscillator =
                audioContext.createOscillator();


            const gainNode =
                audioContext.createGain();


            oscillator.connect(
                gainNode
            );

            gainNode.connect(
                audioContext.destination
            );


            oscillator.frequency.value =
                500;

            gainNode.gain.value =
                0.05;


            oscillator.start();


            oscillator.stop(
                audioContext.currentTime +
                0.05
            );

        }


        document.addEventListener(
            "click",
            function (event) {

                if (
                    !clickSoundSetting.checked
                ) {
                    return;
                }


                const clickableElement =
                    event.target.closest(
                        "a, button, input, .setting-item"
                    );


                if (clickableElement) {

                    playClickSound();

                }

            }
        );


        // ========================================
        // LOGOUT
        // ========================================

        const logoutLink =
            document.getElementById(
                "logout-link"
            );


        if (logoutLink) {

            logoutLink.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


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

    }
);