// =====================================================
// SKILLQUEST - ACTIVITY PAGE
// =====================================================


// -----------------------------------------------------
// 1. READ ACTIVITY INFORMATION FROM URL
// -----------------------------------------------------

const params =
    new URLSearchParams(
        window.location.search
    );

const currentTopicName =
    params.get("topic");

const currentActivityName =
    params.get("activity");


// -----------------------------------------------------
// 2. PAGE ELEMENTS
// -----------------------------------------------------

const completeButton =
    document.getElementById("complete-activity");

const backToCourseButton =
    document.getElementById("back-to-course");


// -----------------------------------------------------
// 3. OPTIONAL ACTIVITY/TOPIC TITLE DISPLAY
// -----------------------------------------------------

const activityTitle =
    document.getElementById("activity-title");

const topicTitle =
    document.getElementById("topic-title");


if (
    activityTitle &&
    currentActivityName
) {

    activityTitle.textContent =
        currentActivityName;

}


if (
    topicTitle &&
    currentTopicName
) {

    topicTitle.textContent =
        currentTopicName;

}


// =====================================================
// COMPLETION SYSTEM
// =====================================================


// -----------------------------------------------------
// 4. CHECK WHETHER CURRENT ACTIVITY IS COMPLETED
// -----------------------------------------------------

function isCurrentActivityCompleted() {

    if (!currentActivityName) {
        return false;
    }

    return (
        localStorage.getItem(
            "completed-" +
            currentActivityName
        ) === "true"
    );

}


// -----------------------------------------------------
// 5. MARK CURRENT ACTIVITY AS COMPLETED
// -----------------------------------------------------

function markCurrentActivityCompleted() {

    if (!currentActivityName) {
        return;
    }


    localStorage.setItem(
        "completed-" +
        currentActivityName,
        "true"
    );


    updateCompleteButton();

}


// -----------------------------------------------------
// 6. UPDATE COMPLETE BUTTON
// -----------------------------------------------------

function updateCompleteButton() {

    if (!completeButton) {
        return;
    }


    if (
        isCurrentActivityCompleted()
    ) {

        completeButton.disabled = false;

        completeButton.textContent =
            "Activity Completed ✓";

    } else {

        completeButton.disabled = true;

        completeButton.textContent =
            "Complete the Activity First";

    }

}


updateCompleteButton();


// -----------------------------------------------------
// 7. COMPLETE ACTIVITY BUTTON
// -----------------------------------------------------

if (completeButton) {

    completeButton.addEventListener(
        "click",
        () => {

            if (
                !isCurrentActivityCompleted()
            ) {

                alert(
                    "Complete the activity successfully before continuing."
                );

                return;

            }


            window.location.href =
                "java-course.html";

        }
    );

}


// -----------------------------------------------------
// 8. BACK TO COURSE
// -----------------------------------------------------

if (backToCourseButton) {

    backToCourseButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "java-course.html";

        }
    );

}


// =====================================================
// ACTIVITY TYPE SYSTEM
// =====================================================


// -----------------------------------------------------
// 9. MAP ACTIVITIES TO GAME TYPES
// -----------------------------------------------------

const activityTypeMap = {

    "Variables & Data Types":
        "quiz",

    "Operators":
        "quiz",

    "Control Statements":
        "fill",

    "Arrays":
        "matching"

};


// -----------------------------------------------------
// 10. GAME CONTAINERS
// -----------------------------------------------------

const quizContainer =
    document.getElementById(
        "quiz-container"
    );

const fillBlankContainer =
    document.getElementById(
        "fill-blank-container"
    );

const matchingContainer =
    document.getElementById(
        "matching-container"
    );


// -----------------------------------------------------
// 11. SHOW CORRECT GAME
// -----------------------------------------------------

function loadActivityGame() {

    if (quizContainer) {

        quizContainer.classList.add(
            "hidden"
        );

    }


    if (fillBlankContainer) {

        fillBlankContainer.classList.add(
            "hidden"
        );

    }


    if (matchingContainer) {

        matchingContainer.classList.add(
            "hidden"
        );

    }


    const activityType =
        activityTypeMap[
            currentActivityName
        ] || "quiz";


    if (
        activityType === "quiz" &&
        quizContainer
    ) {

        quizContainer.classList.remove(
            "hidden"
        );

    }


    else if (
        activityType === "fill" &&
        fillBlankContainer
    ) {

        fillBlankContainer.classList.remove(
            "hidden"
        );

    }


    else if (
        activityType === "matching" &&
        matchingContainer
    ) {

        matchingContainer.classList.remove(
            "hidden"
        );

    }

}


