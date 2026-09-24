// =====================================================
// SKILLQUEST - ACTIVITY PAGE
// CLEAN BACKEND-INTEGRATED VERSION
// =====================================================


// =====================================================
// 1. URL PARAMETERS
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );

const currentCourseName =
    params.get("course") || "Java";

const currentTopicName =
    params.get("topic");

const currentActivityName =
    params.get("activity");

const currentActivityId =
    Number(
        params.get("activityId")
    );


// =====================================================
// 2. BACKEND STATE
// =====================================================

let backendActivity = null;

let backendQuestions = [];

let activityAttemptStarted = false;


// =====================================================
// 3. COMMON PAGE ELEMENTS
// =====================================================

const activityTitle =
    document.getElementById(
        "activity-title"
    );

const topicTitle =
    document.getElementById(
        "activity-topic"
    );

const activityDescription =
    document.getElementById(
        "activity-description"
    );

const completeButton =
    document.getElementById(
        "complete-activity"
    );

const backToCourseButton =
    document.getElementById(
        "back-to-course"
    );


// =====================================================
// 4. DISPLAY URL DATA TEMPORARILY
// =====================================================

if (activityTitle) {

    activityTitle.textContent =
        currentActivityName ||
        currentCourseName +
        " Activity";
}


if (topicTitle) {

    topicTitle.textContent =
        currentTopicName ||
        currentCourseName +
        " Course";
}


// =====================================================
// 5. LOAD ACTIVITY FROM BACKEND
// =====================================================

async function loadActivityFromBackend() {

    if (!currentActivityId) {

        console.error(
            "Activity ID is missing from URL."
        );

        return false;
    }


    try {

        // -----------------------------------------
        // LOAD ACTIVITY
        // -----------------------------------------

        const activityResponse =
            await authenticatedFetch(
                `/activities/${currentActivityId}`
            );


        if (!activityResponse.ok) {

            throw new Error(
                "Unable to load activity."
            );
        }


        backendActivity =
            await activityResponse.json();


        // -----------------------------------------
        // LOAD SAFE PUBLIC QUESTIONS
        // -----------------------------------------

        const questionsResponse =
            await authenticatedFetch(
                `/activity-questions/public/activity/${currentActivityId}`
            );


        if (!questionsResponse.ok) {

            throw new Error(
                "Unable to load activity questions."
            );
        }


        backendQuestions =
            await questionsResponse.json();


        console.log(
            "Backend Activity:",
            backendActivity
        );


        console.log(
            "Questions Loaded:",
            backendQuestions.length
        );


        displayBackendActivity();


        return true;


    } catch (error) {

        console.error(
            "Activity loading error:",
            error
        );


        if (activityTitle) {

            activityTitle.textContent =
                "Unable to load activity";
        }


        return false;
    }
}


// =====================================================
// 6. DISPLAY BACKEND ACTIVITY
// =====================================================

function displayBackendActivity() {

    if (!backendActivity) {
        return;
    }


    if (activityTitle) {

        activityTitle.textContent =
            backendActivity.title;
    }


    if (activityDescription) {

        activityDescription.textContent =
            backendActivity.description ||
            "Complete this activity.";
    }


    console.log(
        "Activity Type:",
        backendActivity.type
    );
}


// =====================================================
// 7. BACK TO COURSE
// =====================================================

function redirectToCurrentCourse() {

    if (
        backendActivity &&
        backendActivity.topicId
    ) {

        const topicId =
            Number(
                backendActivity.topicId
            );


        // Java topics
        if (
            topicId >= 6 &&
            topicId <= 11
        ) {

            window.location.assign(
                "java-course.html"
            );

            return;
        }


        // SQL topics
        if (
            topicId >= 12 &&
            topicId <= 17
        ) {

            window.location.assign(
                "sql-course.html"
            );

            return;
        }


        // Web topics
        if (
            topicId >= 18 &&
            topicId <= 23
        ) {

            window.location.assign(
                "web-course.html"
            );

            return;
        }
    }


    // Fallback using course name

    const course =
        currentCourseName
            .toLowerCase();


    if (
        course.includes("sql")
    ) {

        window.location.assign(
            "sql-course.html"
        );

    } else if (
        course.includes("web")
    ) {

        window.location.assign(
            "web-course.html"
        );

    } else {

        window.location.assign(
            "java-course.html"
        );
    }
}


if (backToCourseButton) {

    backToCourseButton.addEventListener(
        "click",
        redirectToCurrentCourse
    );
}


// =====================================================
// 8. CHECK ACTIVITY ACCESS
// =====================================================

async function checkCurrentActivityAccess() {

    if (
        !backendActivity ||
        !backendActivity.topicId
    ) {

        console.error(
            "Activity topic ID is missing."
        );

        return false;
    }


    try {

        const topicId =
            Number(
                backendActivity.topicId
            );


        const response =
            await authenticatedFetch(
                `/progress/topics/${topicId}/activities`
            );


        if (!response.ok) {

            console.error(
                "Unable to check activity progress."
            );

            return false;
        }


        const statuses =
            await response.json();


        const currentStatus =
            statuses.find(
                activity =>
                    Number(
                        activity.activityId
                    ) ===
                    currentActivityId
            );


        if (!currentStatus) {

            console.error(
                "Activity status not found."
            );

            return false;
        }


        // -----------------------------------------
        // ALREADY COMPLETED
        // -----------------------------------------

        if (currentStatus.completed) {

            alert(
                "You have already completed this activity."
            );


            redirectToCurrentCourse();


            return false;
        }


        // -----------------------------------------
        // LOCKED
        // -----------------------------------------

        if (!currentStatus.unlocked) {

            alert(
                "Complete the previous activity first."
            );


            redirectToCurrentCourse();


            return false;
        }


        return true;


    } catch (error) {

        console.error(
            "Activity access check error:",
            error
        );


        return false;
    }
}


// =====================================================
// 9. START ACTIVITY ATTEMPT
// =====================================================

async function startActivityAttempt() {

    if (!currentActivityId) {

        console.error(
            "Activity ID is missing."
        );

        return false;
    }


    if (activityAttemptStarted) {

        return true;
    }


    try {

        const response =
            await authenticatedFetch(
                "/game-stats/attempt",
                {
                    method: "POST"
                }
            );


        if (!response.ok) {

            const errorMessage =
                await getApiErrorMessage(
                    response,
                    "Unable to start activity."
                );


            alert(
                errorMessage
            );


            return false;
        }


        const gameStats =
            await response.json();


        activityAttemptStarted =
            true;


        console.log(
            "Activity attempt started."
        );


        console.log(
            "Remaining energy:",
            gameStats.energy
        );


        return true;


    } catch (error) {

        console.error(
            "Attempt start error:",
            error
        );


        return false;
    }
}


// =====================================================
// 10. VALIDATE ANSWER THROUGH BACKEND
// =====================================================

async function validateQuestionAnswer(
    questionId,
    answer
) {

    try {

        const response =
            await authenticatedFetch(
                "/activity-questions/validate",
                {
                    method: "POST",

                    body:
                        JSON.stringify({
                            questionId:
                                questionId,

                            answer:
                                answer
                        })
                }
            );


        if (!response.ok) {

            const errorMessage =
                await getApiErrorMessage(
                    response,
                    "Unable to validate answer."
                );


            console.error(
                errorMessage
            );


            return null;
        }


        return await response.json();


    } catch (error) {

        console.error(
            "Answer validation error:",
            error
        );


        return null;
    }
}


// =====================================================
// 11. MARK ACTIVITY COMPLETED
// =====================================================

