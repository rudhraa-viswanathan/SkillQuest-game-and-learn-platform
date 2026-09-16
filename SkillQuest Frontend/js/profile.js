document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // PROFILE ELEMENTS
    // ========================================

    const profileName =
        document.getElementById("profile-name");

    const profileEmail =
        document.getElementById("profile-email");


        const profileXp =
    document.getElementById("profile-xp");

const profileOverallProgress =
    document.getElementById("profile-overall-progress");

const profileJavaProgress =
    document.getElementById("profile-java-progress");

const profileSqlProgress =
    document.getElementById("profile-sql-progress");

const profileWebProgress =
    document.getElementById("profile-web-progress");

const javaProgressFill =
    document.getElementById("profile-java-progress-fill");

const sqlProgressFill =
    document.getElementById("profile-sql-progress-fill");

const webProgressFill =
    document.getElementById("profile-web-progress-fill");

const darkModeSetting =
    document.getElementById("dark-mode-setting");


const clickSoundSetting =
    document.getElementById("click-sound-setting");
    // ========================================
    // LOAD USER INFORMATION
    // ========================================

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {

        profileName.textContent =
            loggedInUser.name || "Learner";

        profileEmail.textContent =
            loggedInUser.email || "No email available";

    }

    // ========================================
// LOAD LEARNING STATISTICS
// ========================================

const xp =
    Number(localStorage.getItem("xp")) || 0;

const javaProgress =
    Number(localStorage.getItem("javaProgress")) || 0;

const sqlProgress =
    Number(localStorage.getItem("sqlProgress")) || 0;

const webProgress =
    Number(localStorage.getItem("webProgress")) || 0;


// Calculate overall progress from all 3 courses

const overallProgress =
    Math.round(
        (javaProgress + sqlProgress + webProgress) / 3
    );


// Display statistics

profileXp.textContent =
    xp;

profileOverallProgress.textContent =
    overallProgress + "%";

profileJavaProgress.textContent =
    javaProgress + "%";

profileSqlProgress.textContent =
    sqlProgress + "%";

profileWebProgress.textContent =
    webProgress + "%";

javaProgressFill.style.width =
    javaProgress + "%";

sqlProgressFill.style.width =
    sqlProgress + "%";

webProgressFill.style.width =
    webProgress + "%";

// ========================================
// DARK MODE
// ========================================

const savedDarkMode =
    localStorage.getItem("darkMode");

if (savedDarkMode === null) {

    darkModeSetting.checked = true;

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
    localStorage.getItem("clickSound");

if (savedClickSound === null) {

    clickSoundSetting.checked = false;

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

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 500;

    gainNode.gain.value = 0.05;

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.05
    );

}


document.addEventListener(
    "click",
    function (event) {

        if (!clickSoundSetting.checked) {
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

});