loadActivityGame();


// =====================================================
// QUIZ GAME
// =====================================================


// -----------------------------------------------------
// 12. QUIZ QUESTIONS
// -----------------------------------------------------

const quizQuestions = [

    {
        question:
            "Which keyword is used to create a class in Java?",

        options: [
            "class",
            "new",
            "object",
            "define"
        ],

        answer:
            "class"
    },

    {
        question:
            "Which symbol is used to end a Java statement?",

        options: [
            ":",
            ";",
            ".",
            ","
        ],

        answer:
            ";"
    },

    {
        question:
            "Which method is the entry point of a Java program?",

        options: [
            "start()",
            "run()",
            "main()",
            "init()"
        ],

        answer:
            "main()"
    }

];


// -----------------------------------------------------
// 13. QUIZ VARIABLES
// -----------------------------------------------------

let currentQuestionIndex = 0;

let score = 0;


const quizQuestion =
    document.getElementById(
        "quiz-question"
    );

const quizOptions =
    document.querySelectorAll(
        ".quiz-option"
    );

const quizFeedback =
    document.getElementById(
        "quiz-feedback"
    );

const nextQuestionButton =
    document.getElementById(
        "next-question-btn"
    );


// -----------------------------------------------------
// 14. LOAD QUIZ QUESTION
// -----------------------------------------------------

function loadQuestion() {

    if (
        !quizQuestion ||
        quizOptions.length === 0
    ) {

        return;

    }


    const currentQuestion =
        quizQuestions[
            currentQuestionIndex
        ];


    quizQuestion.textContent =
        currentQuestion.question;


    quizOptions.forEach(
        (button, index) => {

            button.textContent =
                currentQuestion
                    .options[index];

            button.disabled =
                false;

        }
    );


    if (quizFeedback) {

        quizFeedback.textContent =
            "";

    }


    if (nextQuestionButton) {

        nextQuestionButton
            .classList
            .add("hidden");

    }

}


// -----------------------------------------------------
// 15. QUIZ ANSWER SELECTION
// -----------------------------------------------------

quizOptions.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const selectedAnswer =
                    button.textContent;


                const correctAnswer =
                    quizQuestions[
                        currentQuestionIndex
                    ].answer;


                quizOptions.forEach(
                    option => {

                        option.disabled =
                            true;

                    }
                );


                if (
                    selectedAnswer ===
                    correctAnswer
                ) {

                    score++;


                    if (quizFeedback) {

                        quizFeedback.textContent =
                            "Correct!";

                    }

                } else {

                    if (quizFeedback) {

                        quizFeedback.textContent =
                            `Incorrect. Correct answer: ${correctAnswer}`;

                    }

                }


                if (
                    nextQuestionButton
                ) {

                    nextQuestionButton
                        .classList
                        .remove(
                            "hidden"
                        );

                }

            }
        );

    }
);


// -----------------------------------------------------
// 16. NEXT QUIZ QUESTION
// -----------------------------------------------------

if (nextQuestionButton) {

    nextQuestionButton.addEventListener(
        "click",
        () => {

            currentQuestionIndex++;


            if (
                currentQuestionIndex <
                quizQuestions.length
            ) {

                loadQuestion();

            } else {

                finishQuiz();

            }

        }
    );

}


// -----------------------------------------------------
// 17. FINISH QUIZ
// -----------------------------------------------------

function finishQuiz() {

    const percentage =
        Math.round(
            (
                score /
                quizQuestions.length
            ) * 100
        );


    if (quizQuestion) {

        quizQuestion.textContent =
            "Quiz Completed!";

    }


    const quizOptionsContainer =
        document.getElementById(
            "quiz-options"
        );


    if (quizOptionsContainer) {

        quizOptionsContainer.innerHTML =
            "";

    }


    if (quizFeedback) {

        quizFeedback.textContent =
            `Your score: ${score} / ${quizQuestions.length} (${percentage}%)`;

    }


    if (nextQuestionButton) {

        nextQuestionButton
            .classList
            .add("hidden");

    }


    // IMPORTANT:
    // Quiz only completes at 50% or above.

    if (percentage >= 50) {

        markCurrentActivityCompleted();


        if (quizFeedback) {

            quizFeedback.textContent +=
                " — Activity completed!";

        }

    } else {

        if (quizFeedback) {

            quizFeedback.textContent +=
                " — You need at least 50% to complete this activity.";

        }

    }

}