async function markCurrentActivityCompleted() {

    if (!currentActivityId) {

        console.error(
            "Activity ID is missing."
        );

        return false;
    }


    try {

        const response =
            await authenticatedFetch(
                `/progress/activities/${currentActivityId}/complete`,
                {
                    method: "POST"
                }
            );


        if (!response.ok) {

            const errorMessage =
                await getApiErrorMessage(
                    response,
                    "Unable to save activity completion."
                );


            if (
                !errorMessage
                    .toLowerCase()
                    .includes(
                        "already"
                    )
            ) {

                console.error(
                    errorMessage
                );


                return false;
            }
        }


        if (completeButton) {

            completeButton.disabled =
                true;


            completeButton.textContent =
                "Completed ✓";


            completeButton.classList.add(
                "activity-completed-btn"
            );
        }


        return true;


    } catch (error) {

        console.error(
            "Activity completion error:",
            error
        );


        return false;
    }
}


// =====================================================
// 12. SUBMIT FINAL ACTIVITY RESULT
// =====================================================

async function submitActivityResult(
    scorePercentage
) {

    if (!currentActivityId) {

        console.error(
            "Activity ID is missing."
        );


        return null;
    }


    try {

        const response =
            await authenticatedFetch(
                "/game-stats/result",
                {
                    method: "POST",

                    body:
                        JSON.stringify({
                            activityId:
                                currentActivityId,

                            scorePercentage:
                                scorePercentage
                        })
                }
            );


        if (!response.ok) {

            const errorMessage =
                await getApiErrorMessage(
                    response,
                    "Unable to submit activity result."
                );


            alert(
                errorMessage
            );


            return null;
        }


        const result =
            await response.json();


        console.log(
            "Activity result:",
            result
        );


        if (
            scorePercentage >= 60
        ) {

            await markCurrentActivityCompleted();
        }


        return result;


    } catch (error) {

        console.error(
            "Result submission error:",
            error
        );


        return null;
    }
}


// =====================================================
// 13. QUIZ ENGINE
// =====================================================

const quizContainer =
    document.getElementById(
        "quiz-container"
    );

const quizQuestion =
    document.getElementById(
        "quiz-question"
    );

const quizOptions =
    document.getElementById(
        "quiz-options"
    );

const quizFeedback =
    document.getElementById(
        "quiz-feedback"
    );

const nextQuestionButton =
    document.getElementById(
        "next-question-btn"
    );


let quizQuestions = [];

let currentQuizIndex = 0;

let quizScore = 0;

let quizAnswered = false;


// =====================================================
// LOAD QUIZ QUESTION
// =====================================================

function loadQuizQuestion() {

    if (
        quizQuestions.length === 0
    ) {

        quizQuestions =
            backendQuestions.map(
                q => ({
                    id:
                        q.id,

                    question:
                        q.question,

                    options:
                        q.options
                            ? q.options.split(
                                "|"
                            )
                            : []
                })
            );
    }


    if (
        quizQuestions.length === 0 ||
        !quizQuestion ||
        !quizOptions
    ) {

        return;
    }


    const question =
        quizQuestions[
            currentQuizIndex
        ];


    quizQuestion.textContent =
        question.question;


    quizOptions.innerHTML =
        "";


    if (quizFeedback) {

        quizFeedback.textContent =
            "";
    }


    quizAnswered =
        false;


    if (nextQuestionButton) {

        nextQuestionButton.style.display =
            "none";
    }


    question.options.forEach(
        option => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                option;


            button.classList.add(
                "quiz-option"
            );


            button.addEventListener(
                "click",
                () => {

                    checkQuizAnswer(
                        option
                    );
                }
            );


            quizOptions.appendChild(
                button
            );
        }
    );
}


// =====================================================
// CHECK QUIZ ANSWER
// =====================================================

async function checkQuizAnswer(
    selectedOption
) {

    if (quizAnswered) {

        return;
    }


    const question =
        quizQuestions[
            currentQuizIndex
        ];


    quizAnswered =
        true;


    const buttons =
        quizOptions.querySelectorAll(
            "button"
        );


    buttons.forEach(
        button => {

            button.disabled =
                true;
        }
    );


    const result =
        await validateQuestionAnswer(
            question.id,
            selectedOption
        );


    if (!result) {

        quizAnswered =
            false;


        buttons.forEach(
            button => {

                button.disabled =
                    false;
            }
        );


        if (quizFeedback) {

            quizFeedback.textContent =
                "Unable to check answer.";
        }


        return;
    }


    if (result.correct) {

        quizScore++;


        quizFeedback.textContent =
            "Correct!";

    } else {

        quizFeedback.textContent =
            "Incorrect.";
    }


    if (nextQuestionButton) {

        nextQuestionButton.style.display =
            "inline-block";


        nextQuestionButton.textContent =
            currentQuizIndex ===
            quizQuestions.length - 1

                ? "View Result"

                : "Next Question";
    }
}


// =====================================================
// NEXT QUIZ QUESTION
// =====================================================

if (nextQuestionButton) {

    nextQuestionButton.addEventListener(
        "click",
        async () => {

            currentQuizIndex++;


            if (
                currentQuizIndex <
                quizQuestions.length
            ) {

                loadQuizQuestion();

            } else {

                await finishQuiz();
            }
        }
    );
}


// =====================================================
// FINISH QUIZ
// =====================================================

async function finishQuiz() {

    if (
        quizQuestions.length === 0
    ) {

        return;
    }


    const percentage =
        Math.round(
            (
                quizScore /
                quizQuestions.length
            ) * 100
        );


    quizQuestion.textContent =
        "Quiz Completed!";


    quizOptions.innerHTML =
        "";


    if (nextQuestionButton) {

        nextQuestionButton.style.display =
            "none";
    }


    quizFeedback.textContent =
        `Your score: ${quizScore} / ${quizQuestions.length} (${percentage}%)`;


    const result =
        await submitActivityResult(
            percentage
        );


    if (!result) {

        quizFeedback.textContent +=
            " — Result could not be saved.";

        return;
    }


    if (percentage >= 60) {

        quizFeedback.textContent +=
            " — Activity completed!";

    } else if (
        percentage >= 51
    ) {

        quizFeedback.textContent +=
            " — Not passed. Half reward earned.";

    } else {

        quizFeedback.textContent +=
            " — Not passed. Try again.";
    }
}


// =====================================================
// 14. FILL IN THE BLANK ENGINE
// =====================================================

const fillBlankContainer =
    document.getElementById(
        "fill-blank-container"
    );

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


let fillBlankQuestions = [];

let currentFillIndex = 0;

let fillBlankScore = 0;


// =====================================================
// LOAD FILL QUESTION
// =====================================================

function loadFillBlankQuestion() {

    if (
        fillBlankQuestions.length === 0
    ) {

        fillBlankQuestions =
            backendQuestions.map(
                q => ({
                    id:
                        q.id,

                    question:
                        q.question
                })
            );
    }


    if (
        fillBlankQuestions.length === 0 ||
        !fillBlankQuestion ||
        !fillBlankAnswer ||
        !checkFillBlankButton
    ) {

        return;
    }


    const question =
        fillBlankQuestions[
            currentFillIndex
        ];


    fillBlankQuestion.textContent =
        question.question;


    fillBlankAnswer.value =
        "";


    fillBlankAnswer.disabled =
        false;


    fillBlankAnswer.style.display =
        "block";


    checkFillBlankButton.disabled =
        false;


    checkFillBlankButton.style.display =
        "inline-block";


    checkFillBlankButton.textContent =
        "Check Answer";


    checkFillBlankButton.dataset.mode =
        "check";


    if (fillBlankFeedback) {

        fillBlankFeedback.textContent =
            "";
    }
}


