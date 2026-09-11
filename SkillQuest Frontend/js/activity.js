// =====================================================
// SKILLQUEST - ACTIVITY PAGE
// =====================================================


// =====================================================
// 1. GET ACTIVITY FROM URL
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );

const currentTopicName =
    params.get("topic");

const currentActivityName =
    params.get("activity");


// =====================================================
// 2. PAGE ELEMENTS
// =====================================================

const activityTitle =
    document.getElementById(
        "activity-title"
    );

const topicTitle =
    document.getElementById(
        "activity-topic"
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
// 3. DISPLAY CURRENT ACTIVITY
// =====================================================

if (activityTitle) {

    activityTitle.textContent =
        currentActivityName ||
        "Java Activity";

}

if (topicTitle) {

    topicTitle.textContent =
        currentTopicName ||
        "Java Course";

}


// =====================================================
// 4. ACTIVITY COMPLETION
// =====================================================

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


// =====================================================
// 5. COMPLETE ACTIVITY BUTTON
// =====================================================

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

        completeButton.classList.add(
            "activity-completed-btn"
        );

    } else {

        completeButton.disabled = true;

        completeButton.textContent =
            "Complete Activity";

        completeButton.classList.remove(
            "activity-completed-btn"
        );

    }

}


if (completeButton) {

    completeButton.addEventListener(
        "click",
        function () {

            if (
                isCurrentActivityCompleted()
            ) {

                window.location.assign(
                    "java-course.html"
                );

            }

        }
    );

}


// =====================================================
// 6. BACK TO COURSE BUTTON
// =====================================================

if (backToCourseButton) {

    backToCourseButton.disabled = false;

    backToCourseButton.addEventListener(
        "click",
        function () {

            window.location.assign(
                "java-course.html"
            );

        }
    );

}


// =====================================================
// 7. GAME TYPE MAPPING
// =====================================================

const activityTypeMap = {

    // JAVA FUNDAMENTALS
    "Variables & Data Types": "quiz",
    "Operators": "fill",
    "Control Statements": "code-output",
    "Fundamentals Challenge": "true-false",

    // ARRAYS & STRINGS
    "Arrays": "quiz",
    "Strings": "fill",
    "StringBuilder & StringBuffer": "matching",
    "Arrays & Strings Challenge": "code-output",

    // OOP
    "Classes & Objects": "quiz",
    "Constructors": "code-output",
    "Inheritance": "matching",
    "Polymorphism": "code-output",
    "Abstraction": "true-false",
    "Encapsulation": "fill",
    "OOP Debugging Challenge": "debugging",

    // EXCEPTION HANDLING
    "Try-Catch": "quiz",
    "Multiple Catch Blocks": "code-ordering",
    "Finally": "true-false",
    "Throw & Throws": "matching",
    "Exception Debugging": "debugging",

    // FILE HANDLING
    "Reading Files": "code-ordering",
    "Writing Files": "fill",
    "File Handling Challenge": "debugging",

    // MULTITHREADING
    "Creating Threads": "quiz",
    "Thread Lifecycle": "matching",
    "Synchronization": "code-output",
    "Multithreading Challenge": "code-challenge"
};


// =====================================================
// 8. GAME CONTAINERS
// =====================================================

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

const trueFalseContainer =
    document.getElementById(
        "true-false-container"
    );


// =====================================================
// 9. QUIZ DATA
// =====================================================

const quizData = {

    "Variables & Data Types": [

        {
            question:
                "Which data type is used to store whole numbers in Java?",
            options: [
                "int",
                "float",
                "boolean",
                "char"
            ],
            answer: "int"
        },

        {
            question:
                "Which data type stores true or false values?",
            options: [
                "String",
                "boolean",
                "double",
                "char"
            ],
            answer: "boolean"
        },

        {
            question:
                "Which keyword creates a variable whose value cannot be changed?",
            options: [
                "static",
                "final",
                "const",
                "fixed"
            ],
            answer: "final"
        },

        {
            question:
                "Which data type is commonly used for decimal numbers with higher precision?",
            options: [
                "int",
                "char",
                "double",
                "boolean"
            ],
            answer: "double"
        },

        {
            question:
                "Which declaration is valid Java?",
            options: [
                "int age = 26;",
                "age int = 26;",
                "number age = 26;",
                "int = age 26;"
            ],
            answer: "int age = 26;"
        }

    ],


    "Arrays": [

        {
            question:
                "What is the index of the first element in a Java array?",
            options: [
                "0",
                "1",
                "-1",
                "Depends on the array"
            ],
            answer: "0"
        },

        {
            question:
                "Which property gives the size of an array?",
            options: [
                "size",
                "length",
                "length()",
                "size()"
            ],
            answer: "length"
        },

        {
            question:
                "Which is a valid array declaration?",
            options: [
                "int[] numbers;",
                "array int numbers;",
                "int numbers();",
                "numbers[] int;"
            ],
            answer: "int[] numbers;"
        },

        {
            question:
                "What happens when you access an invalid array index?",
            options: [
                "Returns null",
                "Returns 0",
                "ArrayIndexOutOfBoundsException",
                "The array automatically expands"
            ],
            answer:
                "ArrayIndexOutOfBoundsException"
        },

        {
            question:
                "Which loop is convenient for reading every element of an array?",
            options: [
                "Enhanced for loop",
                "switch",
                "if",
                "try-catch"
            ],
            answer:
                "Enhanced for loop"
        },

        {
            question:
                "Can a Java array change its length after creation?",
            options: [
                "Yes",
                "No",
                "Only integer arrays",
                "Only inside loops"
            ],
            answer: "No"
        }

    ],


    "Classes & Objects": [

        {
            question:
                "What is a class in Java?",
            options: [
                "A blueprint for objects",
                "A loop",
                "An exception",
                "A package"
            ],
            answer:
                "A blueprint for objects"
        },

        {
            question:
                "Which keyword creates an object?",
            options: [
                "class",
                "new",
                "object",
                "create"
            ],
            answer: "new"
        },

        {
            question:
                "An object is an instance of what?",
            options: [
                "A class",
                "A loop",
                "A variable only",
                "An operator"
            ],
            answer: "A class"
        },

        {
            question:
                "Which operator is normally used to access an object's members?",
            options: [
                ".",
                "::",
                "#",
                "@"
            ],
            answer: "."
        },

        {
            question:
                "Can multiple objects be created from the same class?",
            options: [
                "Yes",
                "No",
                "Only two",
                "Only with inheritance"
            ],
            answer: "Yes"
        },

        {
            question:
                "Which of these can a Java class contain?",
            options: [
                "Fields and methods",
                "Only variables",
                "Only loops",
                "Only constructors"
            ],
            answer:
                "Fields and methods"
        },

        {
            question:
                "Which keyword refers to the current object?",
            options: [
                "this",
                "self",
                "current",
                "super"
            ],
            answer: "this"
        }

    ],


    "Try-Catch": [

        {
            question:
                "What is the purpose of a try block?",
            options: [
                "To contain code that may throw an exception",
                "To create a class",
                "To repeat code",
                "To declare an interface"
            ],
            answer:
                "To contain code that may throw an exception"
        },

        {
            question:
                "What does a catch block do?",
            options: [
                "Handles an exception",
                "Creates an exception automatically",
                "Stops compilation",
                "Creates a thread"
            ],
            answer:
                "Handles an exception"
        },

        {
            question:
                "Which block normally follows a try block when handling an exception?",
            options: [
                "catch",
                "switch",
                "while",
                "class"
            ],
            answer: "catch"
        },

        {
            question:
                "Can a try statement have multiple catch blocks?",
            options: [
                "Yes",
                "No",
                "Only for checked exceptions",
                "Only inside loops"
            ],
            answer: "Yes"
        },

        {
            question:
                "What happens when a matching catch block handles an exception?",
            options: [
                "Its code executes",
                "The program recompiles",
                "The class is deleted",
                "The JVM always terminates"
            ],
            answer:
                "Its code executes"
        },

        {
            question:
                "Which class is the superclass of exceptions and errors in Java?",
            options: [
                "Throwable",
                "String",
                "ObjectException",
                "ErrorHandler"
            ],
            answer: "Throwable"
        }

    ],


    "Creating Threads": [

        {
            question:
                "Which class can be extended to create a thread?",
            options: [
                "Thread",
                "Runnable",
                "System",
                "Scanner"
            ],
            answer: "Thread"
        },

        {
            question:
                "Which interface can be implemented to define a task for a thread?",
            options: [
                "Runnable",
                "Serializable",
                "Comparable",
                "Cloneable"
            ],
            answer: "Runnable"
        },

        {
            question:
                "Which method starts a new thread?",
            options: [
                "start()",
                "run()",
                "begin()",
                "executeThread()"
            ],
            answer: "start()"
        },

        {
            question:
                "Which method contains the work performed by a thread?",
            options: [
                "run()",
                "main()",
                "stop()",
                "create()"
            ],
            answer: "run()"
        },

        {
            question:
                "What happens when start() is called on a Thread?",
            options: [
                "A new thread of execution is started",
                "run() executes only on the current thread",
                "The JVM closes",
                "The thread is permanently blocked"
            ],
            answer:
                "A new thread of execution is started"
        },

        {
            question:
                "Can start() normally be called twice on the same Thread object?",
            options: [
                "No",
                "Yes",
                "Only inside main()",
                "Only for Runnable"
            ],
            answer: "No"
        }

    ]

};