// Start quiz only when the elements exist.

if (
    quizQuestion &&
    quizOptions.length > 0
) {

    loadQuestion();

}


// =====================================================
// FILL IN THE BLANK GAME
// =====================================================


// -----------------------------------------------------
// 18. FILL-IN-THE-BLANK ELEMENTS
// -----------------------------------------------------

const fillBlankQuestion =
    document.getElementById(
        "fill-blank-question"
    );

const fillBlankAnswer =
    document.getElementById(
        "fill-blank-answer"
    );

const checkFillBlankButton =
    document.getElementById(
        "check-fill-blank-btn"
    );

const fillBlankFeedback =
    document.getElementById(
        "fill-blank-feedback"
    );


// -----------------------------------------------------
// 19. FILL-IN-THE-BLANK DATA
// -----------------------------------------------------

const fillBlankData = {

    question:
        "The keyword used to inherit a class in Java is ______.",

    answer:
        "extends"

};


if (fillBlankQuestion) {

    fillBlankQuestion.textContent =
        fillBlankData.question;

}


// -----------------------------------------------------
// 20. CHECK FILL-IN-THE-BLANK ANSWER
// -----------------------------------------------------

if (checkFillBlankButton) {

    checkFillBlankButton.addEventListener(
        "click",
        () => {

            const userAnswer =
                fillBlankAnswer
                    .value
                    .trim()
                    .toLowerCase();


            const correctAnswer =
                fillBlankData
                    .answer
                    .toLowerCase();


            if (userAnswer === "") {

                fillBlankFeedback.textContent =
                    "Please enter an answer.";

                return;

            }


            if (
                userAnswer ===
                correctAnswer
            ) {

                fillBlankFeedback.textContent =
                    "Correct! Activity completed.";


                markCurrentActivityCompleted();


                fillBlankAnswer.disabled =
                    true;


                checkFillBlankButton.disabled =
                    true;

            } else {

                fillBlankFeedback.textContent =
                    "Incorrect. Try again.";

            }

        }
    );

}


// =====================================================
// MATCHING GAME
// =====================================================


// -----------------------------------------------------
// 21. MATCHING ELEMENTS
// -----------------------------------------------------

const matchTerms =
    document.querySelectorAll(
        ".match-term"
    );

const matchMeanings =
    document.querySelectorAll(
        ".match-meaning"
    );

const matchingFeedback =
    document.getElementById(
        "matching-feedback"
    );


let selectedTerm = null;

let matchedPairs = 0;


// -----------------------------------------------------
// 22. SELECT MATCHING TERM
// -----------------------------------------------------

matchTerms.forEach(
    (term) => {

        term.addEventListener(
            "click",
            () => {

                if (
                    term.classList.contains(
                        "matched"
                    )
                ) {

                    return;

                }


                matchTerms.forEach(
                    item => {

                        item.classList.remove(
                            "selected-match"
                        );

                    }
                );


                selectedTerm =
                    term;


                term.classList.add(
                    "selected-match"
                );


                if (matchingFeedback) {

                    matchingFeedback.textContent =
                        "Now choose the matching meaning.";

                }

            }
        );

    }
);


// -----------------------------------------------------
// 23. CHECK MATCHING PAIR
// -----------------------------------------------------

matchMeanings.forEach(
    (meaning) => {

        meaning.addEventListener(
            "click",
            () => {

                if (
                    meaning.classList.contains(
                        "matched"
                    )
                ) {

                    return;

                }


                if (!selectedTerm) {

                    if (matchingFeedback) {

                        matchingFeedback.textContent =
                            "Select a term first.";

                    }

                    return;

                }


                if (
                    selectedTerm.dataset.id ===
                    meaning.dataset.id
                ) {

                    selectedTerm
                        .classList
                        .add("matched");


                    meaning
                        .classList
                        .add("matched");


                    selectedTerm
                        .classList
                        .remove(
                            "selected-match"
                        );


                    matchedPairs++;


                    if (matchingFeedback) {

                        matchingFeedback.textContent =
                            "Correct match!";

                    }


                    selectedTerm =
                        null;


                    if (
                        matchedPairs ===
                        matchTerms.length
                    ) {

                        if (matchingFeedback) {

                            matchingFeedback.textContent =
                                "Matching activity completed!";

                        }


                        markCurrentActivityCompleted();

                    }

                } else {

                    if (matchingFeedback) {

                        matchingFeedback.textContent =
                            "Incorrect match. Try again.";

                    }

                }

            }
        );

    }
);