// =====================================================
// CHECK / NEXT FILL QUESTION
// =====================================================

if (checkFillBlankButton) {

    checkFillBlankButton.addEventListener(
        "click",
        async () => {

            // -------------------------------------
            // NEXT QUESTION
            // -------------------------------------

            if (
                checkFillBlankButton
                    .dataset.mode ===
                "next"
            ) {

                currentFillIndex++;


                if (
                    currentFillIndex <
                    fillBlankQuestions.length
                ) {

                    loadFillBlankQuestion();

                } else {

                    await finishFillBlank();
                }


                return;
            }


            // -------------------------------------
            // CHECK ANSWER
            // -------------------------------------

            const userAnswer =
                fillBlankAnswer
                    .value
                    .trim();


            if (
                userAnswer === ""
            ) {

                fillBlankFeedback.textContent =
                    "Please enter an answer.";


                return;
            }


            const question =
                fillBlankQuestions[
                    currentFillIndex
                ];


            const result =
                await validateQuestionAnswer(
                    question.id,
                    userAnswer
                );


            if (!result) {

                fillBlankFeedback.textContent =
                    "Unable to check answer.";


                return;
            }


            if (result.correct) {

                fillBlankScore++;


                fillBlankFeedback.textContent =
                    "Correct!";

            } else {

                fillBlankFeedback.textContent =
                    "Incorrect. Try again.";
            }


            fillBlankAnswer.disabled =
                true;


            checkFillBlankButton.textContent =
                "Next Question";


            checkFillBlankButton.dataset.mode =
                "next";
        }
    );
}


// =====================================================
// FINISH FILL IN THE BLANK
// =====================================================

async function finishFillBlank() {

    if (
        fillBlankQuestions.length === 0
    ) {

        return;
    }


    const percentage =
        Math.round(
            (
                fillBlankScore /
                fillBlankQuestions.length
            ) * 100
        );


    fillBlankQuestion.textContent =
        "Fill in the Blank Completed!";


    fillBlankAnswer.style.display =
        "none";


    checkFillBlankButton.style.display =
        "none";


    fillBlankFeedback.textContent =
        `Your score: ${fillBlankScore} / ${fillBlankQuestions.length} (${percentage}%)`;


    const result =
        await submitActivityResult(
            percentage
        );


    if (!result) {

        fillBlankFeedback.textContent +=
            " — Result could not be saved.";


        return;
    }


    if (
        percentage >= 60
    ) {

        fillBlankFeedback.textContent +=
            " — Activity completed!";

    } else if (
        percentage >= 51
    ) {

        fillBlankFeedback.textContent +=
            " — Not passed. Half reward earned.";

    } else {

        fillBlankFeedback.textContent +=
            " — Not passed. Try again.";
    }
}


// =====================================================
// END OF PART 1
// =====================================================

// =====================================================
// PART 2
// TRUE/FALSE + CODE OUTPUT + DEBUGGING
// =====================================================


// =====================================================
// 15. TRUE / FALSE ENGINE
// =====================================================

const trueFalseContainer =
    document.getElementById(
        "true-false-container"
    );

const trueFalseQuestion =
    document.getElementById(
        "true-false-question"
    );

const trueButton =
    document.getElementById(
        "true-btn"
    );

const falseButton =
    document.getElementById(
        "false-btn"
    );

const trueFalseFeedback =
    document.getElementById(
        "true-false-feedback"
    );

const nextTrueFalseButton =
    document.getElementById(
        "next-true-false-btn"
    );


let trueFalseQuestions = [];

let currentTrueFalseIndex = 0;

let trueFalseScore = 0;

let trueFalseAnswered = false;


// =====================================================
// LOAD TRUE / FALSE QUESTION
// =====================================================

function loadTrueFalseQuestion() {

    if (
        trueFalseQuestions.length === 0
    ) {

        trueFalseQuestions =
            backendQuestions.map(
                q => ({
                    id:
                        q.id,

                    question:
                        q.question
                })
            );
    }


    if (
        trueFalseQuestions.length === 0 ||
        !trueFalseQuestion ||
        !trueButton ||
        !falseButton
    ) {

        return;
    }


    const question =
        trueFalseQuestions[
            currentTrueFalseIndex
        ];


    trueFalseQuestion.textContent =
        question.question;


    trueFalseAnswered =
        false;


    trueButton.disabled =
        false;


    falseButton.disabled =
        false;


    if (trueFalseFeedback) {

        trueFalseFeedback.textContent =
            "";
    }


    if (nextTrueFalseButton) {

        nextTrueFalseButton.style.display =
            "none";
    }
}


// =====================================================
// CHECK TRUE / FALSE ANSWER
// =====================================================

async function checkTrueFalseAnswer(
    selectedAnswer
) {

    if (trueFalseAnswered) {

        return;
    }


    const question =
        trueFalseQuestions[
            currentTrueFalseIndex
        ];


    trueFalseAnswered =
        true;


    trueButton.disabled =
        true;


    falseButton.disabled =
        true;


    const result =
        await validateQuestionAnswer(
            question.id,
            String(
                selectedAnswer
            )
        );


    if (!result) {

        trueFalseAnswered =
            false;


        trueButton.disabled =
            false;


        falseButton.disabled =
            false;


        if (trueFalseFeedback) {

            trueFalseFeedback.textContent =
                "Unable to check answer.";
        }


        return;
    }


    if (result.correct) {

        trueFalseScore++;


        trueFalseFeedback.textContent =
            "Correct!";

    } else {

        trueFalseFeedback.textContent =
            "Incorrect.";
    }


    if (nextTrueFalseButton) {

        nextTrueFalseButton.style.display =
            "inline-block";


        nextTrueFalseButton.textContent =
            currentTrueFalseIndex ===
            trueFalseQuestions.length - 1

                ? "View Result"

                : "Next Question";
    }
}


// =====================================================
// TRUE BUTTON
// =====================================================

if (trueButton) {

    trueButton.addEventListener(
        "click",
        () => {

            checkTrueFalseAnswer(
                true
            );
        }
    );
}


// =====================================================
// FALSE BUTTON
// =====================================================

if (falseButton) {

    falseButton.addEventListener(
        "click",
        () => {

            checkTrueFalseAnswer(
                false
            );
        }
    );
}


// =====================================================
// NEXT TRUE / FALSE QUESTION
// =====================================================

if (nextTrueFalseButton) {

    nextTrueFalseButton.addEventListener(
        "click",
        async () => {

            currentTrueFalseIndex++;


            if (
                currentTrueFalseIndex <
                trueFalseQuestions.length
            ) {

                loadTrueFalseQuestion();

            } else {

                await finishTrueFalse();
            }
        }
    );
}


// =====================================================
// FINISH TRUE / FALSE
// =====================================================

async function finishTrueFalse() {

    if (
        trueFalseQuestions.length === 0
    ) {

        return;
    }


    const percentage =
        Math.round(
            (
                trueFalseScore /
                trueFalseQuestions.length
            ) * 100
        );


    trueFalseQuestion.textContent =
        "True / False Completed!";


    trueButton.style.display =
        "none";


    falseButton.style.display =
        "none";


    if (nextTrueFalseButton) {

        nextTrueFalseButton.style.display =
            "none";
    }


    trueFalseFeedback.textContent =
        `Your score: ${trueFalseScore} / ${trueFalseQuestions.length} (${percentage}%)`;


    const result =
        await submitActivityResult(
            percentage
        );


    if (!result) {

        trueFalseFeedback.textContent +=
            " — Result could not be saved.";


        return;
    }


    if (
        percentage >= 60
    ) {

        trueFalseFeedback.textContent +=
            " — Activity completed!";

    } else if (
        percentage >= 51
    ) {

        trueFalseFeedback.textContent +=
            " — Not passed. Half reward earned.";

    } else {

        trueFalseFeedback.textContent +=
            " — Not passed. Try again.";
    }
}