// =====================================================
// 10. QUIZ ENGINE
// =====================================================

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

const quizQuestions =
    quizData[
        currentActivityName
    ] || [];

let currentQuizIndex = 0;

let quizScore = 0;

let quizAnswered = false;


function loadQuizQuestion() {

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

    quizOptions.innerHTML = "";

    quizFeedback.textContent = "";

    quizAnswered = false;

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


function checkQuizAnswer(
    selectedOption
) {

    if (quizAnswered) {
        return;
    }

    quizAnswered = true;

    const question =
        quizQuestions[
            currentQuizIndex
        ];

    const optionButtons =
        quizOptions.querySelectorAll(
            "button"
        );

    optionButtons.forEach(
        button => {
            button.disabled = true;
        }
    );

    if (
        selectedOption ===
        question.answer
    ) {

        quizScore++;

        quizFeedback.textContent =
            "Correct!";

    } else {

        quizFeedback.textContent =
            "Incorrect. Correct answer: " +
            question.answer;

    }

    if (nextQuestionButton) {

        nextQuestionButton.style.display =
            "inline-block";

        if (
            currentQuizIndex ===
            quizQuestions.length - 1
        ) {

            nextQuestionButton.textContent =
                "View Result";

        } else {

            nextQuestionButton.textContent =
                "Next Question";

        }

    }

}


if (nextQuestionButton) {

    nextQuestionButton.addEventListener(
        "click",
        () => {

            currentQuizIndex++;

            if (
                currentQuizIndex <
                quizQuestions.length
            ) {

                loadQuizQuestion();

            } else {

                finishQuiz();

            }

        }
    );

}


function finishQuiz() {

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

    if (percentage >= 50) {

        markCurrentActivityCompleted();

        quizFeedback.textContent +=
            " — Activity completed!";

    } else {

        quizFeedback.textContent +=
            " — You need at least 50% to complete this activity.";

    }

}


// =====================================================
// 11. FILL IN THE BLANK DATA
// =====================================================

const fillBlankQuestionBanks = {

    "Operators": [

        {
            question:
                "The Java operator used to calculate remainder is ______.",
            answer: "%"
        },

        {
            question:
                "The equality comparison operator in Java is ______.",
            answer: "=="
        },

        {
            question:
                "The logical AND operator is ______.",
            answer: "&&"
        },

        {
            question:
                "The logical OR operator is ______.",
            answer: "||"
        },

        {
            question:
                "The increment operator is ______.",
            answer: "++"
        }

    ],


    "Strings": [

        {
            question:
                "The method used to find the number of characters in a String is ______.",
            answer: "length()"
        },

        {
            question:
                "The method commonly used to compare the contents of two Strings is ______.",
            answer: "equals()"
        },

        {
            question:
                "The method used to convert a String to uppercase is ______.",
            answer: "toUpperCase()"
        },

        {
            question:
                "The method used to extract part of a String is ______.",
            answer: "substring()"
        },

        {
            question:
                "Strings in Java are ______, meaning their contents cannot be changed after creation.",
            answer: "immutable"
        },

        {
            question:
                "The method used to remove leading and trailing spaces from a String is ______.",
            answer: "trim()"
        }

    ],


    "Encapsulation": [

        {
            question:
                "Encapsulation commonly keeps fields ______ to prevent direct external access.",
            answer: "private"
        },

        {
            question:
                "A method used to retrieve a private field is commonly called a ______.",
            answer: "getter"
        },

        {
            question:
                "A method used to modify a private field is commonly called a ______.",
            answer: "setter"
        },

        {
            question:
                "Encapsulation combines data and the methods operating on that data inside a ______.",
            answer: "class"
        },

        {
            question:
                "The access modifier that restricts a member to its own class is ______.",
            answer: "private"
        }

    ],


    "Writing Files": [

        {
            question:
                "A Java class commonly used to write character data to a file is ______.",
            answer: "FileWriter"
        },

        {
            question:
                "The method commonly used to write data with FileWriter is ______.",
            answer: "write()"
        },

        {
            question:
                "The method used to close a writer is ______.",
            answer: "close()"
        },

        {
            question:
                "The package containing FileWriter is java.______.",
            answer: "io"
        },

        {
            question:
                "A class commonly used for efficient buffered character writing is ______.",
            answer: "BufferedWriter"
        }

    ]

};


// =====================================================
// 12. FILL IN THE BLANK ENGINE
// =====================================================

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

const fillBlankQuestions =
    fillBlankQuestionBanks[
        currentActivityName
    ] || [];

let currentFillIndex = 0;

let fillBlankScore = 0;


function loadFillBlankQuestion() {

    if (
        fillBlankQuestions.length === 0 ||
        !fillBlankQuestion ||
        !fillBlankAnswer ||
        !checkFillBlankButton
    ) {
        return;
    }

    const currentQuestion =
        fillBlankQuestions[
            currentFillIndex
        ];

    fillBlankQuestion.textContent =
        currentQuestion.question;

    fillBlankAnswer.value = "";

    fillBlankAnswer.style.display =
        "block";

    fillBlankAnswer.disabled =
        false;

    checkFillBlankButton.style.display =
        "inline-block";

    checkFillBlankButton.disabled =
        false;

    checkFillBlankButton.textContent =
        "Check Answer";

    checkFillBlankButton.dataset.mode =
        "check";

    if (fillBlankFeedback) {
        fillBlankFeedback.textContent =
            "";
    }

}


if (checkFillBlankButton) {

    checkFillBlankButton.addEventListener(
        "click",
        () => {

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

                    finishFillBlank();

                }

                return;

            }

            const userAnswer =
                fillBlankAnswer
                    .value
                    .trim()
                    .toLowerCase();

            if (userAnswer === "") {

                fillBlankFeedback.textContent =
                    "Please enter an answer.";

                return;

            }

            const correctAnswer =
                fillBlankQuestions[
                    currentFillIndex
                ]
                    .answer
                    .trim()
                    .toLowerCase();

            if (
                userAnswer ===
                correctAnswer
            ) {

                fillBlankScore++;

                fillBlankFeedback.textContent =
                    "Correct!";

            } else {

                fillBlankFeedback.textContent =
                    "Incorrect. Correct answer: " +
                    fillBlankQuestions[
                        currentFillIndex
                    ].answer;

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


function finishFillBlank() {

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

    if (percentage >= 50) {

        markCurrentActivityCompleted();

        fillBlankFeedback.textContent +=
            " — Activity completed!";

    } else {

        fillBlankFeedback.textContent +=
            " — You need at least 50% to complete this activity.";

    }

}


// =====================================================
// 13. MATCHING DATA
// =====================================================

const matchingData = {

    "StringBuilder & StringBuffer": [

        {
            left: "StringBuilder",
            right:
                "Mutable and not synchronized"
        },

        {
            left: "StringBuffer",
            right:
                "Mutable and synchronized"
        },

        {
            left: "append()",
            right:
                "Adds content"
        },

        {
            left: "insert()",
            right:
                "Adds content at a position"
        },

        {
            left: "reverse()",
            right:
                "Reverses characters"
        }

    ],


    "Inheritance": [

        {
            left: "extends",
            right:
                "Creates class inheritance"
        },

        {
            left: "super",
            right:
                "Refers to parent class members"
        },

        {
            left: "Parent class",
            right:
                "Superclass"
        },

        {
            left: "Child class",
            right:
                "Subclass"
        },

        {
            left: "IS-A relationship",
            right:
                "Inheritance relationship"
        }

    ],


    "Throw & Throws": [

        {
            left: "throw",
            right:
                "Explicitly throws an exception"
        },

        {
            left: "throws",
            right:
                "Declares possible exceptions"
        },

        {
            left: "Exception",
            right:
                "Can be thrown"
        },

        {
            left: "Method signature",
            right:
                "Can contain throws"
        },

        {
            left: "new Exception()",
            right:
                "Creates an exception object"
        }

    ],


    "Thread Lifecycle": [

        {
            left: "NEW",
            right:
                "Thread created but not started"
        },

        {
            left: "RUNNABLE",
            right:
                "Ready or running"
        },

        {
            left: "BLOCKED",
            right:
                "Waiting to enter synchronized code"
        },

        {
            left: "WAITING",
            right:
                "Waiting indefinitely"
        },

        {
            left: "TERMINATED",
            right:
                "Execution finished"
        }

    ]

};


// =====================================================
// 14. MATCHING ENGINE
// =====================================================

const matchingLeft =
    document.getElementById(
        "matching-left"
    ) ||
    document.getElementById(
        "matching-terms"
    );

const matchingRight =
    document.getElementById(
        "matching-right"
    ) ||
    document.getElementById(
        "matching-meanings"
    );

const matchingFeedback =
    document.getElementById(
        "matching-feedback"
    );

const matchingPairs =
    matchingData[
        currentActivityName
    ] || [];

let selectedLeft = null;

let selectedRight = null;

let matchedCount = 0;


function loadMatchingGame() {

    if (
        matchingPairs.length === 0 ||
        !matchingLeft ||
        !matchingRight
    ) {
        return;
    }

    matchingLeft.innerHTML = "";

    matchingRight.innerHTML = "";

    const shuffledRight =
        [...matchingPairs]
            .sort(
                () =>
                    Math.random() - 0.5
            );

    matchingPairs.forEach(
        pair => {

            const button =
                document.createElement(
                    "button"
                );

            button.textContent =
                pair.left;

            button.dataset.id =
                pair.left;

            button.classList.add(
                "matching-item"
            );

            button.addEventListener(
                "click",
                () => {

                    if (button.disabled) {
                        return;
                    }

                    if (selectedLeft) {

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


    shuffledRight.forEach(
        pair => {

            const button =
                document.createElement(
                    "button"
                );

            button.textContent =
                pair.right;

            button.dataset.id =
                pair.left;

            button.classList.add(
                "matching-item"
            );

            button.addEventListener(
                "click",
                () => {

                    if (button.disabled) {
                        return;
                    }

                    if (selectedRight) {

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


function checkMatchingPair() {

    if (
        !selectedLeft ||
        !selectedRight
    ) {
        return;
    }

    if (
        selectedLeft.dataset.id ===
        selectedRight.dataset.id
    ) {

        selectedLeft.disabled =
            true;

        selectedRight.disabled =
            true;

        selectedLeft.classList.add(
            "matched"
        );

        selectedRight.classList.add(
            "matched"
        );

        matchedCount++;

        if (matchingFeedback) {

            matchingFeedback.textContent =
                "Correct match!";

        }

        if (
            matchedCount ===
            matchingPairs.length
        ) {

            if (matchingFeedback) {

                matchingFeedback.textContent =
                    "All pairs matched — Activity completed!";

            }

            markCurrentActivityCompleted();

        }

    } else {

        if (matchingFeedback) {

            matchingFeedback.textContent =
                "Not a match. Try again.";

        }

        selectedLeft.classList.remove(
            "selected"
        );

        selectedRight.classList.remove(
            "selected"
        );

    }

    selectedLeft = null;

    selectedRight = null;

}


// =====================================================
// 15. TRUE / FALSE DATA
// =====================================================

const trueFalseData = {

    "Fundamentals Challenge": [

        {
            question:
                "Java is case-sensitive.",
            answer: true
        },

        {
            question:
                "An int variable can directly store the value 10.5.",
            answer: false
        },

        {
            question:
                "The boolean type can store true or false.",
            answer: true
        },

        {
            question:
                "The == operator is used for assignment.",
            answer: false
        },

        {
            question:
                "A while loop may execute zero times.",
            answer: true
        },

        {
            question:
                "The break statement can terminate a loop.",
            answer: true
        }

    ],


    "Abstraction": [

        {
            question:
                "An abstract class can contain abstract methods.",
            answer: true
        },

        {
            question:
                "An abstract class can be instantiated directly using new.",
            answer: false
        },

        {
            question:
                "An abstract class can contain concrete methods.",
            answer: true
        },

        {
            question:
                "The abstract keyword can be used with a class.",
            answer: true
        },

        {
            question:
                "A subclass must implement inherited abstract methods unless the subclass is also abstract.",
            answer: true
        },

        {
            question:
                "Abstraction means exposing every implementation detail to the user.",
            answer: false
        }

    ],


    "Finally": [

        {
            question:
                "A finally block is commonly used for cleanup code.",
            answer: true
        },

        {
            question:
                "A finally block must always be followed by a catch block.",
            answer: false
        },

        {
            question:
                "A try block can be followed by a finally block without a catch block.",
            answer: true
        },

        {
            question:
                "The finally block normally executes whether an exception occurs or not.",
            answer: true
        },

        {
            question:
                "Java allows multiple finally blocks for one try statement.",
            answer: false
        },

        {
            question:
                "finally is a Java keyword.",
            answer: true
        }

    ]

};


// =====================================================
// 16. TRUE / FALSE ENGINE
// =====================================================

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

const trueFalseQuestions =
    trueFalseData[
        currentActivityName
    ] || [];

let currentTrueFalseIndex = 0;

let trueFalseScore = 0;


function loadTrueFalseQuestion() {

    if (
        trueFalseQuestions.length === 0 ||
        !trueFalseQuestion ||
        !trueButton ||
        !falseButton
    ) {
        return;
    }

    trueFalseQuestion.textContent =
        trueFalseQuestions[
            currentTrueFalseIndex
        ].question;

    trueButton.disabled =
        false;

    falseButton.disabled =
        false;

    trueButton.style.display =
        "inline-block";

    falseButton.style.display =
        "inline-block";

    if (trueFalseFeedback) {
        trueFalseFeedback.textContent =
            "";
    }

    if (nextTrueFalseButton) {

        nextTrueFalseButton
            .classList
            .add(
                "hidden"
            );

    }

}


function checkTrueFalseAnswer(
    selectedAnswer
) {

    const correctAnswer =
        trueFalseQuestions[
            currentTrueFalseIndex
        ].answer;

    trueButton.disabled =
        true;

    falseButton.disabled =
        true;

    if (
        selectedAnswer ===
        correctAnswer
    ) {

        trueFalseScore++;

        trueFalseFeedback.textContent =
            "Correct!";

    } else {

        trueFalseFeedback.textContent =
            "Incorrect. Correct answer: " +
            (
                correctAnswer
                    ? "True"
                    : "False"
            );

    }

    if (nextTrueFalseButton) {

        nextTrueFalseButton
            .classList
            .remove(
                "hidden"
            );

    }

}


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


if (nextTrueFalseButton) {

    nextTrueFalseButton.addEventListener(
        "click",
        () => {

            currentTrueFalseIndex++;

            if (
                currentTrueFalseIndex <
                trueFalseQuestions.length
            ) {

                loadTrueFalseQuestion();

            } else {

                finishTrueFalse();

            }

        }
    );

}


function finishTrueFalse() {

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

        nextTrueFalseButton
            .classList
            .add(
                "hidden"
            );

    }

    trueFalseFeedback.textContent =
        `Your score: ${trueFalseScore} / ${trueFalseQuestions.length} (${percentage}%)`;

    if (percentage >= 50) {

        markCurrentActivityCompleted();

        trueFalseFeedback.textContent +=
            " — Activity completed!";

    } else {

        trueFalseFeedback.textContent +=
            " — You need at least 50% to complete this activity.";

    }

}

// =====================================================
// CODE OUTPUT DATA
// =====================================================

const codeOutputData = {

    "Control Statements": [

        {
            code: `int x = 10;

if (x > 5) {
    System.out.println("Yes");
} else {
    System.out.println("No");
}`,
            options: [
                "Yes",
                "No",
                "10",
                "Compilation Error"
            ],
            answer: "Yes"
        },

        {
            code: `int x = 3;

if (x == 3) {
    System.out.println("Java");
}`,
            options: [
                "Java",
                "3",
                "Nothing",
                "Error"
            ],
            answer: "Java"
        },

        {
            code: `for (int i = 1; i <= 3; i++) {
    System.out.print(i + " ");
}`,
            options: [
                "1 2 3",
                "0 1 2",
                "1 2",
                "3 2 1"
            ],
            answer: "1 2 3"
        },

        {
            code: `int i = 1;

while (i < 4) {
    System.out.print(i + " ");
    i++;
}`,
            options: [
                "1 2 3",
                "1 2 3 4",
                "0 1 2 3",
                "Infinite loop"
            ],
            answer: "1 2 3"
        },

        {
            code: `int number = 2;

switch (number) {
    case 1:
        System.out.println("One");
        break;

    case 2:
        System.out.println("Two");
        break;

    default:
        System.out.println("Other");
}`,
            options: [
                "One",
                "Two",
                "Other",
                "One Two"
            ],
            answer: "Two"
        }

    ],

    "Arrays & Strings Challenge": [

        {
            code: `int[] numbers = {10, 20, 30};

System.out.println(numbers[1]);`,
            options: [
                "10",
                "20",
                "30",
                "1"
            ],
            answer: "20"
        },

        {
            code: `String name = "Java";

System.out.println(name.length());`,
            options: [
                "3",
                "4",
                "5",
                "Java"
            ],
            answer: "4"
        },

        {
            code: `int[] values = {2, 4, 6};

System.out.println(values.length);`,
            options: [
                "2",
                "3",
                "6",
                "12"
            ],
            answer: "3"
        },

        {
            code: `String text = "SkillQuest";

System.out.println(text.charAt(0));`,
            options: [
                "S",
                "k",
                "0",
                "SkillQuest"
            ],
            answer: "S"
        },

        {
            code: `String a = "Java";
String b = "Script";

System.out.println(a + b);`,
            options: [
                "JavaScript",
                "Java Script",
                "Java+Script",
                "Error"
            ],
            answer: "JavaScript"
        }

    ],

    "Constructors": [

        {
            code: `class Student {

    Student() {
        System.out.println("Created");
    }

    public static void main(String[] args) {
        new Student();
    }
}`,
            options: [
                "Created",
                "Student",
                "Nothing",
                "Error"
            ],
            answer: "Created"
        },

        {
            code: `class Test {

    Test(int x) {
        System.out.println(x);
    }

    public static void main(String[] args) {
        new Test(10);
    }
}`,
            options: [
                "0",
                "10",
                "Test",
                "Error"
            ],
            answer: "10"
        },

        {
            code: `class Demo {

    Demo() {
        System.out.print("A");
    }

    Demo(int x) {
        System.out.print("B");
    }

    public static void main(String[] args) {
        new Demo(5);
    }
}`,
            options: [
                "A",
                "B",
                "AB",
                "5"
            ],
            answer: "B"
        },

        {
            code: `class Person {

    String name;

    Person(String name) {
        this.name = name;
    }

    public static void main(String[] args) {
        Person p = new Person("Riya");
        System.out.println(p.name);
    }
}`,
            options: [
                "name",
                "Riya",
                "null",
                "Person"
            ],
            answer: "Riya"
        },

        {
            code: `class Sample {

    Sample() {
        System.out.print("1");
    }

    public static void main(String[] args) {
        new Sample();
        new Sample();
    }
}`,
            options: [
                "1",
                "11",
                "2",
                "Error"
            ],
            answer: "11"
        }

    ],

    "Polymorphism": [

        {
            code: `class Animal {
    void sound() {
        System.out.println("Animal");
    }
}

class Dog extends Animal {
    void sound() {
        System.out.println("Dog");
    }
}

Animal a = new Dog();
a.sound();`,
            options: [
                "Animal",
                "Dog",
                "Animal Dog",
                "Error"
            ],
            answer: "Dog"
        },

        {
            code: `class Test {

    void show(int x) {
        System.out.println("int");
    }

    void show(String x) {
        System.out.println("String");
    }
}

new Test().show(5);`,
            options: [
                "int",
                "String",
                "5",
                "Error"
            ],
            answer: "int"
        },

        {
            code: `class Parent {
    void display() {
        System.out.print("Parent");
    }
}

class Child extends Parent {
    void display() {
        System.out.print("Child");
    }
}

Parent p = new Child();
p.display();`,
            options: [
                "Parent",
                "Child",
                "ParentChild",
                "Nothing"
            ],
            answer: "Child"
        },

        {
            code: `class Calculator {

    int add(int a, int b) {
        return a + b;
    }

    double add(double a, double b) {
        return a + b;
    }
}

System.out.println(
    new Calculator().add(2, 3)
);`,
            options: [
                "5",
                "5.0",
                "23",
                "Error"
            ],
            answer: "5"
        },

        {
            code: `class A {
    void print() {
        System.out.print("A");
    }
}

class B extends A {
    void print() {
        System.out.print("B");
    }
}

A obj = new B();
obj.print();`,
            options: [
                "A",
                "B",
                "AB",
                "Error"
            ],
            answer: "B"
        }

    ],

    "Synchronization": [

        {
            code: `class Demo {

    synchronized void show() {
        System.out.println("Hello");
    }
}

Demo d = new Demo();
d.show();`,
            options: [
                "Hello",
                "synchronized",
                "Demo",
                "Nothing"
            ],
            answer: "Hello"
        },

        {
            code: `int count = 5;

synchronized (this) {
    count++;
}

System.out.println(count);`,
            options: [
                "5",
                "6",
                "4",
                "Error"
            ],
            answer: "6"
        },

        {
            code: `synchronized void print() {
    System.out.print("Java");
}

print();`,
            options: [
                "Java",
                "print",
                "synchronized",
                "Nothing"
            ],
            answer: "Java"
        },

        {
            code: `int x = 10;

synchronized (this) {
    x = x + 5;
}

System.out.println(x);`,
            options: [
                "10",
                "15",
                "5",
                "Error"
            ],
            answer: "15"
        },

        {
            code: `synchronized (this) {
    System.out.print("A");
}

System.out.print("B");`,
            options: [
                "A",
                "B",
                "AB",
                "BA"
            ],
            answer: "AB"
        }

    ]

};


// =====================================================
// CODE OUTPUT ENGINE
// =====================================================

const codeOutputContainer =
    document.getElementById(
        "code-output-container"
    );

const codeOutputCode =
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

const codeOutputQuestions =
    codeOutputData[
        currentActivityName
    ] || [];

let currentCodeOutputIndex = 0;
let codeOutputScore = 0;
let codeOutputAnswered = false;


function loadCodeOutputQuestion() {

    if (
        codeOutputQuestions.length === 0 ||
        !codeOutputCode ||
        !codeOutputOptions ||
        !codeOutputFeedback ||
        !nextCodeOutputButton
    ) {
        return;
    }

    const question =
        codeOutputQuestions[
            currentCodeOutputIndex
        ];

    codeOutputCode.textContent =
        question.code;

    codeOutputOptions.innerHTML = "";

    codeOutputFeedback.textContent = "";

    codeOutputAnswered = false;

    nextCodeOutputButton.classList.add(
        "hidden"
    );

    question.options.forEach(
        option => {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";
            button.textContent = option;

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


function checkCodeOutputAnswer(
    selectedAnswer
) {

    if (codeOutputAnswered) {
        return;
    }

    codeOutputAnswered = true;

    const question =
        codeOutputQuestions[
            currentCodeOutputIndex
        ];

    const buttons =
        codeOutputOptions.querySelectorAll(
            "button"
        );

    buttons.forEach(
        button => {
            button.disabled = true;
        }
    );

    if (
        selectedAnswer ===
        question.answer
    ) {

        codeOutputScore++;

        codeOutputFeedback.textContent =
            "Correct!";

    } else {

        codeOutputFeedback.textContent =
            "Incorrect. Correct output: " +
            question.answer;

    }

    nextCodeOutputButton.classList.remove(
        "hidden"
    );

    if (
        currentCodeOutputIndex ===
        codeOutputQuestions.length - 1
    ) {

        nextCodeOutputButton.textContent =
            "View Result";

    } else {

        nextCodeOutputButton.textContent =
            "Next Question";

    }

}


if (nextCodeOutputButton) {

    nextCodeOutputButton.addEventListener(
        "click",
        () => {

            currentCodeOutputIndex++;

            if (
                currentCodeOutputIndex <
                codeOutputQuestions.length
            ) {

                loadCodeOutputQuestion();

            } else {

                finishCodeOutput();

            }

        }
    );

}


function finishCodeOutput() {

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

    codeOutputCode.textContent = "";

    codeOutputOptions.innerHTML = "";

    nextCodeOutputButton.classList.add(
        "hidden"
    );

    codeOutputFeedback.textContent =
        `Score: ${codeOutputScore} / ${codeOutputQuestions.length} (${percentage}%)`;

    if (percentage >= 50) {

        markCurrentActivityCompleted();

        codeOutputFeedback.textContent +=
            " — Activity completed!";

    } else {

        codeOutputFeedback.textContent +=
            " — You need at least 50% to complete this activity.";

    }

}

// =====================================================
// DEBUGGING DATA
// =====================================================

const debuggingData = {

    "OOP Debugging Challenge": [

        {
            code: `class Student {
    private String name;
}

Student s = new Student();
s.name = "Riya";`,
            options: [
                "name is private and cannot be accessed directly",
                "Student cannot have fields",
                "String cannot be private",
                "new cannot create objects"
            ],
            answer:
                "name is private and cannot be accessed directly"
        },

        {
            code: `class Animal {
    void sound() {}
}

class Dog extends Animal {
    int sound() {
        return 1;
    }
}`,
            options: [
                "The overridden method has an incompatible return type",
                "Inheritance is not allowed",
                "Animal must be final",
                "Dog cannot contain methods"
            ],
            answer:
                "The overridden method has an incompatible return type"
        },

        {
            code: `abstract class Vehicle {
    abstract void start();
}

Vehicle v = new Vehicle();`,
            options: [
                "An abstract class cannot be instantiated directly",
                "Abstract classes cannot have methods",
                "start() must return int",
                "Vehicle must extend Object manually"
            ],
            answer:
                "An abstract class cannot be instantiated directly"
        },

        {
            code: `class Person {

    Person(String name) {}

    public static void main(String[] args) {
        Person p = new Person();
    }
}`,
            options: [
                "There is no matching no-argument constructor",
                "Constructors cannot take String",
                "main cannot create objects",
                "Person must be abstract"
            ],
            answer:
                "There is no matching no-argument constructor"
        },

        {
            code: `class Parent {
    private void show() {}
}

class Child extends Parent {

    @Override
    void show() {}
}`,
            options: [
                "A private parent method cannot be overridden",
                "Override is only for constructors",
                "Child cannot extend Parent",
                "show must return int"
            ],
            answer:
                "A private parent method cannot be overridden"
        }

    ],


    "Exception Debugging": [

        {
            code: `try {
    int x = 10 / 0;
}`,
            options: [
                "A try block needs catch or finally",
                "Division is not allowed in Java",
                "try must return a value",
                "x must be String"
            ],
            answer:
                "A try block needs catch or finally"
        },

        {
            code: `try {
    System.out.println("Hello");
}
catch (String e) {
    System.out.println(e);
}`,
            options: [
                "catch parameter must be Throwable or one of its subclasses",
                "String cannot be printed",
                "try cannot contain println",
                "catch must come before try"
            ],
            answer:
                "catch parameter must be Throwable or one of its subclasses"
        },

        {
            code: `void test() {
    throw new Exception();
}`,
            options: [
                "The checked exception must be caught or declared",
                "throw cannot be used inside a method",
                "Exception cannot be created",
                "test must return Exception"
            ],
            answer:
                "The checked exception must be caught or declared"
        },

        {
            code: `try {
    int[] a = new int[2];
    System.out.println(a[5]);
}
catch (ArithmeticException e) {
    System.out.println("Handled");
}`,
            options: [
                "The catch type does not handle ArrayIndexOutOfBoundsException",
                "Arrays cannot be inside try",
                "The array must contain five values",
                "ArithmeticException handles every exception"
            ],
            answer:
                "The catch type does not handle ArrayIndexOutOfBoundsException"
        },

        {
            code: `throw Exception;`,
            options: [
                "throw requires an exception object",
                "throw must always be inside catch",
                "Exception must be lowercase",
                "throw is not a Java keyword"
            ],
            answer:
                "throw requires an exception object"
        }

    ],


    "File Handling Challenge": [

        {
            code: `FileReader reader =
    new FileReader("data.txt");

reader.write("Hello");`,
            options: [
                "FileReader is for reading, not writing",
                "FileReader cannot open files",
                "write requires an int variable only",
                "Java does not support text files"
            ],
            answer:
                "FileReader is for reading, not writing"
        },

        {
            code: `FileWriter writer =
    new FileWriter("data.txt");

writer.read();`,
            options: [
                "FileWriter does not provide read() for reading file content",
                "FileWriter cannot create files",
                "read() only works with String",
                "FileWriter must extend Scanner"
            ],
            answer:
                "FileWriter does not provide read() for reading file content"
        },

        {
            code: `FileReader reader =
    new FileReader("data.txt");`,
            options: [
                "FileNotFoundException/IOException must be handled or declared",
                "FileReader cannot take a filename",
                "data.txt must be an integer",
                "FileReader has no constructor"
            ],
            answer:
                "FileNotFoundException/IOException must be handled or declared"
        },

        {
            code: `FileWriter writer =
    new FileWriter("data.txt");

writer.write("Hello");

// program ends without closing writer`,
            options: [
                "The writer should be closed or managed with try-with-resources",
                "write() automatically deletes the file",
                "FileWriter cannot write Strings",
                "Nothing should ever close a writer"
            ],
            answer:
                "The writer should be closed or managed with try-with-resources"
        },

        {
            code: `File file = new File("data.txt");

System.out.println(file.length);`,
            options: [
                "length is a method and should be called as length()",
                "File has no length information",
                "File cannot represent text files",
                "length requires a String argument"
            ],
            answer:
                "length is a method and should be called as length()"
        }

    ]

};


// =====================================================
// DEBUGGING ENGINE
// =====================================================

const debuggingContainer =
    document.getElementById(
        "debugging-container"
    );

const debuggingCode =
    document.getElementById(
        "debugging-code"
    );

const debuggingOptions =
    document.getElementById(
        "debugging-options"
    );

const debuggingFeedback =
    document.getElementById(
        "debugging-feedback"
    );

const nextDebuggingButton =
    document.getElementById(
        "next-debugging-btn"
    );

const debuggingQuestions =
    debuggingData[
        currentActivityName
    ] || [];

let currentDebuggingIndex = 0;
let debuggingScore = 0;
let debuggingAnswered = false;


function loadDebuggingQuestion() {

    if (
        debuggingQuestions.length === 0 ||
        !debuggingCode ||
        !debuggingOptions ||
        !debuggingFeedback ||
        !nextDebuggingButton
    ) {
        return;
    }

    const question =
        debuggingQuestions[
            currentDebuggingIndex
        ];

    debuggingCode.textContent =
        question.code;

    debuggingOptions.innerHTML = "";

    debuggingFeedback.textContent = "";

    debuggingAnswered = false;

    nextDebuggingButton.classList.add(
        "hidden"
    );

    question.options.forEach(
        option => {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.textContent = option;

            button.classList.add(
                "debugging-option"
            );

            button.addEventListener(
                "click",
                () => {

                    checkDebuggingAnswer(
                        option
                    );

                }
            );

            debuggingOptions.appendChild(
                button
            );

        }
    );

}


function checkDebuggingAnswer(
    selectedAnswer
) {

    if (debuggingAnswered) {
        return;
    }

    debuggingAnswered = true;

    const question =
        debuggingQuestions[
            currentDebuggingIndex
        ];

    debuggingOptions
        .querySelectorAll("button")
        .forEach(
            button => {
                button.disabled = true;
            }
        );


    if (
        selectedAnswer ===
        question.answer
    ) {

        debuggingScore++;

        debuggingFeedback.textContent =
            "Correct!";

    } else {

        debuggingFeedback.textContent =
            "Incorrect. Correct answer: " +
            question.answer;

    }


    nextDebuggingButton.classList.remove(
        "hidden"
    );


    if (
        currentDebuggingIndex ===
        debuggingQuestions.length - 1
    ) {

        nextDebuggingButton.textContent =
            "View Result";

    } else {

        nextDebuggingButton.textContent =
            "Next Problem";

    }

}


if (nextDebuggingButton) {

    nextDebuggingButton.addEventListener(
        "click",
        () => {

            currentDebuggingIndex++;

            if (
                currentDebuggingIndex <
                debuggingQuestions.length
            ) {

                loadDebuggingQuestion();

            } else {

                finishDebugging();

            }

        }
    );

}


function finishDebugging() {

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

    debuggingCode.textContent = "";

    debuggingOptions.innerHTML = "";

    nextDebuggingButton.classList.add(
        "hidden"
    );

    debuggingFeedback.textContent =
        `Score: ${debuggingScore} / ${debuggingQuestions.length} (${percentage}%)`;


    if (percentage >= 50) {

        markCurrentActivityCompleted();

        debuggingFeedback.textContent +=
            " — Activity completed!";

    } else {

        debuggingFeedback.textContent +=
            " — You need at least 50% to complete this activity.";

    }

}

// =====================================================
// CODE ORDERING DATA
// =====================================================

const codeOrderingData = {

    "Multiple Catch Blocks": [

        {
            lines: [
                "try {",
                "    int number = Integer.parseInt(\"abc\");",
                "} catch (NumberFormatException e) {",
                "    System.out.println(\"Invalid number\");",
                "}"
            ]
        },

        {
            lines: [
                "try {",
                "    int result = 10 / 0;",
                "} catch (ArithmeticException e) {",
                "    System.out.println(\"Cannot divide by zero\");",
                "}"
            ]
        },

        {
            lines: [
                "try {",
                "    int[] numbers = {1, 2};",
                "    System.out.println(numbers[5]);",
                "} catch (ArrayIndexOutOfBoundsException e) {",
                "    System.out.println(\"Invalid index\");",
                "}"
            ]
        },

        {
            lines: [
                "try {",
                "    int value = Integer.parseInt(\"Java\");",
                "} catch (NumberFormatException e) {",
                "    System.out.println(\"Number error\");",
                "} catch (Exception e) {",
                "    System.out.println(\"General error\");",
                "}"
            ]
        },

        {
            lines: [
                "try {",
                "    String text = null;",
                "    System.out.println(text.length());",
                "} catch (NullPointerException e) {",
                "    System.out.println(\"Null value\");",
                "}"
            ]
        }

    ],


    "Reading Files": [

        {
            lines: [
                "FileReader reader = new FileReader(\"data.txt\");",
                "int data = reader.read();",
                "System.out.println((char) data);",
                "reader.close();"
            ]
        },

        {
            lines: [
                "BufferedReader reader = new BufferedReader(",
                "    new FileReader(\"data.txt\")",
                ");",
                "String line = reader.readLine();",
                "System.out.println(line);",
                "reader.close();"
            ]
        },

        {
            lines: [
                "File file = new File(\"data.txt\");",
                "Scanner scanner = new Scanner(file);",
                "String text = scanner.nextLine();",
                "System.out.println(text);",
                "scanner.close();"
            ]
        },

        {
            lines: [
                "FileReader reader = new FileReader(\"data.txt\");",
                "int character;",
                "while ((character = reader.read()) != -1) {",
                "    System.out.print((char) character);",
                "}",
                "reader.close();"
            ]
        },

        {
            lines: [
                "BufferedReader reader = new BufferedReader(",
                "    new FileReader(\"data.txt\")",
                ");",
                "String line;",
                "while ((line = reader.readLine()) != null) {",
                "    System.out.println(line);",
                "}",
                "reader.close();"
            ]
        }

    ]

};


// =====================================================
// CODE ORDERING ENGINE
// =====================================================

const codeOrderingContainer =
    document.getElementById(
        "code-ordering-container"
    );

const codeOrderingLines =
    document.getElementById(
        "code-ordering-lines"
    );

const selectedCodeOrder =
    document.getElementById(
        "selected-code-order"
    );

const resetCodeOrderButton =
    document.getElementById(
        "reset-code-order-btn"
    );

const checkCodeOrderButton =
    document.getElementById(
        "check-code-order-btn"
    );

const codeOrderingFeedback =
    document.getElementById(
        "code-ordering-feedback"
    );

const nextCodeOrderButton =
    document.getElementById(
        "next-code-order-btn"
    );

const codeOrderingQuestions =
    codeOrderingData[
        currentActivityName
    ] || [];

let currentCodeOrderingIndex = 0;

let selectedOrderingLines = [];

let codeOrderingScore = 0;

let codeOrderingAnswered = false;


function shuffleArray(array) {

    const copiedArray = [...array];

    for (
        let i = copiedArray.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() * (i + 1)
            );

        const temporaryValue =
            copiedArray[i];

        copiedArray[i] =
            copiedArray[randomIndex];

        copiedArray[randomIndex] =
            temporaryValue;
    }

    return copiedArray;
}


function loadCodeOrderingQuestion() {

    if (
        codeOrderingQuestions.length === 0 ||
        !codeOrderingLines ||
        !selectedCodeOrder ||
        !codeOrderingFeedback ||
        !nextCodeOrderButton
    ) {
        return;
    }

    const question =
        codeOrderingQuestions[
            currentCodeOrderingIndex
        ];

    selectedOrderingLines = [];

    codeOrderingAnswered = false;

    codeOrderingLines.innerHTML = "";

    selectedCodeOrder.innerHTML = "";

    codeOrderingFeedback.textContent = "";

    nextCodeOrderButton.classList.add(
        "hidden"
    );

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

            button.type = "button";

            button.textContent = line;

            button.classList.add(
                "code-order-line"
            );

            button.addEventListener(
                "click",
                () => {

                    if (
                        codeOrderingAnswered
                    ) {
                        return;
                    }

                    selectedOrderingLines.push(
                        line
                    );

                    button.disabled = true;

                    displaySelectedCodeOrder();

                }
            );

            codeOrderingLines.appendChild(
                button
            );

        }
    );

}


function displaySelectedCodeOrder() {

    selectedCodeOrder.innerHTML = "";

    selectedOrderingLines.forEach(
        (line, index) => {

            const lineElement =
                document.createElement(
                    "div"
                );

            lineElement.classList.add(
                "selected-order-line"
            );

            lineElement.textContent =
                `${index + 1}. ${line}`;

            selectedCodeOrder.appendChild(
                lineElement
            );

        }
    );

}


if (resetCodeOrderButton) {

    resetCodeOrderButton.addEventListener(
        "click",
        () => {

            if (codeOrderingAnswered) {
                return;
            }

            loadCodeOrderingQuestion();

        }
    );

}


if (checkCodeOrderButton) {

    checkCodeOrderButton.addEventListener(
        "click",
        () => {

            if (
                codeOrderingAnswered ||
                codeOrderingQuestions.length === 0
            ) {
                return;
            }

            const question =
                codeOrderingQuestions[
                    currentCodeOrderingIndex
                ];

            if (
                selectedOrderingLines.length !==
                question.lines.length
            ) {

                codeOrderingFeedback.textContent =
                    "Please select every code line first.";

                return;
            }

            codeOrderingAnswered = true;

            const isCorrect =
                selectedOrderingLines.every(
                    (line, index) =>
                        line ===
                        question.lines[index]
                );

            if (isCorrect) {

                codeOrderingScore++;

                codeOrderingFeedback.textContent =
                    "Correct order!";

            } else {

                codeOrderingFeedback.textContent =
                    "Incorrect order.";

            }

            nextCodeOrderButton.classList.remove(
                "hidden"
            );

            if (
                currentCodeOrderingIndex ===
                codeOrderingQuestions.length - 1
            ) {

                nextCodeOrderButton.textContent =
                    "View Result";

            } else {

                nextCodeOrderButton.textContent =
                    "Next Puzzle";

            }

        }
    );

}


if (nextCodeOrderButton) {

    nextCodeOrderButton.addEventListener(
        "click",
        () => {

            currentCodeOrderingIndex++;

            if (
                currentCodeOrderingIndex <
                codeOrderingQuestions.length
            ) {

                loadCodeOrderingQuestion();

            } else {

                finishCodeOrdering();

            }

        }
    );

}


function finishCodeOrdering() {

    const percentage =
        Math.round(
            (
                codeOrderingScore /
                codeOrderingQuestions.length
            ) * 100
        );

    codeOrderingLines.innerHTML = "";

    selectedCodeOrder.innerHTML = "";

    nextCodeOrderButton.classList.add(
        "hidden"
    );

    checkCodeOrderButton.disabled = true;

    resetCodeOrderButton.disabled = true;

    codeOrderingFeedback.textContent =
        `Score: ${codeOrderingScore} / ${codeOrderingQuestions.length} (${percentage}%)`;

    if (percentage >= 50) {

        markCurrentActivityCompleted();

        codeOrderingFeedback.textContent +=
            " — Activity completed!";

    } else {

        codeOrderingFeedback.textContent +=
            " — You need at least 50% to complete this activity.";

    }

}

// =====================================================
// CODE CHALLENGE DATA
// =====================================================

const codeChallengeData = {

    "Multithreading Challenge": [

        {
            question:
                "Create a new Thread object using the class MyThread.",

            starter:
`class MyThread extends Thread {
    public void run() {
        System.out.println("Running");
    }
}

// Write one line below:`,

            answers: [
                "Thread t = new MyThread();",
                "MyThread t = new MyThread();"
            ]
        },

        {
            question:
                "Write the Java statement used to start the thread named t.",

            starter:
`Thread t = new MyThread();

// Write one line below:`,

            answers: [
                "t.start();"
            ]
        },

        {
            question:
                "Write the method declaration for a synchronized method named display that returns void.",

            starter:
`class Demo {

    // Write the method declaration below

}`,

            answers: [
                "synchronized void display()",
                "public synchronized void display()",
                "void synchronized display()"
            ]
        },

        {
            question:
                "Pause the current thread for 1000 milliseconds.",

            starter:
`try {

    // Write one line below

} catch (InterruptedException e) {

}`,

            answers: [
                "Thread.sleep(1000);"
            ]
        },

        {
            question:
                "Wait for thread t to finish before continuing.",

            starter:
`Thread t = new MyThread();

t.start();

// Write one line below:`,

            answers: [
                "t.join();"
            ]
        }

    ]

};


// =====================================================
// CODE CHALLENGE ENGINE
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

const codeChallengeQuestions =
    codeChallengeData[
        currentActivityName
    ] || [];

let currentCodeChallengeIndex = 0;

let codeChallengeScore = 0;

let codeChallengeAnswered = false;


function normalizeCode(code) {

    return code
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

}


function loadCodeChallenge() {

    if (
        codeChallengeQuestions.length === 0 ||
        !codeChallengeQuestion ||
        !codeChallengeStarter ||
        !codeChallengeAnswer ||
        !codeChallengeFeedback ||
        !nextCodeChallengeButton
    ) {
        return;
    }

    const challenge =
        codeChallengeQuestions[
            currentCodeChallengeIndex
        ];

    codeChallengeQuestion.textContent =
        challenge.question;

    codeChallengeStarter.textContent =
        challenge.starter;

    codeChallengeAnswer.value = "";

    codeChallengeAnswer.disabled = false;

    codeChallengeFeedback.textContent = "";

    codeChallengeAnswered = false;

    checkCodeChallengeButton.disabled = false;

    nextCodeChallengeButton.classList.add(
        "hidden"
    );

}


if (checkCodeChallengeButton) {

    checkCodeChallengeButton.addEventListener(
        "click",
        () => {

            if (
                codeChallengeAnswered ||
                codeChallengeQuestions.length === 0
            ) {
                return;
            }

            const userAnswer =
                codeChallengeAnswer.value;

            if (
                userAnswer.trim() === ""
            ) {

                codeChallengeFeedback.textContent =
                    "Please enter your Java code.";

                return;
            }

            const challenge =
                codeChallengeQuestions[
                    currentCodeChallengeIndex
                ];

            const normalizedUserAnswer =
                normalizeCode(
                    userAnswer
                );

            const isCorrect =
                challenge.answers.some(
                    answer =>
                        normalizeCode(answer) ===
                        normalizedUserAnswer
                );

            codeChallengeAnswered = true;

            codeChallengeAnswer.disabled = true;

            checkCodeChallengeButton.disabled = true;


            if (isCorrect) {

                codeChallengeScore++;

                codeChallengeFeedback.textContent =
                    "Correct code!";

            } else {

                codeChallengeFeedback.textContent =
                    "Not quite. One correct answer is: " +
                    challenge.answers[0];

            }


            nextCodeChallengeButton.classList.remove(
                "hidden"
            );


            if (
                currentCodeChallengeIndex ===
                codeChallengeQuestions.length - 1
            ) {

                nextCodeChallengeButton.textContent =
                    "View Result";

            } else {

                nextCodeChallengeButton.textContent =
                    "Next Challenge";

            }

        }
    );

}


if (nextCodeChallengeButton) {

    nextCodeChallengeButton.addEventListener(
        "click",
        () => {

            currentCodeChallengeIndex++;

            if (
                currentCodeChallengeIndex <
                codeChallengeQuestions.length
            ) {

                loadCodeChallenge();

            } else {

                finishCodeChallenge();

            }

        }
    );

}


function finishCodeChallenge() {

    const percentage =
        Math.round(
            (
                codeChallengeScore /
                codeChallengeQuestions.length
            ) * 100
        );

    codeChallengeQuestion.textContent =
        "Challenge Complete";

    codeChallengeStarter.textContent = "";

    codeChallengeAnswer.value = "";

    codeChallengeAnswer.disabled = true;

    checkCodeChallengeButton.disabled = true;

    nextCodeChallengeButton.classList.add(
        "hidden"
    );

    codeChallengeFeedback.textContent =
        `Score: ${codeChallengeScore} / ${codeChallengeQuestions.length} (${percentage}%)`;

    if (percentage >= 50) {

        markCurrentActivityCompleted();

        codeChallengeFeedback.textContent +=
            " — Activity completed!";

    } else {

        codeChallengeFeedback.textContent +=
            " — You need at least 50% to complete this activity.";

    }

}

// =====================================================
// 17. LOAD CORRECT GAME
// =====================================================

function loadActivityGame() {

    const activityType =
        activityTypeMap[
            currentActivityName
        ];


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

    if (trueFalseContainer) {
        trueFalseContainer.classList.add(
            "hidden"
        );
    }

    if (codeOutputContainer) {
    codeOutputContainer.classList.add(
        "hidden"
    );
}

if (debuggingContainer) {
    debuggingContainer.classList.add(
        "hidden"
    );
}

if (codeOrderingContainer) {
    codeOrderingContainer.classList.add(
        "hidden"
    );
}

if (codeChallengeContainer) {
    codeChallengeContainer.classList.add(
        "hidden"
    );
}

    if (
        activityType === "quiz" &&
        quizContainer
    ) {

        quizContainer.classList.remove(
            "hidden"
        );

        loadQuizQuestion();

    }

    else if (
        activityType === "fill" &&
        fillBlankContainer
    ) {

        fillBlankContainer.classList.remove(
            "hidden"
        );

        loadFillBlankQuestion();

    }

    else if (
        activityType === "matching" &&
        matchingContainer
    ) {

        matchingContainer.classList.remove(
            "hidden"
        );

        loadMatchingGame();

    }

    else if (
        activityType === "true-false" &&
        trueFalseContainer
    ) {

        trueFalseContainer.classList.remove(
            "hidden"
        );

        loadTrueFalseQuestion();

    }

    else if (
    activityType === "code-output" &&
    codeOutputContainer
) {

    codeOutputContainer.classList.remove(
        "hidden"
    );

    loadCodeOutputQuestion();

}

else if (
    activityType === "debugging" &&
    debuggingContainer
) {

    debuggingContainer.classList.remove(
        "hidden"
    );

    loadDebuggingQuestion();

}

else if (
    activityType === "code-ordering" &&
    codeOrderingContainer
) {

    codeOrderingContainer.classList.remove(
        "hidden"
    );

    loadCodeOrderingQuestion();

}

else if (
    activityType === "code-challenge" &&
    codeChallengeContainer
) {

    codeChallengeContainer.classList.remove(
        "hidden"
    );

    loadCodeChallenge();

}

    else {

        console.log(
            "Game engine not implemented yet:",
            activityType,
            currentActivityName
        );

    }

}


// =====================================================
// 18. INITIALIZE PAGE
// =====================================================

updateCompleteButton();

loadActivityGame();