// =====================================================
// 16. CODE OUTPUT ENGINE
// =====================================================

const codeOutputContainer =
    document.getElementById(
        "code-output-container"
    );

const codeOutputQuestion =
    null;

const codeOutputSnippet =
    document.getElementById(
        "code-output-code"
    );

const codeOutputOptions =
    document.getElementById(
        "code-output-options"
    );

const codeOutputFeedback =
    document.getElementById(
        "code-output-feedback"
    );

const nextCodeOutputButton =
    document.getElementById(
        "next-code-output-btn"
    );


let codeOutputQuestions = [];

let currentCodeOutputIndex = 0;

let codeOutputScore = 0;

let codeOutputAnswered = false;


// =====================================================
// LOAD CODE OUTPUT QUESTION
// =====================================================

function loadCodeOutputQuestion() {

    if (
        codeOutputQuestions.length === 0
    ) {

        codeOutputQuestions =
            backendQuestions.map(
                q => ({
                    id:
                        q.id,

                    question:
                        q.question,

                    code:
                        q.codeSnippet ||
                        "",

                    options:
                        q.options
                            ? q.options.split(
                                "|"
                            )
                            : []
                })
            );
    }


   if (
    codeOutputQuestions.length === 0 ||
    !codeOutputOptions
) {

    return;
}


    const question =
        codeOutputQuestions[
            currentCodeOutputIndex
        ];



    if (codeOutputSnippet) {

        codeOutputSnippet.textContent =
            question.code;
    }


    codeOutputOptions.innerHTML =
        "";


    codeOutputAnswered =
        false;


    if (codeOutputFeedback) {

        codeOutputFeedback.textContent =
            "";
    }


    if (nextCodeOutputButton) {

        nextCodeOutputButton.style.display =
            "none";
    }


    question.options.forEach(
        option => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                option;


            button.classList.add(
                "code-output-option"
            );


            button.addEventListener(
                "click",
                () => {

                    checkCodeOutputAnswer(
                        option
                    );
                }
            );


            codeOutputOptions.appendChild(
                button
            );
        }
    );
}


// =====================================================
// CHECK CODE OUTPUT ANSWER
// =====================================================

async function checkCodeOutputAnswer(
    selectedOption
) {

    if (codeOutputAnswered) {

        return;
    }


    const question =
        codeOutputQuestions[
            currentCodeOutputIndex
        ];


    codeOutputAnswered =
        true;


    const buttons =
        codeOutputOptions
            .querySelectorAll(
                "button"
            );


    buttons.forEach(
        button => {

            button.disabled =
                true;
        }
    );


    const result =
        await validateQuestionAnswer(
            question.id,
            selectedOption
        );


    if (!result) {

        codeOutputAnswered =
            false;


        buttons.forEach(
            button => {

                button.disabled =
                    false;
            }
        );


        codeOutputFeedback.textContent =
            "Unable to check answer.";


        return;
    }


    if (result.correct) {

        codeOutputScore++;


        codeOutputFeedback.textContent =
            "Correct!";

    } else {

        codeOutputFeedback.textContent =
            "Incorrect.";
    }


    if (nextCodeOutputButton) {

        nextCodeOutputButton.style.display =
            "inline-block";


        nextCodeOutputButton.textContent =
            currentCodeOutputIndex ===
            codeOutputQuestions.length - 1

                ? "View Result"

                : "Next Question";
    }
}


// =====================================================
// NEXT CODE OUTPUT QUESTION
// =====================================================

if (nextCodeOutputButton) {

    nextCodeOutputButton.addEventListener(
        "click",
        async () => {

            currentCodeOutputIndex++;


            if (
                currentCodeOutputIndex <
                codeOutputQuestions.length
            ) {

                loadCodeOutputQuestion();

            } else {

                await finishCodeOutput();
            }
        }
    );
}


// =====================================================
// FINISH CODE OUTPUT
// =====================================================

async function finishCodeOutput() {

    if (
        codeOutputQuestions.length === 0
    ) {

        return;
    }


    const percentage =
        Math.round(
            (
                codeOutputScore /
                codeOutputQuestions.length
            ) * 100
        );


    if (codeOutputSnippet) {

        codeOutputSnippet.textContent =
            "";
    }


    codeOutputOptions.innerHTML =
        "";


    if (nextCodeOutputButton) {

        nextCodeOutputButton.style.display =
            "none";
    }


    codeOutputFeedback.textContent =
        `Your score: ${codeOutputScore} / ${codeOutputQuestions.length} (${percentage}%)`;


    const result =
        await submitActivityResult(
            percentage
        );


    if (!result) {

        codeOutputFeedback.textContent +=
            " — Result could not be saved.";


        return;
    }


    if (
        percentage >= 60
    ) {

        codeOutputFeedback.textContent +=
            " — Activity completed!";

    } else if (
        percentage >= 51
    ) {

        codeOutputFeedback.textContent +=
            " — Not passed. Half reward earned.";

    } else {

        codeOutputFeedback.textContent +=
            " — Not passed. Try again.";
    }
}


// =====================================================
// 17. DEBUGGING ENGINE
// =====================================================

const debuggingContainer =
    document.getElementById(
        "debugging-container"
    );

const debuggingQuestion =
    document.getElementById(
        "debugging-question"
    );

const debuggingCode =
    document.getElementById(
        "debugging-code"
    );

const debuggingAnswer =
    document.getElementById(
        "debugging-answer"
    );

const checkDebuggingButton =
    document.getElementById(
        "check-debugging-btn"
    );

const debuggingFeedback =
    document.getElementById(
        "debugging-feedback"
    );

const nextDebuggingButton =
    document.getElementById(
        "next-debugging-btn"
    );


let debuggingQuestions = [];

let currentDebuggingIndex = 0;

let debuggingScore = 0;

let debuggingAnswered = false;


// =====================================================
// LOAD DEBUGGING QUESTION
// =====================================================

function loadDebuggingQuestion() {

    if (
        debuggingQuestions.length === 0
    ) {

        debuggingQuestions =
            backendQuestions.map(
                q => ({
                    id:
                        q.id,

                    question:
                        q.question,

                    code:
                        q.codeSnippet ||
                        ""
                })
            );
    }


    if (
        debuggingQuestions.length === 0 ||
        !debuggingQuestion ||
        !debuggingAnswer ||
        !checkDebuggingButton
    ) {

        return;
    }


    const question =
        debuggingQuestions[
            currentDebuggingIndex
        ];


    debuggingQuestion.textContent =
        question.question;


    if (debuggingCode) {

        debuggingCode.textContent =
            question.code;
    }


    debuggingAnswer.value =
        "";


    debuggingAnswer.disabled =
        false;


    debuggingAnswer.style.display =
        "block";


    checkDebuggingButton.disabled =
        false;


    checkDebuggingButton.style.display =
        "inline-block";


    checkDebuggingButton.textContent =
        "Check Answer";


    debuggingAnswered =
        false;


    if (debuggingFeedback) {

        debuggingFeedback.textContent =
            "";
    }


    if (nextDebuggingButton) {

        nextDebuggingButton.style.display =
            "none";
    }
}


// =====================================================
// CHECK DEBUGGING ANSWER
// =====================================================

if (checkDebuggingButton) {

    checkDebuggingButton.addEventListener(
        "click",
        async () => {

            if (debuggingAnswered) {

                return;
            }


            const userAnswer =
                debuggingAnswer
                    .value
                    .trim();


            if (
                userAnswer === ""
            ) {

                debuggingFeedback.textContent =
                    "Enter the corrected code first.";


                return;
            }


            const question =
                debuggingQuestions[
                    currentDebuggingIndex
                ];


            const result =
                await validateQuestionAnswer(
                    question.id,
                    userAnswer
                );


            if (!result) {

                debuggingFeedback.textContent =
                    "Unable to check answer.";


                return;
            }


            debuggingAnswered =
                true;


            debuggingAnswer.disabled =
                true;


            checkDebuggingButton.disabled =
                true;


            if (result.correct) {

                debuggingScore++;


                debuggingFeedback.textContent =
                    "Correct! Bug fixed.";

            } else {

                debuggingFeedback.textContent =
                    "Incorrect correction.";
            }


            if (nextDebuggingButton) {

                nextDebuggingButton.style.display =
                    "inline-block";


                nextDebuggingButton.textContent =
                    currentDebuggingIndex ===
                    debuggingQuestions.length - 1

                        ? "View Result"

                        : "Next Challenge";
            }
        }
    );
}


// =====================================================
// NEXT DEBUGGING QUESTION
// =====================================================

if (nextDebuggingButton) {

    nextDebuggingButton.addEventListener(
        "click",
        async () => {

            currentDebuggingIndex++;


            if (
                currentDebuggingIndex <
                debuggingQuestions.length
            ) {

                loadDebuggingQuestion();

            } else {

                await finishDebugging();
            }
        }
    );
}


// =====================================================
// FINISH DEBUGGING
// =====================================================

async function finishDebugging() {

    if (
        debuggingQuestions.length === 0
    ) {

        return;
    }


    const percentage =
        Math.round(
            (
                debuggingScore /
                debuggingQuestions.length
            ) * 100
        );


    debuggingQuestion.textContent =
        "Debugging Completed!";


    if (debuggingCode) {

        debuggingCode.textContent =
            "";
    }


    debuggingAnswer.style.display =
        "none";


    checkDebuggingButton.style.display =
        "none";


    if (nextDebuggingButton) {

        nextDebuggingButton.style.display =
            "none";
    }


    debuggingFeedback.textContent =
        `Your score: ${debuggingScore} / ${debuggingQuestions.length} (${percentage}%)`;


    const result =
        await submitActivityResult(
            percentage
        );


    if (!result) {

        debuggingFeedback.textContent +=
            " — Result could not be saved.";


        return;
    }


    if (
        percentage >= 60
    ) {

        debuggingFeedback.textContent +=
            " — Activity completed!";

    } else if (
        percentage >= 51
    ) {

        debuggingFeedback.textContent +=
            " — Not passed. Half reward earned.";

    } else {

        debuggingFeedback.textContent +=
            " — Not passed. Try again.";
    }
}


// =====================================================
// END OF PART 2
// =====================================================

// =====================================================
// PART 3
// MATCHING + CODE ORDERING
// =====================================================


// =====================================================
// 18. MATCHING ENGINE
// =====================================================

const matchingContainer =
    document.getElementById(
        "matching-container"
    );

const matchingLeft =
    document.getElementById(
        "matching-left"
    );

const matchingRight =
    document.getElementById(
        "matching-right"
    );

const matchingFeedback =
    document.getElementById(
        "matching-feedback"
    );


let matchingPairs = [];

let selectedLeft = null;

let selectedRight = null;

let matchedCount = 0;


// =====================================================
// LOAD MATCHING GAME
// =====================================================

function loadMatchingGame() {

    matchingPairs = [];

    selectedLeft = null;

    selectedRight = null;

    matchedCount = 0;


    const q = backendQuestions[0];

if (!q || !q.answerData) {

    if (matchingFeedback) {
        matchingFeedback.textContent =
            "Matching data is unavailable.";
    }

    return;
}

const sections =
    q.answerData.split("###");

if (sections.length !== 2) {
    return;
}

const leftItems =
    sections[0]
        .split("|")
        .map(item => item.trim())
        .filter(item => item !== "");

const rightItems =
    sections[1]
        .split("|")
        .map(item => item.trim())
        .filter(item => item !== "");

leftItems.forEach((left, index) => {

    matchingPairs.push({
        questionId:
            backendQuestions[index]?.id,
        value: left,
        side: "left"
    });

});

rightItems.forEach(right => {

    matchingPairs.push({
        value: right,
        side: "right"
    });

});


    const matchingLeftItems =
    matchingPairs.filter(
        item =>
            item.side === "left"
    );

const matchingRightItems =
    matchingPairs.filter(
        item =>
            item.side === "right"
    );


    if (
    matchingLeftItems.length === 0 ||
    matchingRightItems.length === 0 ||
    !matchingLeft ||
    !matchingRight
) {

        if (matchingFeedback) {

            matchingFeedback.textContent =
                "Matching data is unavailable.";
        }


        return;
    }


    matchingLeft.innerHTML =
        "";


    matchingRight.innerHTML =
        "";


    if (matchingFeedback) {

        matchingFeedback.textContent =
            "Select one item from each side.";
    }


    // =================================================
    // LEFT ITEMS
    // =================================================

    matchingLeftItems.forEach(
        item => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                item.value;


            button.dataset.value =
                item.value;


            button.dataset.questionId =
                String(
                    item.questionId
                );


            button.classList.add(
                "matching-item"
            );


            button.addEventListener(
                "click",
                () => {

                    if (
                        button.disabled
                    ) {

                        return;
                    }


                    if (
                        selectedLeft
                    ) {

                        selectedLeft
                            .classList
                            .remove(
                                "selected"
                            );
                    }


                    selectedLeft =
                        button;


                    button.classList.add(
                        "selected"
                    );


                    checkMatchingPair();
                }
            );


            matchingLeft.appendChild(
                button
            );
        }
    );


    // =================================================
    // RIGHT ITEMS
    // =================================================

    matchingRightItems.forEach(
        item => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                item.value;


            button.dataset.value =
                item.value;


            button.classList.add(
                "matching-item"
            );


            button.addEventListener(
                "click",
                () => {

                    if (
                        button.disabled
                    ) {

                        return;
                    }


                    if (
                        selectedRight
                    ) {

                        selectedRight
                            .classList
                            .remove(
                                "selected"
                            );
                    }


                    selectedRight =
                        button;


                    button.classList.add(
                        "selected"
                    );


                    checkMatchingPair();
                }
            );


            matchingRight.appendChild(
                button
            );
        }
    );
}


// =====================================================
// CHECK MATCHING PAIR
// =====================================================

async function checkMatchingPair() {

    if (
        !selectedLeft ||
        !selectedRight
    ) {

        return;
    }


    const leftButton =
        selectedLeft;


    const rightButton =
        selectedRight;


    selectedLeft =
        null;


    selectedRight =
        null;


    const questionId =
        Number(
            leftButton.dataset.questionId
        );


    const submittedPair =
        leftButton.dataset.value +
        "=" +
        rightButton.dataset.value;


    const result =
        await validateQuestionAnswer(
            questionId,
            submittedPair
        );


    if (!result) {

        if (matchingFeedback) {

            matchingFeedback.textContent =
                "Unable to check match.";
        }


        leftButton.classList.remove(
            "selected"
        );


        rightButton.classList.remove(
            "selected"
        );


        return;
    }


    if (result.correct) {

        leftButton.disabled =
            true;


        rightButton.disabled =
            true;


        leftButton.classList.remove(
            "selected"
        );


        rightButton.classList.remove(
            "selected"
        );


        leftButton.classList.add(
            "matched"
        );


        rightButton.classList.add(
            "matched"
        );


        matchedCount++;


        if (matchingFeedback) {

            matchingFeedback.textContent =
                "Correct match!";
        }


        const totalPairs =
            matchingPairs.filter(
                item =>
                    item.side ===
                    "left"
            ).length;


        if (
            matchedCount ===
            totalPairs
        ) {

            await finishMatching(
                totalPairs
            );
        }


    } else {

        if (matchingFeedback) {

            matchingFeedback.textContent =
                "Not a match. Try again.";
        }


        leftButton.classList.remove(
            "selected"
        );


        rightButton.classList.remove(
            "selected"
        );
    }
}


// =====================================================
// FINISH MATCHING
// =====================================================

async function finishMatching(
    totalPairs
) {

    if (
        !totalPairs ||
        totalPairs <= 0
    ) {

        return;
    }


    // Matching requires every pair to
    // be matched correctly before finishing.
    // Therefore final score = 100%.

    const percentage =
        100;


    if (matchingFeedback) {

        matchingFeedback.textContent =
            `All ${totalPairs} pairs matched! Score: 100%`;
    }


    const result =
        await submitActivityResult(
            percentage
        );


    if (!result) {

        if (matchingFeedback) {

            matchingFeedback.textContent +=
                " — Result could not be saved.";
        }


        return;
    }


    if (matchingFeedback) {

        matchingFeedback.textContent +=
            " — Activity completed!";
    }
}


// =====================================================
// 19. CODE ORDERING ENGINE
// =====================================================

const codeOrderingContainer =
    document.getElementById(
        "code-ordering-container"
    );

const codeOrderingQuestion =
    document.getElementById(
        "code-ordering-question"
    );

const codeOrderingAvailable =
    document.getElementById(
        "code-ordering-available"
    );

const codeOrderingSelected =
    document.getElementById(
        "code-ordering-selected"
    );

const checkCodeOrderButton =
    document.getElementById(
        "check-code-order-btn"
    );

const resetCodeOrderButton =
    document.getElementById(
        "reset-code-order-btn"
    );

const codeOrderingFeedback =
    document.getElementById(
        "code-ordering-feedback"
    );

const nextCodeOrderButton =
    document.getElementById(
        "next-code-order-btn"
    );


let codeOrderingQuestions = [];

let currentCodeOrderingIndex = 0;

let codeOrderingScore = 0;

let codeOrderingAnswered = false;

let selectedOrderingLines = [];


// =====================================================
// SHUFFLE ARRAY
// =====================================================

function shuffleArray(
    items
) {

    const shuffled =
        [...items];


    for (
        let index =
            shuffled.length - 1;

        index > 0;

        index--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (index + 1)
            );


        const temporary =
            shuffled[index];


        shuffled[index] =
            shuffled[randomIndex];


        shuffled[randomIndex] =
            temporary;
    }


    return shuffled;
}


// =====================================================
// LOAD CODE ORDERING QUESTION
// =====================================================

function loadCodeOrderingQuestion() {

    if (
        codeOrderingQuestions.length ===
        0
    ) {

        codeOrderingQuestions =
            backendQuestions.map(
                question => {

                    let lines = [];


                    // Preferred secure backend field.
                    if (
                        Array.isArray(
                            question.codeLines
                        )
                    ) {

                        lines =
                            question.codeLines
                                .map(
                                    line =>
                                        String(
                                            line
                                        ).trim()
                                )
                                .filter(
                                    line =>
                                        line !== ""
                                );


                    // Fallback if answerData contains
                    // shuffled lines from the backend.
                    } else if (
                        question.answerData
                    ) {

                        lines =
                            question.answerData
                                .split("\n")
                                .map(
                                    line =>
                                        line.trim()
                                )
                                .filter(
                                    line =>
                                        line !== ""
                                );


                    // Final fallback for existing data.
                    } else if (
                        question.codeSnippet
                    ) {

                        lines =
                            question.codeSnippet
                                .split("\n")
                                .map(
                                    line =>
                                        line.trim()
                                )
                                .filter(
                                    line =>
                                        line !== ""
                                );
                    }


                    return {
                        id:
                            question.id,

                        question:
                            question.question,

                        lines:
                            lines
                    };
                }
            );
    }


    if (
        codeOrderingQuestions.length ===
        0 ||
        !codeOrderingQuestion ||
        !codeOrderingAvailable ||
        !codeOrderingSelected ||
        !checkCodeOrderButton
    ) {

        return;
    }


    const question =
        codeOrderingQuestions[
            currentCodeOrderingIndex
        ];


    codeOrderingQuestion.textContent =
        question.question;


    codeOrderingAnswered =
        false;


    selectedOrderingLines =
        [];


    codeOrderingAvailable.innerHTML =
        "";


    codeOrderingSelected.innerHTML =
        "";


    if (codeOrderingFeedback) {

        codeOrderingFeedback.textContent =
            "Select the code lines in the correct order.";
    }


    checkCodeOrderButton.disabled =
        false;


    checkCodeOrderButton.style.display =
        "inline-block";


    if (resetCodeOrderButton) {

        resetCodeOrderButton.disabled =
            false;


        resetCodeOrderButton.style.display =
            "inline-block";
    }


    if (nextCodeOrderButton) {

        nextCodeOrderButton.style.display =
            "none";
    }


    // Shuffle again on the frontend so the
    // presentation order varies each attempt.

    const shuffledLines =
        shuffleArray(
            question.lines
        );


    shuffledLines.forEach(
        line => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                line;


            button.dataset.line =
                line;


            button.classList.add(
                "code-order-line"
            );


            button.addEventListener(
                "click",
                () => {

                    if (
                        codeOrderingAnswered ||
                        button.disabled
                    ) {

                        return;
                    }


                    selectedOrderingLines.push(
                        line
                    );


                    button.disabled =
                        true;


                    const selectedLine =
                        document.createElement(
                            "button"
                        );


                    selectedLine.type =
                        "button";


                    selectedLine.textContent =
                        line;


                    selectedLine.dataset.line =
                        line;


                    selectedLine.classList.add(
                        "selected-code-line"
                    );


                    selectedLine.addEventListener(
                        "click",
                        () => {

                            if (
                                codeOrderingAnswered
                            ) {

                                return;
                            }


                            const selectedIndex =
                                selectedOrderingLines
                                    .indexOf(
                                        line
                                    );


                            if (
                                selectedIndex !==
                                -1
                            ) {

                                selectedOrderingLines
                                    .splice(
                                        selectedIndex,
                                        1
                                    );
                            }


                            selectedLine.remove();


                            button.disabled =
                                false;
                        }
                    );


                    codeOrderingSelected
                        .appendChild(
                            selectedLine
                        );
                }
            );


            codeOrderingAvailable
                .appendChild(
                    button
                );
        }
    );
}


// =====================================================
// RESET CODE ORDER
// =====================================================

if (resetCodeOrderButton) {

    resetCodeOrderButton.addEventListener(
        "click",
        () => {

            if (
                codeOrderingAnswered
            ) {

                return;
            }


            loadCodeOrderingQuestion();
        }
    );
}


// =====================================================
// CHECK CODE ORDER
// =====================================================

if (checkCodeOrderButton) {

    checkCodeOrderButton.addEventListener(
        "click",
        async () => {

            if (
                codeOrderingAnswered ||
                codeOrderingQuestions.length ===
                0
            ) {

                return;
            }


            const question =
                codeOrderingQuestions[
                    currentCodeOrderingIndex
                ];


            if (
                question.lines.length ===
                0
            ) {

                codeOrderingFeedback.textContent =
                    "Code lines are unavailable.";


                return;
            }


            if (
                selectedOrderingLines.length !==
                question.lines.length
            ) {

                codeOrderingFeedback.textContent =
                    "Please select every code line first.";


                return;
            }


            const userAnswer =
                selectedOrderingLines.join(
                    "\n"
                );


            const result =
                await validateQuestionAnswer(
                    question.id,
                    userAnswer
                );


            if (!result) {

                codeOrderingFeedback.textContent =
                    "Unable to check answer.";


                return;
            }


            codeOrderingAnswered =
                true;


            checkCodeOrderButton.disabled =
                true;


            if (resetCodeOrderButton) {

                resetCodeOrderButton.disabled =
                    true;
            }


            if (result.correct) {

                codeOrderingScore++;


                codeOrderingFeedback.textContent =
                    "Correct order!";

            } else {

                codeOrderingFeedback.textContent =
                    "Incorrect order.";
            }


            if (nextCodeOrderButton) {

                nextCodeOrderButton.style.display =
                    "inline-block";


                nextCodeOrderButton.textContent =
                    currentCodeOrderingIndex ===
                    codeOrderingQuestions.length - 1

                        ? "View Result"

                        : "Next Puzzle";
            }
        }
    );
}


// =====================================================
// NEXT CODE ORDERING QUESTION
// =====================================================

if (nextCodeOrderButton) {

    nextCodeOrderButton.addEventListener(
        "click",
        async () => {

            currentCodeOrderingIndex++;


            if (
                currentCodeOrderingIndex <
                codeOrderingQuestions.length
            ) {

                loadCodeOrderingQuestion();

            } else {

                await finishCodeOrdering();
            }
        }
    );
}


// =====================================================
// FINISH CODE ORDERING
// =====================================================

async function finishCodeOrdering() {

    if (
        codeOrderingQuestions.length ===
        0
    ) {

        return;
    }


    const percentage =
        Math.round(
            (
                codeOrderingScore /
                codeOrderingQuestions.length
            ) * 100
        );


    codeOrderingQuestion.textContent =
        "Code Ordering Completed!";


    codeOrderingAvailable.innerHTML =
        "";


    codeOrderingSelected.innerHTML =
        "";


    checkCodeOrderButton.style.display =
        "none";


    if (resetCodeOrderButton) {

        resetCodeOrderButton.style.display =
            "none";
    }


    if (nextCodeOrderButton) {

        nextCodeOrderButton.style.display =
            "none";
    }


    codeOrderingFeedback.textContent =
        `Your score: ${codeOrderingScore} / ${codeOrderingQuestions.length} (${percentage}%)`;


    const result =
        await submitActivityResult(
            percentage
        );


    if (!result) {

        codeOrderingFeedback.textContent +=
            " — Result could not be saved.";


        return;
    }


    if (
        percentage >= 60
    ) {

        codeOrderingFeedback.textContent +=
            " — Activity completed!";

    } else if (
        percentage >= 51
    ) {

        codeOrderingFeedback.textContent +=
            " — Not passed. Half reward earned.";

    } else {

        codeOrderingFeedback.textContent +=
            " — Not passed. Try again.";
    }
}


// =====================================================
// END OF PART 3
// =====================================================

// =====================================================
// PART 4
// CODE CHALLENGE + FINAL INITIALIZATION
// =====================================================


// =====================================================
// 20. CODE CHALLENGE ENGINE
// =====================================================

const codeChallengeContainer =
    document.getElementById(
        "code-challenge-container"
    );

const codeChallengeQuestion =
    document.getElementById(
        "code-challenge-question"
    );

const codeChallengeStarter =
    document.getElementById(
        "code-challenge-starter"
    );

const codeChallengeAnswer =
    document.getElementById(
        "code-challenge-answer"
    );

const checkCodeChallengeButton =
    document.getElementById(
        "check-code-challenge-btn"
    );

const codeChallengeFeedback =
    document.getElementById(
        "code-challenge-feedback"
    );

const nextCodeChallengeButton =
    document.getElementById(
        "next-code-challenge-btn"
    );


let codeChallengeQuestions = [];

let currentCodeChallengeIndex = 0;

let codeChallengeScore = 0;

let codeChallengeAnswered = false;


// =====================================================
// LOAD CODE CHALLENGE
// =====================================================

function loadCodeChallenge() {

    if (
        codeChallengeQuestions.length ===
        0
    ) {

        codeChallengeQuestions =
            backendQuestions.map(
                question => ({
                    id:
                        question.id,

                    question:
                        question.question,

                    starter:
                        question.codeSnippet ||
                        ""
                })
            );
    }


    if (
        codeChallengeQuestions.length ===
        0 ||
        !codeChallengeQuestion ||
        !codeChallengeAnswer ||
        !checkCodeChallengeButton
    ) {

        return;
    }


    const challenge =
        codeChallengeQuestions[
            currentCodeChallengeIndex
        ];


    codeChallengeQuestion.textContent =
        challenge.question;


    if (codeChallengeStarter) {

        codeChallengeStarter.textContent =
            challenge.starter;
    }


    codeChallengeAnswer.value =
        "";


    codeChallengeAnswer.disabled =
        false;


    codeChallengeAnswer.style.display =
        "block";


    codeChallengeAnswered =
        false;


    checkCodeChallengeButton.disabled =
        false;


    checkCodeChallengeButton.style.display =
        "inline-block";


    checkCodeChallengeButton.textContent =
        "Check Answer";


    if (codeChallengeFeedback) {

        codeChallengeFeedback.textContent =
            "";
    }


    if (nextCodeChallengeButton) {

        nextCodeChallengeButton.style.display =
            "none";
    }
}


// =====================================================
// CHECK CODE CHALLENGE ANSWER
// =====================================================

if (checkCodeChallengeButton) {

    checkCodeChallengeButton.addEventListener(
        "click",
        async () => {

            if (codeChallengeAnswered) {

                return;
            }


            const userAnswer =
                codeChallengeAnswer
                    .value
                    .trim();


            if (
                userAnswer === ""
            ) {

                codeChallengeFeedback.textContent =
                    "Enter your solution first.";


                return;
            }


            const challenge =
                codeChallengeQuestions[
                    currentCodeChallengeIndex
                ];


            const result =
                await validateQuestionAnswer(
                    challenge.id,
                    userAnswer
                );


            if (!result) {

                codeChallengeFeedback.textContent =
                    "Unable to check answer.";


                return;
            }


            codeChallengeAnswered =
                true;


            codeChallengeAnswer.disabled =
                true;


            checkCodeChallengeButton.disabled =
                true;


            if (result.correct) {

                codeChallengeScore++;


                codeChallengeFeedback.textContent =
                    "Correct solution!";

            } else {

                codeChallengeFeedback.textContent =
                    "Not quite. Try again.";
            }


            if (nextCodeChallengeButton) {

                nextCodeChallengeButton.style.display =
                    "inline-block";


                nextCodeChallengeButton.textContent =
                    currentCodeChallengeIndex ===
                    codeChallengeQuestions.length - 1

                        ? "View Result"

                        : "Next Challenge";
            }
        }
    );
}


// =====================================================
// NEXT CODE CHALLENGE
// =====================================================

if (nextCodeChallengeButton) {

    nextCodeChallengeButton.addEventListener(
        "click",
        async () => {

            currentCodeChallengeIndex++;


            if (
                currentCodeChallengeIndex <
                codeChallengeQuestions.length
            ) {

                loadCodeChallenge();

            } else {

                await finishCodeChallenge();
            }
        }
    );
}


// =====================================================
// FINISH CODE CHALLENGE
// =====================================================

async function finishCodeChallenge() {

    if (
        codeChallengeQuestions.length ===
        0
    ) {

        return;
    }


    const percentage =
        Math.round(
            (
                codeChallengeScore /
                codeChallengeQuestions.length
            ) * 100
        );


    codeChallengeQuestion.textContent =
        "Code Challenge Completed!";


    if (codeChallengeStarter) {

        codeChallengeStarter.textContent =
            "";
    }


    codeChallengeAnswer.style.display =
        "none";


    checkCodeChallengeButton.style.display =
        "none";


    if (nextCodeChallengeButton) {

        nextCodeChallengeButton.style.display =
            "none";
    }


    codeChallengeFeedback.textContent =
        `Your score: ${codeChallengeScore} / ${codeChallengeQuestions.length} (${percentage}%)`;


    const result =
        await submitActivityResult(
            percentage
        );


    if (!result) {

        codeChallengeFeedback.textContent +=
            " — Result could not be saved.";


        return;
    }


    if (
        percentage >= 60
    ) {

        codeChallengeFeedback.textContent +=
            " — Activity completed!";

    } else if (
        percentage >= 51
    ) {

        codeChallengeFeedback.textContent +=
            " — Not passed. Half reward earned.";

    } else {

        codeChallengeFeedback.textContent +=
            " — Not passed. Try again.";
    }
}


// =====================================================
// 21. RESET ALL ENGINE STATE
// =====================================================

function resetActivityEngineState() {

    // QUIZ
    quizQuestions = [];
    currentQuizIndex = 0;
    quizScore = 0;
    quizAnswered = false;


    // FILL IN THE BLANK
    fillBlankQuestions = [];
    currentFillIndex = 0;
    fillBlankScore = 0;


    // TRUE / FALSE
    trueFalseQuestions = [];
    currentTrueFalseIndex = 0;
    trueFalseScore = 0;
    trueFalseAnswered = false;


    // CODE OUTPUT
    codeOutputQuestions = [];
    currentCodeOutputIndex = 0;
    codeOutputScore = 0;
    codeOutputAnswered = false;


    // DEBUGGING
    debuggingQuestions = [];
    currentDebuggingIndex = 0;
    debuggingScore = 0;
    debuggingAnswered = false;


    // MATCHING
    matchingPairs = [];
    selectedLeft = null;
    selectedRight = null;
    matchedCount = 0;


    // CODE ORDERING
    codeOrderingQuestions = [];
    currentCodeOrderingIndex = 0;
    codeOrderingScore = 0;
    codeOrderingAnswered = false;
    selectedOrderingLines = [];


    // CODE CHALLENGE
    codeChallengeQuestions = [];
    currentCodeChallengeIndex = 0;
    codeChallengeScore = 0;
    codeChallengeAnswered = false;
}


// =====================================================
// 22. HIDE ALL GAME ENGINES
// =====================================================

function hideAllGameContainers() {

    const containers = [

        quizContainer,

        fillBlankContainer,

        trueFalseContainer,

        matchingContainer,

        codeOutputContainer,

        codeOrderingContainer,

        debuggingContainer,

        codeChallengeContainer
    ];


    containers.forEach(
        container => {

            if (container) {

                container.classList.add(
                    "hidden"
                );
            }
        }
    );
}


// =====================================================
// 23. INITIALIZE ACTIVITY PAGE
// =====================================================

async function initializeActivityPage() {

    // ---------------------------------------------
    // STEP 1
    // HIDE ALL GAME ENGINES
    // ---------------------------------------------

    hideAllGameContainers();


    // ---------------------------------------------
    // STEP 2
    // LOAD ACTIVITY + SAFE QUESTIONS
    // ---------------------------------------------

    const loaded =
        await loadActivityFromBackend();


    if (!loaded) {

        return;
    }


    // ---------------------------------------------
    // STEP 3
    // CHECK COMPLETED / LOCKED STATUS
    // ---------------------------------------------

    const canOpenActivity =
        await checkCurrentActivityAccess();


    if (!canOpenActivity) {

        return;
    }


    // ---------------------------------------------
    // STEP 4
    // START ACTIVITY ATTEMPT
    // ---------------------------------------------

    const attemptStarted =
        await startActivityAttempt();


    if (!attemptStarted) {

        return;
    }


    // ---------------------------------------------
    // STEP 5
    // RESET ENGINE STATE
    // ---------------------------------------------

    resetActivityEngineState();


    console.log(
        "Ready to start game:",
        backendActivity.type
    );


    // ---------------------------------------------
    // STEP 6
    // LOAD CORRECT GAME ENGINE
    // ---------------------------------------------

    switch (
        backendActivity.type
    ) {


        // =========================================
        // QUIZ
        // =========================================

        case "QUIZ":

            if (!quizContainer) {

                console.error(
                    "Quiz container not found."
                );

                return;
            }


            quizContainer.classList.remove(
                "hidden"
            );


            loadQuizQuestion();


            break;


        // =========================================
        // FILL IN THE BLANK
        // =========================================

        case "FILL_IN_THE_BLANK":

            if (!fillBlankContainer) {

                console.error(
                    "Fill blank container not found."
                );

                return;
            }


            fillBlankContainer.classList.remove(
                "hidden"
            );


            loadFillBlankQuestion();


            break;


        // =========================================
        // TRUE / FALSE
        // =========================================

        case "TRUE_FALSE":

            if (!trueFalseContainer) {

                console.error(
                    "True/False container not found."
                );

                return;
            }


            trueFalseContainer.classList.remove(
                "hidden"
            );


            loadTrueFalseQuestion();


            break;


        // =========================================
        // MATCHING
        // =========================================

        case "MATCHING":

            if (!matchingContainer) {

                console.error(
                    "Matching container not found."
                );

                return;
            }


            matchingContainer.classList.remove(
                "hidden"
            );


            loadMatchingGame();


            break;


        // =========================================
        // CODE OUTPUT
        // =========================================

        case "CODE_OUTPUT":

            if (!codeOutputContainer) {

                console.error(
                    "Code output container not found."
                );

                return;
            }


            codeOutputContainer.classList.remove(
                "hidden"
            );


            loadCodeOutputQuestion();


            break;


        // =========================================
        // CODE ORDERING
        // =========================================

        case "CODE_ORDERING":

            if (!codeOrderingContainer) {

                console.error(
                    "Code ordering container not found."
                );

                return;
            }


            codeOrderingContainer.classList.remove(
                "hidden"
            );


            loadCodeOrderingQuestion();


            break;


        // =========================================
        // DEBUGGING
        // =========================================

        case "DEBUGGING":

            if (!debuggingContainer) {

                console.error(
                    "Debugging container not found."
                );

                return;
            }


            debuggingContainer.classList.remove(
                "hidden"
            );


            loadDebuggingQuestion();


            break;


        // =========================================
        // CODE CHALLENGE
        // =========================================

        case "CODE_CHALLENGE":

            if (!codeChallengeContainer) {

                console.error(
                    "Code challenge container not found."
                );

                return;
            }


            codeChallengeContainer.classList.remove(
                "hidden"
            );


            loadCodeChallenge();


            break;


        // =========================================
        // UNKNOWN ACTIVITY TYPE
        // =========================================

        default:

            console.error(
                "Unsupported activity type:",
                backendActivity.type
            );


            alert(
                "This activity type is not supported yet."
            );


            return;
    }
}


// =====================================================
// 24. START ACTIVITY PAGE
// =====================================================

initializeActivityPage();


// =====================================================
// END OF ACTIVITY.JS
// =====================================================