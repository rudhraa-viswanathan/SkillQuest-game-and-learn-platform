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




let activityAttemptStarted =
    false;


    let backendActivity = null;
let backendQuestions = [];

async function loadActivityFromBackend() {

    if (!currentActivityId) {
        console.error("Activity ID is missing from URL.");
        return false;
    }

    try {

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


        const questionsResponse =
            await authenticatedFetch(
                `/activity-questions/activity/${currentActivityId}`
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
            "Backend Questions:",
            backendQuestions
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

function displayBackendActivity() {

    if (!backendActivity) {
        return;
    }

    if (activityTitle) {
        activityTitle.textContent =
            backendActivity.title;
    }

    const description =
        document.getElementById(
            "activity-description"
        );

    if (description) {
        description.textContent =
            backendActivity.description ||
            "Complete this activity.";
    }

    console.log(
        "Activity Type:",
        backendActivity.type
    );

    console.log(
        "Questions Loaded:",
        backendQuestions.length
    );
}

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
        currentCourseName + " Activity";

}

if (topicTitle) {

    topicTitle.textContent =
        currentTopicName ||
        currentCourseName + " Course";

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

    if (!currentActivityId) {

        console.error(
            "Activity ID is missing."
        );

        return;
    }


    completeButton.disabled =
        false;

    completeButton.textContent =
        "Complete Activity";

    completeButton.classList.add(
        "activity-completed-btn"
    );

}


async function submitActivityResult(
    scorePercentage
) {

    if (!currentActivityId) {

        console.error(
            "Activity ID is missing."
        );

        return null;
    }


    const resultData = {
        activityId: currentActivityId,
        scorePercentage: scorePercentage
    };


    try {

        const response =
            await authenticatedFetch(
                "/game-stats/result",
                {
                    method: "POST",
                    body: JSON.stringify(
                        resultData
                    )
                }
            );


        if (!response.ok) {

            let errorMessage =
                "Unable to submit activity result.";

            try {

                const errorData =
                    await response.json();

                if (errorData.message) {
                    errorMessage =
                        errorData.message;
                }

            } catch (error) {

                console.error(
                    "Could not read result error:",
                    error
                );
            }


            alert(errorMessage);

            return null;
        }


        const result =
            await response.json();


        console.log(
            "Activity result:",
            result
        );


        if (scorePercentage >= 60) {

            markCurrentActivityCompleted();

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
    async function () {

        if (!currentActivityId) {
            alert("Activity ID is missing.");
            return;
        }

        completeButton.disabled = true;

        try {

           const response =
    await authenticatedFetch(
        `/progress/activities/${currentActivityId}/complete`,
        {
            method: "POST"
        }
    );

let responseData = null;

try {
    responseData = await response.json();
} catch (error) {
    // Response may not contain JSON
}

if (!response.ok) {

    const message =
        responseData?.message ||
        "Unable to complete activity.";

    if (
        !message
            .toLowerCase()
            .includes("already completed")
    ) {

        alert(message);

        completeButton.disabled = false;

        return;
    }
}

completeButton.textContent =
    "Activity Completed ✓";

completeButton.classList.add(
    "activity-completed-btn"
);

            setTimeout(() => {

                if (
                    backendActivity &&
                    backendActivity.topicId
                ) {

                    const topicId =
                        Number(
                            backendActivity.topicId
                        );

                    // Java topics: 6 - 11
                    if (
                        topicId >= 6 &&
                        topicId <= 11
                    ) {

                        window.location.assign(
                            "java-course.html"
                        );

                    }

                    // SQL topics: 12 - 17
                    else if (
                        topicId >= 12 &&
                        topicId <= 17
                    ) {

                        window.location.assign(
                            "sql-course.html"
                        );

                    }

                    // Web topics: 18 - 23
                    else if (
                        topicId >= 18 &&
                        topicId <= 23
                    ) {

                        window.location.assign(
                            "web-course.html"
                        );

                    }

                }

            }, 800);


        } catch (error) {

            console.error(
                "Activity completion error:",
                error
            );

            alert(
                "Unable to complete activity."
            );

            completeButton.disabled =
                false;
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

            if (
                !backendActivity ||
                !backendActivity.topicId
            ) {
                console.error(
                    "Unable to determine activity topic."
                );
                return;
            }

            const topicId =
                Number(backendActivity.topicId);

            // Java
            if (
                topicId >= 6 &&
                topicId <= 11
            ) {

                window.location.assign(
                    "java-course.html"
                );

            }

            // SQL
            else if (
                topicId >= 12 &&
                topicId <= 17
            ) {

                window.location.assign(
                    "sql-course.html"
                );

            }

            // Web Development
            else if (
                topicId >= 18 &&
                topicId <= 23
            ) {

                window.location.assign(
                    "web-course.html"
                );

            }

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
// SQL ACTIVITY TYPE MAP
// =====================================================

const sqlActivityTypeMap = {

    // SQL FUNDAMENTALS
    "Introduction to SQL": "quiz",
    "Data Types": "matching",
    "Constraints": "fill",
    "SQL Fundamentals Challenge": "true-false",

    // CRUD OPERATIONS
    "INSERT": "fill",
    "SELECT": "quiz",
    "UPDATE": "code-output",
    "DELETE & CRUD Challenge": "debugging",

    // FILTERING & FUNCTIONS
    "WHERE & Comparison Operators": "quiz",
    "AND, OR & NOT": "code-output",
    "LIKE, IN & BETWEEN": "fill",
    "SQL Functions Challenge": "matching",

    // JOINS
    "INNER JOIN": "quiz",
    "LEFT JOIN": "code-output",
    "RIGHT JOIN": "matching",
    "Multiple Table Joins": "code-ordering",
    "Join Debugging Challenge": "debugging",

    // SUBQUERIES & AGGREGATION
    "Aggregate Functions": "matching",
    "GROUP BY": "code-output",
    "HAVING": "fill",
    "Subqueries": "code-ordering",
    "Aggregation Challenge": "debugging",

    // ADVANCED SQL
    "Primary & Foreign Keys": "quiz",
    "Views": "true-false",
    "Indexes": "matching",
    "Window Functions": "code-output",
    "Advanced SQL Challenge": "code-challenge"

};


const webActivityTypeMap = {

    // HTML FUNDAMENTALS
    "HTML Structure": "quiz",
    "Text & Headings": "fill",
    "Links & Images": "code-output",
    "HTML Fundamentals Challenge": "true-false",

    // HTML FORMS & SEMANTIC HTML
    "Lists & Tables": "code-ordering",
    "Forms & Inputs": "matching",
    "Semantic HTML": "quiz",
    "HTML Debugging Challenge": "debugging",

    // CSS FUNDAMENTALS
    "CSS Selectors": "quiz",
    "Colors & Typography": "matching",
    "Box Model": "fill",
    "CSS Fundamentals Challenge": "true-false",

    // CSS LAYOUT & RESPONSIVE DESIGN
    "Flexbox": "matching",
    "CSS Grid": "code-output",
    "Positioning": "quiz",
    "Media Queries": "fill",
    "Responsive CSS Challenge": "debugging",

    // JAVASCRIPT FUNDAMENTALS
    "JavaScript Variables & Data Types": "quiz",
    "Operators & Conditions": "code-output",
    "Loops": "code-ordering",
    "Functions": "fill",
    "JavaScript Fundamentals Challenge": "debugging",

    // DOM & EVENTS
    "DOM Selection": "quiz",
    "Changing DOM Content": "code-output",
    "Event Listeners": "code-ordering",
    "Creating Elements": "matching",
    "DOM Challenge": "code-challenge"

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

    ],

    // =====================================================
// SQL QUIZ DATA
// =====================================================

"Introduction to SQL": [

    {
        question:
            "What does SQL stand for?",

        options: [
            "Structured Query Language",
            "Simple Query Language",
            "System Query Logic",
            "Structured Question Language"
        ],

        answer:
            "Structured Query Language"
    },

    {
        question:
            "Which SQL command is mainly used to retrieve data from a table?",

        options: [
            "SELECT",
            "INSERT",
            "UPDATE",
            "DELETE"
        ],

        answer:
            "SELECT"
    },

    {
        question:
            "Which database object stores data in rows and columns?",

        options: [
            "Table",
            "Query",
            "Index",
            "View"
        ],

        answer:
            "Table"
    },

    {
        question:
            "Which clause specifies the table from which data should be retrieved?",

        options: [
            "FROM",
            "WHERE",
            "ORDER BY",
            "VALUES"
        ],

        answer:
            "FROM"
    },

    {
        question:
            "Which symbol is commonly used with SELECT to retrieve all columns?",

        options: [
            "*",
            "#",
            "%",
            "&"
        ],

        answer:
            "*"
    }

],


"SELECT": [

    {
        question:
            "Which query retrieves every column from the students table?",

        options: [
            "SELECT * FROM students;",
            "SELECT ALL students;",
            "GET * FROM students;",
            "SHOW students ALL;"
        ],

        answer:
            "SELECT * FROM students;"
    },

    {
        question:
            "Which query retrieves only the name column from employees?",

        options: [
            "SELECT name FROM employees;",
            "SELECT employees FROM name;",
            "GET name employees;",
            "SHOW name IN employees;"
        ],

        answer:
            "SELECT name FROM employees;"
    },

    {
        question:
            "Which keyword can remove duplicate rows from a SELECT result?",

        options: [
            "DISTINCT",
            "UNIQUE",
            "REMOVE",
            "DIFFERENT"
        ],

        answer:
            "DISTINCT"
    },

    {
        question:
            "Which query retrieves the name and salary columns from employees?",

        options: [
            "SELECT name, salary FROM employees;",
            "SELECT name AND salary FROM employees;",
            "GET name, salary FROM employees;",
            "SELECT employees FROM name, salary;"
        ],

        answer:
            "SELECT name, salary FROM employees;"
    },

    {
        question:
            "Which clause is used to sort the result of a SELECT query?",

        options: [
            "ORDER BY",
            "SORT BY",
            "GROUP BY",
            "ARRANGE BY"
        ],

        answer:
            "ORDER BY"
    }

],


"WHERE & Comparison Operators": [

    {
        question:
            "Which clause is used to filter rows in SQL?",

        options: [
            "WHERE",
            "FROM",
            "ORDER BY",
            "VALUES"
        ],

        answer:
            "WHERE"
    },

    {
        question:
            "Which operator means greater than or equal to?",

        options: [
            ">=",
            "<=",
            "<>",
            "=="
        ],

        answer:
            ">="
    },

    {
        question:
            "Which SQL operator means not equal to?",

        options: [
            "<>",
            "=",
            ">=",
            "=>"
        ],

        answer:
            "<>"
    },

    {
        question:
            "Which condition selects employees whose salary is greater than 50000?",

        options: [
            "WHERE salary > 50000",
            "WHERE salary < 50000",
            "WHERE salary =< 50000",
            "WHERE salary <> 50000"
        ],

        answer:
            "WHERE salary > 50000"
    },

    {
        question:
            "Which condition selects a student whose id is exactly 10?",

        options: [
            "WHERE id = 10",
            "WHERE id == 10",
            "WHERE id := 10",
            "WHERE id IS 10"
        ],

        answer:
            "WHERE id = 10"
    }

],


"INNER JOIN": [

    {
        question:
            "What does an INNER JOIN return?",

        options: [
            "Rows that have matching values in both tables",
            "Every row from the left table only",
            "Every row from both tables regardless of matches",
            "Only rows containing NULL"
        ],

        answer:
            "Rows that have matching values in both tables"
    },

    {
        question:
            "Which keyword is commonly used to specify a JOIN condition?",

        options: [
            "ON",
            "WHERE",
            "IN",
            "BY"
        ],

        answer:
            "ON"
    },

    {
        question:
            "Which syntax correctly joins employees and departments using department_id?",

        options: [
            "INNER JOIN departments ON employees.department_id = departments.department_id",
            "INNER departments WITH employees.department_id",
            "JOIN departments BY department_id",
            "INNER JOIN departments WHERE department_id"
        ],

        answer:
            "INNER JOIN departments ON employees.department_id = departments.department_id"
    },

    {
        question:
            "If a row has no matching row in the other table, what happens to it in an INNER JOIN?",

        options: [
            "It is not included in the result",
            "It is always included",
            "It is converted to zero",
            "SQL automatically creates a matching row"
        ],

        answer:
            "It is not included in the result"
    },

    {
        question:
            "Which columns are normally used to create relationships between joined tables?",

        options: [
            "Primary and foreign key columns",
            "Only text columns",
            "Only date columns",
            "Random columns"
        ],

        answer:
            "Primary and foreign key columns"
    }

],


"Primary & Foreign Keys": [

    {
        question:
            "What is the main purpose of a primary key?",

        options: [
            "To uniquely identify each row",
            "To sort every table automatically",
            "To store duplicate values",
            "To delete related tables"
        ],

        answer:
            "To uniquely identify each row"
    },

    {
        question:
            "Can a primary key contain NULL?",

        options: [
            "No",
            "Yes",
            "Only in MySQL",
            "Only for text columns"
        ],

        answer:
            "No"
    },

    {
        question:
            "What is the main purpose of a foreign key?",

        options: [
            "To create a relationship between tables",
            "To automatically encrypt a column",
            "To sort rows",
            "To rename a table"
        ],

        answer:
            "To create a relationship between tables"
    },

    {
        question:
            "A foreign key usually references which key in another table?",

        options: [
            "Primary key",
            "Temporary key",
            "Sort key",
            "Search key"
        ],

        answer:
            "Primary key"
    },

    {
        question:
            "Which constraint prevents duplicate primary-key values?",

        options: [
            "PRIMARY KEY",
            "DEFAULT",
            "CHECK",
            "ORDER BY"
        ],

        answer:
            "PRIMARY KEY"
    }

],

// =====================================================
// WEB DEVELOPMENT - QUIZ DATA
// =====================================================

"HTML Structure": [

    {
        question:
            "Which declaration tells the browser that the document uses HTML5?",
        options: [
            "<!DOCTYPE html>",
            "<html5>",
            "<doctype>",
            "<document html>"
        ],
        answer:
            "<!DOCTYPE html>"
    },

    {
        question:
            "Which HTML element is the root element of an HTML document?",
        options: [
            "<html>",
            "<body>",
            "<head>",
            "<main>"
        ],
        answer:
            "<html>"
    },

    {
        question:
            "Which section contains metadata, the page title and links to stylesheets?",
        options: [
            "<head>",
            "<body>",
            "<footer>",
            "<section>"
        ],
        answer:
            "<head>"
    },

    {
        question:
            "Which HTML element contains the content normally displayed on the webpage?",
        options: [
            "<body>",
            "<head>",
            "<title>",
            "<meta>"
        ],
        answer:
            "<body>"
    },

    {
        question:
            "Which element is used to define the title shown on the browser tab?",
        options: [
            "<title>",
            "<header>",
            "<h1>",
            "<meta>"
        ],
        answer:
            "<title>"
    }

],


"Semantic HTML": [

    {
        question:
            "Which semantic element is commonly used for the main navigation links?",
        options: [
            "<nav>",
            "<div>",
            "<span>",
            "<link>"
        ],
        answer:
            "<nav>"
    },

    {
        question:
            "Which semantic element represents the main content of a document?",
        options: [
            "<main>",
            "<body>",
            "<content>",
            "<section-main>"
        ],
        answer:
            "<main>"
    },

    {
        question:
            "Which semantic element is commonly used for introductory content at the top of a page or section?",
        options: [
            "<header>",
            "<top>",
            "<head>",
            "<intro>"
        ],
        answer:
            "<header>"
    },

    {
        question:
            "Which semantic element is appropriate for self-contained content such as a blog post?",
        options: [
            "<article>",
            "<div>",
            "<span>",
            "<aside-content>"
        ],
        answer:
            "<article>"
    },

    {
        question:
            "Which semantic element is commonly used for information at the bottom of a page?",
        options: [
            "<footer>",
            "<bottom>",
            "<end>",
            "<aside>"
        ],
        answer:
            "<footer>"
    }

],


// =====================================================
// WEB DEVELOPMENT - CSS QUIZ DATA
// =====================================================

"CSS Selectors": [

    {
        question:
            "Which CSS selector targets all <p> elements?",
        options: [
            "p",
            ".p",
            "#p",
            "*p"
        ],
        answer:
            "p"
    },

    {
        question:
            "Which symbol is used to select an element by its class?",
        options: [
            ".",
            "#",
            "*",
            "@"
        ],
        answer:
            "."
    },

    {
        question:
            "Which symbol is used to select an element by its id?",
        options: [
            "#",
            ".",
            "@",
            "&"
        ],
        answer:
            "#"
    },

    {
        question:
            "Which selector targets every element on the page?",
        options: [
            "*",
            "all",
            "#",
            "."
        ],
        answer:
            "*"
    },

    {
        question:
            "Which selector targets all <p> elements inside a <div>?",
        options: [
            "div p",
            "div.p",
            "div + p",
            "#div p"
        ],
        answer:
            "div p"
    }

],


// =====================================================
// WEB DEVELOPMENT - CSS POSITIONING QUIZ DATA
// =====================================================

"Positioning": [

    {
        question:
            "Which CSS position value keeps an element in the normal document flow?",
        options: [
            "static",
            "absolute",
            "fixed",
            "sticky"
        ],
        answer:
            "static"
    },

    {
        question:
            "Which position value allows an element to be moved relative to its normal position?",
        options: [
            "relative",
            "fixed",
            "static",
            "absolute"
        ],
        answer:
            "relative"
    },

    {
        question:
            "An absolutely positioned element is normally positioned relative to what?",
        options: [
            "Its nearest positioned ancestor",
            "The mouse pointer",
            "The footer",
            "The previous paragraph"
        ],
        answer:
            "Its nearest positioned ancestor"
    },

    {
        question:
            "Which position value keeps an element in the same place even when the page is scrolled?",
        options: [
            "fixed",
            "relative",
            "static",
            "inherit"
        ],
        answer:
            "fixed"
    },

    {
        question:
            "Which CSS property controls which positioned element appears in front when elements overlap?",
        options: [
            "z-index",
            "display",
            "overflow",
            "opacity"
        ],
        answer:
            "z-index"
    }

],

// =====================================================
// WEB DEVELOPMENT - JAVASCRIPT QUIZ DATA
// =====================================================

"JavaScript Variables & Data Types": [

    {
        question:
            "Which keyword creates a block-scoped variable whose value can be reassigned?",
        options: [
            "let",
            "const",
            "static",
            "define"
        ],
        answer:
            "let"
    },

    {
        question:
            "Which keyword creates a variable that cannot be reassigned after initialization?",
        options: [
            "const",
            "let",
            "var",
            "change"
        ],
        answer:
            "const"
    },

    {
        question:
            "Which JavaScript data type represents true or false values?",
        options: [
            "Boolean",
            "String",
            "Number",
            "Object"
        ],
        answer:
            "Boolean"
    },

    {
        question:
            "What is the data type of the value \"SkillQuest\" in JavaScript?",
        options: [
            "String",
            "Number",
            "Boolean",
            "Undefined"
        ],
        answer:
            "String"
    },

    {
        question:
            "Which value represents a variable that has been declared but has not yet been assigned a value?",
        options: [
            "undefined",
            "true",
            "0",
            "empty"
        ],
        answer:
            "undefined"
    }

],


// =====================================================
// WEB DEVELOPMENT - DOM SELECTION QUIZ
// =====================================================

"DOM Selection": [

    {
        question:
            "Which method selects an HTML element using its id?",
        options: [
            "document.getElementById()",
            "document.getElementsByClassName()",
            "document.querySelectorAll()",
            "document.createElement()"
        ],
        answer:
            "document.getElementById()"
    },

    {
        question:
            "Which method returns the first element that matches a CSS selector?",
        options: [
            "document.querySelector()",
            "document.querySelectorAll()",
            "document.getElementById()",
            "document.createElement()"
        ],
        answer:
            "document.querySelector()"
    },

    {
        question:
            "Which method returns all elements that match a CSS selector?",
        options: [
            "document.querySelectorAll()",
            "document.querySelector()",
            "document.getElementById()",
            "document.appendChild()"
        ],
        answer:
            "document.querySelectorAll()"
    },

    {
        question:
            "Which method selects elements using their class name?",
        options: [
            "document.getElementsByClassName()",
            "document.getElementById()",
            "document.createElement()",
            "document.addEventListener()"
        ],
        answer:
            "document.getElementsByClassName()"
    },

    {
        question:
            "Which selector should be passed to querySelector() to select an element with id=\"title\"?",
        options: [
            "#title",
            ".title",
            "title#",
            "*title"
        ],
        answer:
            "#title"
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

let quizQuestions = [];

let currentQuizIndex = 0;

let quizScore = 0;

let quizAnswered = false;


function loadQuizQuestion() {

    if (quizQuestions.length === 0) {
    quizQuestions = backendQuestions.map(q => ({
        question: q.question,
        options: q.options
            ? q.options.split("|")
            : [],
        answer: q.correctAnswer
    }));
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

    const backendResult =
    await submitActivityResult(
        percentage
    );


if (!backendResult) {

    quizFeedback.textContent +=
        " — Result could not be saved.";

    return;
}


if (percentage >= 60) {

    quizFeedback.textContent +=
        " — Activity completed!";

} else if (percentage >= 51) {

    quizFeedback.textContent +=
        " — Not passed. Half reward earned.";

} else {

    quizFeedback.textContent +=
        " — Not passed. Try again.";

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

    ],

    // =====================================================
// SQL FILL IN THE BLANK DATA
// =====================================================

"Constraints": [

    {
        question:
            "The ______ constraint uniquely identifies each row in a table.",

        answer:
            "PRIMARY KEY"
    },

    {
        question:
            "The ______ constraint prevents a column from storing NULL values.",

        answer:
            "NOT NULL"
    },

    {
        question:
            "The ______ constraint prevents duplicate values in a column.",

        answer:
            "UNIQUE"
    },

    {
        question:
            "The ______ constraint creates a relationship with a key in another table.",

        answer:
            "FOREIGN KEY"
    },

    {
        question:
            "The ______ constraint can restrict values using a condition.",

        answer:
            "CHECK"
    }

],


"INSERT": [

    {
        question:
            "The SQL keyword used to add a new row to a table is ______.",

        answer:
            "INSERT"
    },

    {
        question:
            "Complete the command: INSERT ______ students (name) VALUES ('Ravi');",

        answer:
            "INTO"
    },

    {
        question:
            "Complete the query: INSERT INTO students (name) ______ ('Ravi');",

        answer:
            "VALUES"
    },

    {
        question:
            "In INSERT INTO students (name, age), the words name and age are ______ names.",

        answer:
            "COLUMN"
    },

    {
        question:
            "SQL text values such as Ravi are normally enclosed in single ______.",

        answer:
            "QUOTES"
    }

],


"LIKE, IN & BETWEEN": [

    {
        question:
            "The ______ operator is used for pattern matching in SQL.",

        answer:
            "LIKE"
    },

    {
        question:
            "In LIKE patterns, the ______ symbol represents zero or more characters.",

        answer:
            "%"
    },

    {
        question:
            "The ______ operator checks whether a value exists in a list of values.",

        answer:
            "IN"
    },

    {
        question:
            "The ______ operator selects values within an inclusive range.",

        answer:
            "BETWEEN"
    },

    {
        question:
            "Complete the condition: name ______ 'R%' to find names beginning with R.",

        answer:
            "LIKE"
    }

],


"HAVING": [

    {
        question:
            "The ______ clause is commonly used to filter grouped results.",

        answer:
            "HAVING"
    },

    {
        question:
            "HAVING is commonly used together with the ______ BY clause.",

        answer:
            "GROUP"
    },

    {
        question:
            "Complete: GROUP BY department HAVING ______(*) > 5;",

        answer:
            "COUNT"
    },

    {
        question:
            "WHERE filters rows before grouping, while ______ filters groups after aggregation.",

        answer:
            "HAVING"
    },

    {
        question:
            "Complete: HAVING AVG(salary) ______ 50000 to select groups with an average salary greater than 50000.",

        answer:
            ">"
    }

],

// =====================================================
// WEB DEVELOPMENT - FILL IN THE BLANK DATA
// =====================================================

"Text & Headings": [

    {
        question:
            "The largest HTML heading element is ______.",
        answer:
            "<h1>"
    },

    {
        question:
            "The HTML element used to create a paragraph is ______.",
        answer:
            "<p>"
    },

    {
        question:
            "The HTML element used to create a line break is ______.",
        answer:
            "<br>"
    },

    {
        question:
            "The HTML element commonly used to make text strongly important is ______.",
        answer:
            "<strong>"
    },

    {
        question:
            "The smallest HTML heading element is ______.",
        answer:
            "<h6>"
    }

],


// =====================================================
// WEB DEVELOPMENT - CSS FILL IN THE BLANK DATA
// =====================================================

"Box Model": [

    {
        question:
            "The space between an element's content and its border is called ______.",
        answer:
            "padding"
    },

    {
        question:
            "The space outside an element's border is called ______.",
        answer:
            "margin"
    },

    {
        question:
            "The CSS property used to define the line surrounding an element is ______.",
        answer:
            "border"
    },

    {
        question:
            "The CSS property used to control the horizontal size of an element is ______.",
        answer:
            "width"
    },

    {
        question:
            "The CSS value that makes width and height include content, padding and border is box-sizing: ______.",
        answer:
            "border-box"
    }

],


// =====================================================
// WEB DEVELOPMENT - MEDIA QUERIES DATA
// =====================================================

"Media Queries": [

    {
        question:
            "The CSS rule used to apply styles based on device or screen conditions is ______.",
        answer:
            "@media"
    },

    {
        question:
            "In @media (max-width: 768px), the maximum viewport width is ______.",
        answer:
            "768px"
    },

    {
        question:
            "The media feature used to apply styles when the viewport is at least a certain width is ______.",
        answer:
            "min-width"
    },

    {
        question:
            "The media feature used to detect portrait or landscape mode is ______.",
        answer:
            "orientation"
    },

    {
        question:
            "Adapting a webpage to work well on different screen sizes is called ______ design.",
        answer:
            "responsive"
    }

],

// =====================================================
// WEB DEVELOPMENT - JAVASCRIPT FUNCTIONS
// =====================================================

"Functions": [

    {
        question:
            "The keyword used to declare a traditional JavaScript function is ______.",
        answer:
            "function"
    },

    {
        question:
            "The keyword used to send a value back from a function is ______.",
        answer:
            "return"
    },

    {
        question:
            "In function greet(name), the variable name inside the parentheses is called a ______.",
        answer:
            "parameter"
    },

    {
        question:
            "To execute a function named greet, we write greet______.",
        answer:
            "()"
    },

    {
        question:
            "The ES6 syntax const add = (a, b) => a + b; creates an ______ function.",
        answer:
            "arrow"
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

let fillBlankQuestions = [];

let currentFillIndex = 0;

let fillBlankScore = 0;


function loadFillBlankQuestion() {

if (fillBlankQuestions.length === 0) {

    fillBlankQuestions =
        backendQuestions.map(q => ({
            question: q.question,
            answer: q.correctAnswer
        }));
}

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

    ],

    // =====================================================
// SQL MATCHING DATA
// =====================================================

"Data Types": [

    {
        left: "INT",
        right:
            "Stores whole numbers"
    },

    {
        left: "VARCHAR",
        right:
            "Stores variable-length text"
    },

    {
        left: "DATE",
        right:
            "Stores date values"
    },

    {
        left: "DECIMAL",
        right:
            "Stores exact decimal numbers"
    },

    {
        left: "BOOLEAN",
        right:
            "Stores true or false values"
    }

],


"SQL Functions Challenge": [

    {
        left: "UPPER()",
        right:
            "Converts text to uppercase"
    },

    {
        left: "LOWER()",
        right:
            "Converts text to lowercase"
    },

    {
        left: "LENGTH()",
        right:
            "Returns the length of a string"
    },

    {
        left: "COUNT()",
        right:
            "Counts rows or values"
    },

    {
        left: "AVG()",
        right:
            "Calculates an average"
    }

],


"RIGHT JOIN": [

    {
        left: "RIGHT JOIN",
        right:
            "Keeps all rows from the right table"
    },

    {
        left: "ON",
        right:
            "Defines the join condition"
    },

    {
        left: "Matched row",
        right:
            "Has related data in both tables"
    },

    {
        left: "Unmatched left row",
        right:
            "May be excluded from a RIGHT JOIN result"
    },

    {
        left: "Unmatched right row",
        right:
            "Still appears in a RIGHT JOIN result"
    }

],


"Aggregate Functions": [

    {
        left: "COUNT()",
        right:
            "Counts rows or non-NULL values"
    },

    {
        left: "SUM()",
        right:
            "Calculates a total"
    },

    {
        left: "AVG()",
        right:
            "Calculates an average"
    },

    {
        left: "MIN()",
        right:
            "Returns the smallest value"
    },

    {
        left: "MAX()",
        right:
            "Returns the largest value"
    }

],


"Indexes": [

    {
        left: "Index",
        right:
            "Helps speed up data retrieval"
    },

    {
        left: "CREATE INDEX",
        right:
            "Creates an index"
    },

    {
        left: "DROP INDEX",
        right:
            "Removes an index"
    },

    {
        left: "Indexed column",
        right:
            "Column included in an index"
    },

    {
        left: "Query performance",
        right:
            "Can improve when useful indexes are available"
    }

],

// =====================================================
// WEB DEVELOPMENT - MATCHING DATA
// =====================================================

"Forms & Inputs": [

    {
        left: [
            "<form>",
            "<input>",
            "<label>",
            "<button>"
        ],
        right: [
            "Creates a form",
            "Creates an input field",
            "Provides a label for a form control",
            "Creates a clickable button"
        ]
    },

    {
        left: [
            "type=\"text\"",
            "type=\"password\"",
            "type=\"email\"",
            "type=\"number\""
        ],
        right: [
            "Text input",
            "Password input",
            "Email input",
            "Number input"
        ]
    },

    {
        left: [
            "type=\"radio\"",
            "type=\"checkbox\"",
            "type=\"submit\"",
            "type=\"date\""
        ],
        right: [
            "Single-choice option",
            "Multiple-choice option",
            "Submits the form",
            "Date input"
        ]
    },

    {
        left: [
            "action",
            "method",
            "name",
            "placeholder"
        ],
        right: [
            "Specifies where form data is sent",
            "Specifies how form data is sent",
            "Identifies a form control",
            "Displays temporary hint text"
        ]
    },

    {
        left: [
            "<textarea>",
            "<select>",
            "<option>",
            "<fieldset>"
        ],
        right: [
            "Multi-line text input",
            "Creates a drop-down list",
            "Defines a drop-down choice",
            "Groups related form controls"
        ]
    }

],


// =====================================================
// WEB DEVELOPMENT - CSS MATCHING DATA
// =====================================================

"Colors & Typography": [

    {
        left: [
            "color",
            "background-color",
            "font-size",
            "font-family"
        ],
        right: [
            "Changes text color",
            "Changes background color",
            "Changes text size",
            "Changes the typeface"
        ]
    },

    {
        left: [
            "font-weight",
            "font-style",
            "text-align",
            "text-decoration"
        ],
        right: [
            "Controls text thickness",
            "Controls normal or italic text",
            "Controls horizontal text alignment",
            "Adds decoration such as underline"
        ]
    },

    {
        left: [
            "#ff0000",
            "#00ff00",
            "#0000ff",
            "#ffffff"
        ],
        right: [
            "Red",
            "Green",
            "Blue",
            "White"
        ]
    },

    {
        left: [
            "16px",
            "2rem",
            "50%",
            "1.5em"
        ],
        right: [
            "16 pixels",
            "Twice the root font size",
            "Fifty percent",
            "1.5 times the parent/current font size"
        ]
    },

    {
        left: [
            "left",
            "center",
            "right",
            "justify"
        ],
        right: [
            "Aligns text to the left",
            "Centers text",
            "Aligns text to the right",
            "Spreads text across the available width"
        ]
    }

],


// =====================================================
// WEB DEVELOPMENT - FLEXBOX MATCHING DATA
// =====================================================

"Flexbox": [

    {
        left: [
            "display: flex",
            "flex-direction",
            "justify-content",
            "align-items"
        ],
        right: [
            "Creates a flex container",
            "Controls the direction of flex items",
            "Aligns items along the main axis",
            "Aligns items along the cross axis"
        ]
    },

    {
        left: [
            "row",
            "column",
            "row-reverse",
            "column-reverse"
        ],
        right: [
            "Items arranged horizontally",
            "Items arranged vertically",
            "Horizontal arrangement in reverse",
            "Vertical arrangement in reverse"
        ]
    },

    {
        left: [
            "justify-content: center",
            "justify-content: flex-start",
            "justify-content: flex-end",
            "justify-content: space-between"
        ],
        right: [
            "Centers items on the main axis",
            "Places items at the start",
            "Places items at the end",
            "Adds space between items"
        ]
    },

    {
        left: [
            "align-items: center",
            "align-items: flex-start",
            "align-items: flex-end",
            "align-items: stretch"
        ],
        right: [
            "Centers items on the cross axis",
            "Places items at the cross-axis start",
            "Places items at the cross-axis end",
            "Stretches items across the cross axis"
        ]
    },

    {
        left: [
            "flex-wrap: wrap",
            "gap",
            "flex-grow",
            "flex-shrink"
        ],
        right: [
            "Allows items to move onto another line",
            "Adds spacing between flex items",
            "Controls how an item can grow",
            "Controls how an item can shrink"
        ]
    }

],


// =====================================================
// WEB DEVELOPMENT - CREATING ELEMENTS
// =====================================================

"Creating Elements": [

    {
        left: [
            "document.createElement()",
            "appendChild()",
            "textContent",
            "remove()"
        ],
        right: [
            "Creates a new HTML element",
            "Adds a child element",
            "Sets the text inside an element",
            "Removes an element"
        ]
    },

    {
        left: [
            `document.createElement("p")`,
            `document.createElement("button")`,
            `document.createElement("img")`,
            `document.createElement("div")`
        ],
        right: [
            "Creates a paragraph",
            "Creates a button",
            "Creates an image element",
            "Creates a div"
        ]
    },

    {
        left: [
            "classList.add()",
            "classList.remove()",
            "setAttribute()",
            "append()"
        ],
        right: [
            "Adds a CSS class",
            "Removes a CSS class",
            "Sets an HTML attribute",
            "Adds content to an element"
        ]
    },

    {
        left: [
            `element.id = "card"`,
            `element.textContent = "Hello"`,
            `element.classList.add("active")`,
            `element.remove()`
        ],
        right: [
            "Sets the element id",
            "Adds text to the element",
            "Adds the active class",
            "Deletes the element"
        ]
    },

    {
        left: [
            "createElement",
            "textContent",
            "appendChild",
            "addEventListener"
        ],
        right: [
            "Create an element",
            "Give it text",
            "Insert it into the page",
            "Make it interactive"
        ]
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

let matchingPairs = [];

let selectedLeft = null;

let selectedRight = null;

let matchedCount = 0;


function loadMatchingGame() {

    if (matchingPairs.length === 0) {

        backendQuestions.forEach(q => {

            if (!q.correctAnswer) {
                return;
            }

            const pairs =
                q.correctAnswer.split("|");

            pairs.forEach(pair => {

                const separatorIndex =
                    pair.indexOf("=");

                if (separatorIndex === -1) {
                    return;
                }

                const left =
                    pair.substring(
                        0,
                        separatorIndex
                    ).trim();

                const right =
                    pair.substring(
                        separatorIndex + 1
                    ).trim();

                matchingPairs.push({
                    left: left,
                    right: right
                });

            });

        });

    }

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

    ],

    // =====================================================
// SQL TRUE / FALSE DATA
// =====================================================

"SQL Fundamentals Challenge": [

    {
        question:
            "SQL stands for Structured Query Language.",
        answer: true
    },

    {
        question:
            "SELECT is used to retrieve data from a database table.",
        answer: true
    },

    {
        question:
            "INSERT is used to delete rows from a table.",
        answer: false
    },

    {
        question:
            "A relational database can organize data using tables.",
        answer: true
    },

    {
        question:
            "A table can contain rows and columns.",
        answer: true
    }

],


"Views": [

    {
        question:
            "A view is based on the result of a SQL query.",
        answer: true
    },

    {
        question:
            "CREATE VIEW can be used to create a view.",
        answer: true
    },

    {
        question:
            "A view must always store a separate physical copy of all result data.",
        answer: false
    },

    {
        question:
            "A view can present selected columns from a table.",
        answer: true
    },

    {
        question:
            "Views can be used to simplify access to complex queries.",
        answer: true
    }

],


// =====================================================
// WEB DEVELOPMENT - TRUE / FALSE DATA
// =====================================================

"HTML Fundamentals Challenge": [

    {
        question:
            "The <body> element contains the main visible content of an HTML page.",
        answer:
            true
    },

    {
        question:
            "The <h1> element represents a smaller heading than <h6>.",
        answer:
            false
    },

    {
        question:
            "The href attribute is commonly used to specify the destination of a link.",
        answer:
            true
    },

    {
        question:
            "The src attribute can be used to specify the source of an image.",
        answer:
            true
    },

    {
        question:
            "The <p> element is used to create an image.",
        answer:
            false
    }

],


// =====================================================
// WEB DEVELOPMENT - CSS TRUE / FALSE DATA
// =====================================================

"CSS Fundamentals Challenge": [

    {
        question:
            "The # symbol is used to select an element by its id in CSS.",
        answer:
            true
    },

    {
        question:
            "Padding creates space outside an element's border.",
        answer:
            false
    },

    {
        question:
            "The color property is used to change the text color of an element.",
        answer:
            true
    },

    {
        question:
            "The margin property controls the space outside an element's border.",
        answer:
            true
    },

    {
        question:
            "The font-size property is used to change the background color of an element.",
        answer:
            false
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

let trueFalseQuestions =
    trueFalseData[
        currentActivityName
    ] || [];

let currentTrueFalseIndex = 0;

let trueFalseScore = 0;


function loadTrueFalseQuestion() {

if (trueFalseQuestions.length === 0) {
    trueFalseQuestions = backendQuestions.map(q => ({
        question: q.question,
        answer:
            String(q.correctAnswer)
                .trim()
                .toLowerCase() === "true"
    }));
}

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

    ],

    // =====================================================
// SQL CODE OUTPUT DATA
// =====================================================

"UPDATE": [

    {
        code: `Before:
id | name | salary
1  | Ravi | 30000

UPDATE employees
SET salary = 40000
WHERE id = 1;

SELECT salary
FROM employees
WHERE id = 1;`,
        options: [
            "30000",
            "40000",
            "1",
            "NULL"
        ],
        answer: "40000"
    },

    {
        code: `Before:
id | name
1  | Ravi
2  | Priya

UPDATE students
SET name = 'Arun'
WHERE id = 2;

SELECT name
FROM students
WHERE id = 2;`,
        options: [
            "Ravi",
            "Priya",
            "Arun",
            "NULL"
        ],
        answer: "Arun"
    },

    {
        code: `Before:
id | status
1  | Active
2  | Active

UPDATE users
SET status = 'Inactive';

SELECT status
FROM users
WHERE id = 1;`,
        options: [
            "Active",
            "Inactive",
            "NULL",
            "Deleted"
        ],
        answer: "Inactive"
    },

    {
        code: `Before:
id | marks
1  | 60
2  | 80

UPDATE students
SET marks = marks + 10
WHERE id = 1;

SELECT marks
FROM students
WHERE id = 1;`,
        options: [
            "60",
            "70",
            "80",
            "90"
        ],
        answer: "70"
    },

    {
        code: `Before:
id | city
1  | Salem
2  | Chennai

UPDATE students
SET city = 'Bangalore'
WHERE id = 3;

SELECT city
FROM students
WHERE id = 1;`,
        options: [
            "Salem",
            "Chennai",
            "Bangalore",
            "NULL"
        ],
        answer: "Salem"
    }

],


"AND, OR & NOT": [

    {
        code: `students:
name  | marks | city
Ravi  | 85    | Salem
Priya | 90    | Chennai
Arun  | 70    | Salem

SELECT name
FROM students
WHERE marks > 80
AND city = 'Salem';`,
        options: [
            "Ravi",
            "Priya",
            "Arun",
            "Ravi and Priya"
        ],
        answer: "Ravi"
    },

    {
        code: `students:
name  | city
Ravi  | Salem
Priya | Chennai
Arun  | Madurai

SELECT name
FROM students
WHERE city = 'Salem'
OR city = 'Chennai';`,
        options: [
            "Ravi only",
            "Priya only",
            "Ravi and Priya",
            "All three"
        ],
        answer: "Ravi and Priya"
    },

    {
        code: `users:
name  | active
Ravi  | 1
Priya | 0

SELECT name
FROM users
WHERE NOT active = 1;`,
        options: [
            "Ravi",
            "Priya",
            "Ravi and Priya",
            "No rows"
        ],
        answer: "Priya"
    },

    {
        code: `products:
name   | price | stock
Phone  | 20000 | 5
Mouse  | 500   | 0
Laptop | 60000 | 3

SELECT name
FROM products
WHERE price > 10000
AND stock > 0;`,
        options: [
            "Phone only",
            "Laptop only",
            "Phone and Laptop",
            "Mouse and Laptop"
        ],
        answer: "Phone and Laptop"
    },

    {
        code: `employees:
name  | department
Ravi  | IT
Priya | HR
Arun  | Sales

SELECT name
FROM employees
WHERE NOT department = 'HR';`,
        options: [
            "Priya",
            "Ravi and Arun",
            "Ravi only",
            "All employees"
        ],
        answer: "Ravi and Arun"
    }

],


"LEFT JOIN": [

    {
        code: `customers:
id | name
1  | Ravi
2  | Priya

orders:
customer_id | product
1           | Laptop

SELECT customers.name, orders.product
FROM customers
LEFT JOIN orders
ON customers.id = orders.customer_id;`,
        options: [
            "Ravi-Laptop only",
            "Ravi-Laptop and Priya-NULL",
            "Priya-NULL only",
            "No rows"
        ],
        answer: "Ravi-Laptop and Priya-NULL"
    },

    {
        code: `departments:
id | name
1  | IT
2  | HR

employees:
name | department_id
Ravi | 1

SELECT departments.name, employees.name
FROM departments
LEFT JOIN employees
ON departments.id = employees.department_id;`,
        options: [
            "IT-Ravi only",
            "HR-NULL only",
            "IT-Ravi and HR-NULL",
            "No rows"
        ],
        answer: "IT-Ravi and HR-NULL"
    },

    {
        code: `A:
id
1
2
3

B:
id
1
3

SELECT A.id
FROM A
LEFT JOIN B
ON A.id = B.id;`,
        options: [
            "1, 3",
            "1, 2, 3",
            "2 only",
            "1 only"
        ],
        answer: "1, 2, 3"
    },

    {
        code: `students:
id | name
1  | Ravi
2  | Priya

courses:
student_id | course
1          | Java

SELECT students.name
FROM students
LEFT JOIN courses
ON students.id = courses.student_id
WHERE courses.student_id IS NULL;`,
        options: [
            "Ravi",
            "Priya",
            "Ravi and Priya",
            "No rows"
        ],
        answer: "Priya"
    },

    {
        code: `products:
id | name
1  | Phone
2  | Mouse

sales:
product_id | quantity
1          | 3

SELECT products.name, sales.quantity
FROM products
LEFT JOIN sales
ON products.id = sales.product_id;`,
        options: [
            "Phone-3 only",
            "Mouse-NULL only",
            "Phone-3 and Mouse-NULL",
            "No rows"
        ],
        answer: "Phone-3 and Mouse-NULL"
    }

],


"GROUP BY": [

    {
        code: `employees:
department
IT
IT
HR

SELECT department, COUNT(*)
FROM employees
GROUP BY department;`,
        options: [
            "IT-2, HR-1",
            "IT-1, HR-2",
            "IT-3",
            "HR-3"
        ],
        answer: "IT-2, HR-1"
    },

    {
        code: `sales:
category | amount
A        | 100
A        | 200
B        | 50

SELECT category, SUM(amount)
FROM sales
GROUP BY category;`,
        options: [
            "A-300, B-50",
            "A-100, B-250",
            "A-200, B-150",
            "A-350"
        ],
        answer: "A-300, B-50"
    },

    {
        code: `students:
class | marks
A     | 80
A     | 100
B     | 70

SELECT class, AVG(marks)
FROM students
GROUP BY class;`,
        options: [
            "A-90, B-70",
            "A-80, B-100",
            "A-100, B-70",
            "A-70, B-90"
        ],
        answer: "A-90, B-70"
    },

    {
        code: `orders:
status
Paid
Paid
Pending
Pending
Pending

SELECT status, COUNT(*)
FROM orders
GROUP BY status;`,
        options: [
            "Paid-2, Pending-3",
            "Paid-3, Pending-2",
            "Paid-5",
            "Pending-5"
        ],
        answer: "Paid-2, Pending-3"
    },

    {
        code: `products:
category | price
A        | 10
A        | 30
B        | 20

SELECT category, MAX(price)
FROM products
GROUP BY category;`,
        options: [
            "A-10, B-20",
            "A-30, B-20",
            "A-30, B-30",
            "A-20, B-30"
        ],
        answer: "A-30, B-20"
    }

],


"Window Functions": [

    {
        code: `employees:
name  | salary
Ravi  | 30000
Priya | 50000
Arun  | 40000

SELECT name,
ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn
FROM employees;`,
        options: [
            "Priya-1, Arun-2, Ravi-3",
            "Ravi-1, Arun-2, Priya-3",
            "Arun-1, Priya-2, Ravi-3",
            "All rows get 1"
        ],
        answer: "Priya-1, Arun-2, Ravi-3"
    },

    {
        code: `scores:
name  | marks
Ravi  | 90
Priya | 90
Arun  | 80

SELECT name,
RANK() OVER (ORDER BY marks DESC) AS r
FROM scores;`,
        options: [
            "Ravi-1, Priya-2, Arun-3",
            "Ravi-1, Priya-1, Arun-3",
            "Ravi-1, Priya-1, Arun-2",
            "All rows get 1"
        ],
        answer: "Ravi-1, Priya-1, Arun-3"
    },

    {
        code: `scores:
name  | marks
Ravi  | 90
Priya | 90
Arun  | 80

SELECT name,
DENSE_RANK() OVER (ORDER BY marks DESC) AS r
FROM scores;`,
        options: [
            "Ravi-1, Priya-1, Arun-2",
            "Ravi-1, Priya-1, Arun-3",
            "Ravi-1, Priya-2, Arun-3",
            "All rows get 2"
        ],
        answer: "Ravi-1, Priya-1, Arun-2"
    },

    {
        code: `sales:
month | amount
Jan   | 100
Feb   | 200
Mar   | 300

SELECT month,
SUM(amount) OVER (ORDER BY month) AS total
FROM sales;`,
        options: [
            "Jan-100, Feb-300, Mar-600",
            "Jan-100, Feb-200, Mar-300",
            "Jan-600, Feb-600, Mar-600",
            "Jan-300, Feb-500, Mar-600"
        ],
        answer: "Jan-100, Feb-300, Mar-600"
    },

    {
        code: `employees:
name  | dept | salary
Ravi  | IT   | 30000
Priya | IT   | 50000
Arun  | HR   | 40000

SELECT name,
AVG(salary) OVER (PARTITION BY dept) AS avg_salary
FROM employees;`,
        options: [
            "Ravi-40000, Priya-40000, Arun-40000",
            "Ravi-30000, Priya-50000, Arun-40000",
            "Ravi-45000, Priya-45000, Arun-40000",
            "All employees-30000"
        ],
        answer: "Ravi-40000, Priya-40000, Arun-40000"
    }

],


// =====================================================
// WEB DEVELOPMENT - CODE OUTPUT DATA
// =====================================================

"Links & Images": [

    {
        code:
            `<a href="https://example.com">Visit</a>`,
        question:
            "What clickable text will be displayed?",
        options: [
            "Visit",
            "https://example.com",
            "example.com",
            "href"
        ],
        answer:
            "Visit"
    },

    {
        code:
            `<img src="cat.jpg" alt="Cat">`,
        question:
            "What is the value of the src attribute?",
        options: [
            "cat.jpg",
            "Cat",
            "img",
            "src"
        ],
        answer:
            "cat.jpg"
    },

    {
        code:
            `<a href="about.html">About Us</a>`,
        question:
            "Which page will this link open?",
        options: [
            "about.html",
            "index.html",
            "contact.html",
            "home.html"
        ],
        answer:
            "about.html"
    },

    {
        code:
            `<img src="logo.png" alt="SkillQuest Logo">`,
        question:
            "What alternative text is provided for the image?",
        options: [
            "SkillQuest Logo",
            "logo.png",
            "SkillQuest",
            "Image"
        ],
        answer:
            "SkillQuest Logo"
    },

    {
        code:
            `<a href="https://example.com" target="_blank">Open Site</a>`,
        question:
            "What does target=\"_blank\" normally do?",
        options: [
            "Opens the link in a new tab or window",
            "Deletes the link",
            "Closes the browser",
            "Downloads the page"
        ],
        answer:
            "Opens the link in a new tab or window"
    }

],


// =====================================================
// WEB DEVELOPMENT - CSS GRID CODE OUTPUT DATA
// =====================================================

"CSS Grid": [

    {
        code:
            `.container {
    display: grid;
}`,
        question:
            "Which CSS layout system is applied to .container?",
        options: [
            "Grid",
            "Flexbox",
            "Block",
            "Inline"
        ],
        answer:
            "Grid"
    },

    {
        code:
            `.container {
    display: grid;
    grid-template-columns: 1fr 1fr;
}`,
        question:
            "How many equal-width columns are created?",
        options: [
            "2",
            "1",
            "3",
            "4"
        ],
        answer:
            "2"
    },

    {
        code:
            `.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}`,
        question:
            "How many columns are created?",
        options: [
            "3",
            "1",
            "2",
            "4"
        ],
        answer:
            "3"
    },

    {
        code:
            `.container {
    display: grid;
    gap: 20px;
}`,
        question:
            "What spacing is added between the grid items?",
        options: [
            "20px",
            "10px",
            "0px",
            "40px"
        ],
        answer:
            "20px"
    },

    {
        code:
            `.item {
    grid-column: 1 / 3;
}`,
        question:
            "From which grid line to which grid line does the item span?",
        options: [
            "1 to 3",
            "1 to 2",
            "2 to 3",
            "3 to 4"
        ],
        answer:
            "1 to 3"
    }

],


// =====================================================
// WEB DEVELOPMENT - JAVASCRIPT OPERATORS & CONDITIONS
// =====================================================

"Operators & Conditions": [

    {
        code:
            `let a = 10;
let b = 5;
console.log(a + b);`,
        question:
            "What will be printed?",
        options: [
            "15",
            "105",
            "5",
            "10"
        ],
        answer:
            "15"
    },

    {
        code:
            `let age = 20;

if (age >= 18) {
    console.log("Adult");
} else {
    console.log("Minor");
}`,
        question:
            "What will be printed?",
        options: [
            "Adult",
            "Minor",
            "20",
            "undefined"
        ],
        answer:
            "Adult"
    },

    {
        code:
            `let x = 7;
console.log(x % 2);`,
        question:
            "What will be printed?",
        options: [
            "1",
            "0",
            "2",
            "7"
        ],
        answer:
            "1"
    },

    {
        code:
            `let score = 40;

if (score > 50) {
    console.log("Pass");
} else {
    console.log("Try Again");
}`,
        question:
            "What will be printed?",
        options: [
            "Try Again",
            "Pass",
            "40",
            "50"
        ],
        answer:
            "Try Again"
    },

    {
        code:
            `let a = true;
let b = false;

console.log(a && b);`,
        question:
            "What will be printed?",
        options: [
            "false",
            "true",
            "undefined",
            "0"
        ],
        answer:
            "false"
    }

],

// =====================================================
// WEB DEVELOPMENT - CHANGING DOM CONTENT
// =====================================================

"Changing DOM Content": [

    {
        code:
            `const title = document.getElementById("title");
title.textContent = "Welcome";`,
        question:
            "What text will the element with id=\"title\" display?",
        options: [
            "Welcome",
            "title",
            "textContent",
            "undefined"
        ],
        answer:
            "Welcome"
    },

    {
        code:
            `const message = document.querySelector(".message");
message.innerHTML = "<strong>Hello</strong>";`,
        question:
            "What text will appear in bold on the page?",
        options: [
            "Hello",
            "strong",
            "message",
            "innerHTML"
        ],
        answer:
            "Hello"
    },

    {
        code:
            `const button = document.getElementById("btn");
button.textContent = "Start Game";`,
        question:
            "What text will appear on the button?",
        options: [
            "Start Game",
            "btn",
            "button",
            "Game"
        ],
        answer:
            "Start Game"
    },

    {
        code:
            `const heading = document.querySelector("h1");
heading.style.color = "red";`,
        question:
            "What color will the h1 text become?",
        options: [
            "Red",
            "Blue",
            "Black",
            "White"
        ],
        answer:
            "Red"
    },

    {
        code:
            `const box = document.getElementById("box");
box.classList.add("active");`,
        question:
            "Which CSS class is added to the element?",
        options: [
            "active",
            "box",
            "classList",
            "add"
        ],
        answer:
            "active"
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

let codeOutputQuestions =
    codeOutputData[
        currentActivityName
    ] || [];

let currentCodeOutputIndex = 0;
let codeOutputScore = 0;
let codeOutputAnswered = false;


function loadCodeOutputQuestion() {

if (codeOutputQuestions.length === 0) {

    codeOutputQuestions =
        backendQuestions.map(q => ({
            question: q.question,
            code: q.codeSnippet || q.question,
            options: q.options
                ? q.options.split("|")
                : [],
            answer: q.correctAnswer
        }));
}

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

    ],

    // =====================================================
// SQL DEBUGGING DATA
// =====================================================

"DELETE & CRUD Challenge": [

    {
        code: `DELETE students
WHERE id = 5;`,
        options: [
            "FROM is missing after DELETE",
            "WHERE cannot be used with DELETE",
            "DELETE must be SELECT",
            "id cannot be used in DELETE"
        ],
        answer:
            "FROM is missing after DELETE"
    },

    {
        code: `UPDATE employees
salary = 50000
WHERE id = 1;`,
        options: [
            "SET is missing before salary",
            "UPDATE cannot use WHERE",
            "salary must be a String",
            "employees must be deleted first"
        ],
        answer:
            "SET is missing before salary"
    },

    {
        code: `INSERT students (name)
VALUES ('Ravi');`,
        options: [
            "INTO is missing after INSERT",
            "VALUES cannot contain text",
            "INSERT cannot specify columns",
            "The table must use SELECT"
        ],
        answer:
            "INTO is missing after INSERT"
    },

    {
        code: `SELECT name
FORM students;`,
        options: [
            "FORM should be FROM",
            "SELECT should be INSERT",
            "name cannot be selected",
            "students must be quoted"
        ],
        answer:
            "FORM should be FROM"
    },

    {
        code: `DELETE FROM students
WHERE id == 10;`,
        options: [
            "Use = instead of == for SQL equality",
            "DELETE cannot use an id",
            "WHERE must appear before FROM",
            "10 must always be quoted"
        ],
        answer:
            "Use = instead of == for SQL equality"
    }

],


"Join Debugging Challenge": [

    {
        code: `SELECT employees.name,
departments.name
FROM employees
INNER JOIN departments
employees.department_id =
departments.id;`,
        options: [
            "ON is missing before the join condition",
            "INNER JOIN cannot join departments",
            "SELECT cannot contain two columns",
            "FROM must come after ON"
        ],
        answer:
            "ON is missing before the join condition"
    },

    {
        code: `SELECT *
FROM customers
LEFT customers_orders
ON customers.id =
customers_orders.customer_id;`,
        options: [
            "JOIN is missing after LEFT",
            "LEFT is not a SQL keyword",
            "ON cannot be used here",
            "SELECT * cannot be used with joins"
        ],
        answer:
            "JOIN is missing after LEFT"
    },

    {
        code: `SELECT *
FROM employees
INNER JOIN departments
ON employees.department_id;`,
        options: [
            "The ON clause needs a complete comparison condition",
            "INNER JOIN cannot use ON",
            "department_id must be deleted",
            "SELECT * requires GROUP BY"
        ],
        answer:
            "The ON clause needs a complete comparison condition"
    },

    {
        code: `SELECT *
FROM employees
JOIN departments
WHERE employees.department_id =
departments.id;`,
        options: [
            "The join relationship should be specified with ON",
            "JOIN cannot be used with employees",
            "WHERE must come before FROM",
            "departments cannot have an id"
        ],
        answer:
            "The join relationship should be specified with ON"
    },

    {
        code: `SELECT *
FROM employees
INNER departments
ON employees.department_id =
departments.id;`,
        options: [
            "JOIN is missing after INNER",
            "INNER should be WHERE",
            "ON must be removed",
            "SELECT cannot use *"
        ],
        answer:
            "JOIN is missing after INNER"
    }

],


"Aggregation Challenge": [

    {
        code: `SELECT department,
COUNT(*)
FROM employees
GROUP department;`,
        options: [
            "BY is missing after GROUP",
            "COUNT cannot use *",
            "department cannot be grouped",
            "FROM must come after GROUP"
        ],
        answer:
            "BY is missing after GROUP"
    },

    {
        code: `SELECT department,
COUNT(*)
FROM employees
WHERE COUNT(*) > 5
GROUP BY department;`,
        options: [
            "Aggregate group filtering should use HAVING instead of WHERE",
            "COUNT cannot be used in SQL",
            "GROUP BY must be removed",
            "department must be numeric"
        ],
        answer:
            "Aggregate group filtering should use HAVING instead of WHERE"
    },

    {
        code: `SELECT department,
SUM salary
FROM employees
GROUP BY department;`,
        options: [
            "SUM requires parentheses around salary",
            "SUM cannot work with salary",
            "GROUP BY cannot use department",
            "SELECT must be DELETE"
        ],
        answer:
            "SUM requires parentheses around salary"
    },

    {
        code: `SELECT department,
AVG(salary)
FROM employees
GROUP department
HAVING AVG(salary) > 50000;`,
        options: [
            "GROUP should be GROUP BY",
            "AVG cannot be used with HAVING",
            "HAVING must be before SELECT",
            "salary cannot be averaged"
        ],
        answer:
            "GROUP should be GROUP BY"
    },

    {
        code: `SELECT department,
COUNT(*)
FROM employees
GROUP BY department
HAVING COUNT(*) >;`,
        options: [
            "The comparison is missing a value after >",
            "HAVING cannot use COUNT",
            "COUNT(*) must be COUNT(1) only",
            "GROUP BY cannot appear before HAVING"
        ],
        answer:
            "The comparison is missing a value after >"
    }

],


// =====================================================
// WEB DEVELOPMENT - DEBUGGING DATA
// =====================================================

"HTML Debugging Challenge": [

    {
        question:
            "Fix the incorrect closing tag.",

        code:
            `<h1>Welcome</h2>`,

        options: [
            `<h1>Welcome</h1>`,
            `<h2>Welcome</h2>`,
            `<h1>Welcome</h2>`,
            `<h1>Welcome</p>`
        ],

        answer:
            `<h1>Welcome</h1>`
    },

    {
        question:
            "Fix the paragraph closing tag.",

        code:
            `<p>Learn Web Development</div>`,

        options: [
            `<p>Learn Web Development</p>`,
            `<div>Learn Web Development</div>`,
            `<p>Learn Web Development</span>`,
            `<p>Learn Web Development</div>`
        ],

        answer:
            `<p>Learn Web Development</p>`
    },

    {
        question:
            "Fix the incorrect image attribute.",

        code:
            `<img source="photo.jpg" alt="Photo">`,

        options: [
            `<img src="photo.jpg" alt="Photo">`,
            `<img href="photo.jpg" alt="Photo">`,
            `<img link="photo.jpg" alt="Photo">`,
            `<img source="photo.jpg" alt="Photo">`
        ],

        answer:
            `<img src="photo.jpg" alt="Photo">`
    },

    {
        question:
            "Fix the incorrect link attribute.",

        code:
            `<a src="https://example.com">Visit</a>`,

        options: [
            `<a href="https://example.com">Visit</a>`,
            `<a link="https://example.com">Visit</a>`,
            `<a url="https://example.com">Visit</a>`,
            `<a src="https://example.com">Visit</a>`
        ],

        answer:
            `<a href="https://example.com">Visit</a>`
    },

    {
        question:
            "Fix the incorrect unordered list closing tag.",

        code:
`<ul>
    <li>Java</li>
    <li>SQL</li>
</ol>`,

        options: [
`<ul>
    <li>Java</li>
    <li>SQL</li>
</ul>`,

`<ol>
    <li>Java</li>
    <li>SQL</li>
</ol>`,

`<ul>
    <li>Java</li>
    <li>SQL</li>
</div>`,

`<ul>
    <li>Java</li>
    <li>SQL</li>
</ol>`
        ],

        answer:
`<ul>
    <li>Java</li>
    <li>SQL</li>
</ul>`
    }

],


// =====================================================
// WEB DEVELOPMENT - RESPONSIVE CSS DEBUGGING DATA
// =====================================================

"Responsive CSS Challenge": [

    {
        question:
            "Fix the incorrect media query keyword.",

        code:
`@screen (max-width: 768px) {
    .container {
        width: 100%;
    }
}`,

        options: [
`@media (max-width: 768px) {
    .container {
        width: 100%;
    }
}`,
`@screen (max-width: 768px) {
    .container {
        width: 100%;
    }
}`,
`@responsive (max-width: 768px) {
    .container {
        width: 100%;
    }
}`,
`@query (max-width: 768px) {
    .container {
        width: 100%;
    }
}`
        ],

        answer:
`@media (max-width: 768px) {
    .container {
        width: 100%;
    }
}`
    },

    {
        question:
            "Fix the incorrect max-width syntax.",

        code:
`@media (max-width = 600px) {
    body {
        font-size: 14px;
    }
}`,

        options: [
`@media (max-width: 600px) {
    body {
        font-size: 14px;
    }
}`,
`@media (max-width = 600px) {
    body {
        font-size: 14px;
    }
}`,
`@media (max-width 600px) {
    body {
        font-size: 14px;
    }
}`,
`@media max-width: 600px {
    body {
        font-size: 14px;
    }
}`
        ],

        answer:
`@media (max-width: 600px) {
    body {
        font-size: 14px;
    }
}`
    },

    {
        question:
            "Fix the incorrect CSS width property.",

        code:
`.container {
    size: 100%;
}`,

        options: [
`.container {
    width: 100%;
}`,
`.container {
    size: 100%;
}`,
`.container {
    length: 100%;
}`,
`.container {
    horizontal: 100%;
}`
        ],

        answer:
`.container {
    width: 100%;
}`
    },

    {
        question:
            "Fix the incorrect Flexbox property.",

        code:
`.container {
    display: flexible;
}`,

        options: [
`.container {
    display: flex;
}`,
`.container {
    display: flexible;
}`,
`.container {
    flex: display;
}`,
`.container {
    layout: flex;
}`
        ],

        answer:
`.container {
    display: flex;
}`
    },

    {
        question:
            "Fix the incorrect CSS Grid declaration.",

        code:
`.container {
    display: grids;
}`,

        options: [
`.container {
    display: grid;
}`,
`.container {
    display: grids;
}`,
`.container {
    grid: display;
}`,
`.container {
    layout: grid;
}`
        ],

        answer:
`.container {
    display: grid;
}`
    }

],


// =====================================================
// WEB DEVELOPMENT - JAVASCRIPT DEBUGGING
// =====================================================

"JavaScript Fundamentals Challenge": [

    {
        question:
            "Fix the incorrect variable declaration.",

        code:
`let age = ;`,

        options: [
            `let age = 25;`,
            `let = age 25;`,
            `age let = 25;`,
            `let age 25;`
        ],

        answer:
            `let age = 25;`
    },

    {
        question:
            "Fix the incorrect comparison operator.",

        code:
`if (age = 18) {
    console.log("Adult");
}`,

        options: [
`if (age === 18) {
    console.log("Adult");
}`,
`if (age = 18) {
    console.log("Adult");
}`,
`if (age => 18) {
    console.log("Adult");
}`,
`if (age := 18) {
    console.log("Adult");
}`
        ],

        answer:
`if (age === 18) {
    console.log("Adult");
}`
    },

    {
        question:
            "Fix the incorrect for loop condition.",

        code:
`for (let i = 0; i < 5; i--) {
    console.log(i);
}`,

        options: [
`for (let i = 0; i < 5; i++) {
    console.log(i);
}`,
`for (let i = 0; i < 5; i--) {
    console.log(i);
}`,
`for (let i = 0; i > 5; i++) {
    console.log(i);
}`,
`for (let i = 0; i < 5; i = 0) {
    console.log(i);
}`
        ],

        answer:
`for (let i = 0; i < 5; i++) {
    console.log(i);
}`
    },

    {
        question:
            "Fix the incorrect function declaration.",

        code:
`function greet {
    console.log("Hello");
}`,

        options: [
`function greet() {
    console.log("Hello");
}`,
`function greet {
    console.log("Hello");
}`,
`greet function() {
    console.log("Hello");
}`,
`function() greet {
    console.log("Hello");
}`
        ],

        answer:
`function greet() {
    console.log("Hello");
}`
    },

    {
        question:
            "Fix the incorrect console method.",

        code:
`console.print("SkillQuest");`,

        options: [
            `console.log("SkillQuest");`,
            `console.print("SkillQuest");`,
            `console.write("SkillQuest");`,
            `console.display("SkillQuest");`
        ],

        answer:
            `console.log("SkillQuest");`
    }

],

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

let debuggingQuestions =
    debuggingData[
        currentActivityName
    ] || [];

let currentDebuggingIndex = 0;
let debuggingScore = 0;
let debuggingAnswered = false;


function loadDebuggingQuestion() {

if (debuggingQuestions.length === 0) {

    debuggingQuestions =
        backendQuestions.map(q => ({
            question: q.question,
            code: q.codeSnippet || "",
            options: q.options
                ? q.options.split("|")
                : [],
            answer: q.correctAnswer
        }));
}

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

    ],

    // =====================================================
// SQL CODE ORDERING DATA
// =====================================================

"Multiple Table Joins": [

    {
        lines: [
            "SELECT employees.name, departments.name",
            "FROM employees",
            "INNER JOIN departments",
            "ON employees.department_id = departments.id;"
        ]
    },

    {
        lines: [
            "SELECT students.name, courses.course_name",
            "FROM students",
            "INNER JOIN enrollments",
            "ON students.id = enrollments.student_id",
            "INNER JOIN courses",
            "ON enrollments.course_id = courses.id;"
        ]
    },

    {
        lines: [
            "SELECT orders.id, customers.name, products.name",
            "FROM orders",
            "INNER JOIN customers",
            "ON orders.customer_id = customers.id",
            "INNER JOIN products",
            "ON orders.product_id = products.id;"
        ]
    },

    {
        lines: [
            "SELECT employees.name, departments.name, locations.city",
            "FROM employees",
            "INNER JOIN departments",
            "ON employees.department_id = departments.id",
            "INNER JOIN locations",
            "ON departments.location_id = locations.id;"
        ]
    },

    {
        lines: [
            "SELECT students.name, courses.course_name, teachers.name",
            "FROM students",
            "INNER JOIN courses",
            "ON students.course_id = courses.id",
            "INNER JOIN teachers",
            "ON courses.teacher_id = teachers.id;"
        ]
    }

],


"Subqueries": [

    {
        lines: [
            "SELECT name",
            "FROM employees",
            "WHERE salary > (",
            "SELECT AVG(salary)",
            "FROM employees",
            ");"
        ]
    },

    {
        lines: [
            "SELECT name",
            "FROM students",
            "WHERE marks = (",
            "SELECT MAX(marks)",
            "FROM students",
            ");"
        ]
    },

    {
        lines: [
            "SELECT name",
            "FROM products",
            "WHERE price < (",
            "SELECT AVG(price)",
            "FROM products",
            ");"
        ]
    },

    {
        lines: [
            "SELECT name",
            "FROM employees",
            "WHERE department_id IN (",
            "SELECT id",
            "FROM departments",
            "WHERE location = 'Chennai'",
            ");"
        ]
    },

    {
        lines: [
            "SELECT name",
            "FROM customers",
            "WHERE id IN (",
            "SELECT customer_id",
            "FROM orders",
            "WHERE amount > 5000",
            ");"
        ]
    }

],

// =====================================================
// WEB DEVELOPMENT - CODE ORDERING DATA
// =====================================================

"Lists & Tables": [

    {
        question:
            "Arrange the code to create an unordered list with two items.",
        lines: [
            "<ul>",
            "    <li>Java</li>",
            "    <li>SQL</li>",
            "</ul>"
        ]
    },

    {
        question:
            "Arrange the code to create an ordered list with two items.",
        lines: [
            "<ol>",
            "    <li>HTML</li>",
            "    <li>CSS</li>",
            "</ol>"
        ]
    },

    {
        question:
            "Arrange the code to create a basic table.",
        lines: [
            "<table>",
            "    <tr>",
            "        <td>Java</td>",
            "    </tr>",
            "</table>"
        ]
    },

    {
        question:
            "Arrange the code to create a table row with two cells.",
        lines: [
            "<tr>",
            "    <td>Rudhraa</td>",
            "    <td>Developer</td>",
            "</tr>"
        ]
    },

    {
        question:
            "Arrange the code to create a table with a heading.",
        lines: [
            "<table>",
            "    <tr>",
            "        <th>Course</th>",
            "    </tr>",
            "    <tr>",
            "        <td>Java</td>",
            "    </tr>",
            "</table>"
        ]
    }

],


// =====================================================
// WEB DEVELOPMENT - JAVASCRIPT LOOPS
// =====================================================

"Loops": [

    {
        question:
            "Arrange the code to print numbers from 1 to 3.",
        lines: [
            "for (let i = 1; i <= 3; i++) {",
            "    console.log(i);",
            "}"
        ]
    },

    {
        question:
            "Arrange the code to create a while loop that prints 1 to 3.",
        lines: [
            "let i = 1;",
            "while (i <= 3) {",
            "    console.log(i);",
            "    i++;",
            "}"
        ]
    },

    {
        question:
            "Arrange the code to loop through an array using for...of.",
        lines: [
            "const courses = [\"Java\", \"SQL\", \"Web\"];",
            "for (const course of courses) {",
            "    console.log(course);",
            "}"
        ]
    },

    {
        question:
            "Arrange the code to print even numbers from 2 to 6.",
        lines: [
            "for (let i = 2; i <= 6; i += 2) {",
            "    console.log(i);",
            "}"
        ]
    },

    {
        question:
            "Arrange the do...while loop correctly.",
        lines: [
            "let count = 1;",
            "do {",
            "    console.log(count);",
            "    count++;",
            "} while (count <= 3);"
        ]
    }

],

// =====================================================
// WEB DEVELOPMENT - EVENT LISTENERS
// =====================================================

"Event Listeners": [

    {
        question:
            "Arrange the code to add a click event listener to a button.",
        lines: [
            `const button = document.getElementById("btn");`,
            `button.addEventListener("click", function () {`,
            `    console.log("Button clicked");`,
            `});`
        ]
    },

    {
        question:
            "Arrange the code to change a heading when a button is clicked.",
        lines: [
            `const heading = document.getElementById("title");`,
            `const button = document.getElementById("btn");`,
            `button.addEventListener("click", function () {`,
            `    heading.textContent = "Welcome";`,
            `});`
        ]
    },

    {
        question:
            "Arrange the code to listen for a mouseover event.",
        lines: [
            `const box = document.getElementById("box");`,
            `box.addEventListener("mouseover", function () {`,
            `    console.log("Mouse entered");`,
            `});`
        ]
    },

    {
        question:
            "Arrange the code to listen for an input event.",
        lines: [
            `const input = document.getElementById("username");`,
            `input.addEventListener("input", function () {`,
            `    console.log(input.value);`,
            `});`
        ]
    },

    {
        question:
            "Arrange the code to prevent a form from submitting normally.",
        lines: [
            `const form = document.getElementById("login-form");`,
            `form.addEventListener("submit", function (event) {`,
            `    event.preventDefault();`,
            `    console.log("Form submitted");`,
            `});`
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

let codeOrderingQuestions =
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

if (codeOrderingQuestions.length === 0) {

    codeOrderingQuestions =
        backendQuestions.map(q => {

            const correctCode =
                q.correctAnswer || "";

            return {
                question: q.question,

                lines:
                    correctCode
                        .split("\n")
                        .map(line => line.trim())
                        .filter(line => line !== ""),

                answer:
                    correctCode
                        .split("\n")
                        .map(line => line.trim())
                        .filter(line => line !== "")
            };
        });
}

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
                "public synchronized void display()"
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

    ],

    // =====================================================
// SQL CODE CHALLENGE DATA
// =====================================================

"Advanced SQL Challenge": [

    {
        question:
            "Write a query to retrieve all employees whose salary is greater than 50000.",

        starter:
`Table: employees

Columns:
id
name
salary

Write your SQL query below:`,

        answers: [
            "SELECT * FROM employees WHERE salary > 50000;",
            "SELECT * FROM employees WHERE salary > 50000"
        ]
    },

    {
        question:
            "Write a query to count the total number of employees.",

        starter:
`Table: employees

Columns:
id
name
salary

Write your SQL query below:`,

        answers: [
            "SELECT COUNT(*) FROM employees;",
            "SELECT COUNT(*) FROM employees"
        ]
    },

    {
        question:
            "Write a query to find the average salary of all employees.",

        starter:
`Table: employees

Columns:
id
name
salary

Write your SQL query below:`,

        answers: [
            "SELECT AVG(salary) FROM employees;",
            "SELECT AVG(salary) FROM employees"
        ]
    },

    {
        question:
            "Write a query to display each department and the number of employees in that department.",

        starter:
`Table: employees

Columns:
id
name
salary
department

Write your SQL query below:`,

        answers: [
            "SELECT department, COUNT(*) FROM employees GROUP BY department;",
            "SELECT department, COUNT(*) FROM employees GROUP BY department"
        ]
    },

    {
        question:
            "Write a query to retrieve employee names together with their department names using an INNER JOIN.",

        starter:
`Table: employees
Columns:
id
name
department_id

Table: departments
Columns:
id
name

Write your SQL query below:`,

        answers: [
            "SELECT employees.name, departments.name FROM employees INNER JOIN departments ON employees.department_id = departments.id;",
            "SELECT employees.name, departments.name FROM employees INNER JOIN departments ON employees.department_id = departments.id"
        ]
    }

],

    // =====================================================
    // WEB DEVELOPMENT - DOM CODE CHALLENGE
    // =====================================================

    "DOM Challenge": [

        {
            question:
                "Select the element with id title and store it in a variable named title.",

            starter:
`// Write one line below:`,

            answers: [
                `const title = document.getElementById("title");`,
                `let title = document.getElementById("title");`
            ]
        },

        {
            question:
                "Change the text of the title element to Welcome.",

            starter:
`const title = document.getElementById("title");

// Write one line below:`,

            answers: [
                `title.textContent = "Welcome";`,
                `title.textContent = 'Welcome';`
            ]
        },

        {
            question:
                "Create a new paragraph element and store it in a variable named paragraph.",

            starter:
`// Write one line below:`,

            answers: [
                `const paragraph = document.createElement("p");`,
                `let paragraph = document.createElement("p");`
            ]
        },

        {
            question:
                "Add the CSS class active to the element named button.",

            starter:
`const button = document.getElementById("btn");

// Write one line below:`,

            answers: [
                `button.classList.add("active");`,
                `button.classList.add('active');`
            ]
        },

        {
            question:
                "Add a click event listener to button that calls the function startGame.",

            starter:
`const button = document.getElementById("btn");

function startGame() {
    console.log("Game Started");
}

// Write one line below:`,

            answers: [
                `button.addEventListener("click", startGame);`,
                `button.addEventListener('click', startGame);`
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

let codeChallengeQuestions =
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

if (codeChallengeQuestions.length === 0) {

    codeChallengeQuestions =
        backendQuestions.map(q => ({
            question: q.question,
            starter: q.codeSnippet || "",
            answer: q.correctAnswer
        }));
}


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
    currentCourseName === "SQL"
        ? "Please enter your SQL query."
        : "Please enter your Java code.";

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

    const selectedActivityTypeMap =
    currentCourseName === "SQL"
        ? sqlActivityTypeMap
        : currentCourseName === "Web Development"
            ? webActivityTypeMap
            : activityTypeMap;


const activityType =
    selectedActivityTypeMap[
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

async function startActivityAttempt() {

    if (!currentActivityId) {

        alert(
            "Unable to start activity. Activity ID is missing."
        );

        return;
    }


    if (activityAttemptStarted) {
        return;
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

            let errorMessage =
                "Unable to start activity.";

            try {

                const errorData =
                    await response.json();

                if (errorData.message) {
                    errorMessage =
                        errorData.message;
                }

            } catch (error) {

                console.error(
                    "Could not read attempt error:",
                    error
                );
            }


            alert(errorMessage);

            return;
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


        updateCompleteButton();



    } catch (error) {

        console.error(
            "Attempt start error:",
            error
        );

    }

}


startActivityAttempt();

async function initializeActivityPage() {

    const loaded =
        await loadActivityFromBackend();

    if (!loaded) {
        return;
    }

    console.log(
        "Ready to start game:",
        backendActivity.type
    );

    switch (backendActivity.type) {

    case "QUIZ":

        quizContainer.classList.remove("hidden");

        quizQuestions = [];

        loadQuizQuestion();

        break;


    case "TRUE_FALSE":

        trueFalseContainer.classList.remove("hidden");

        trueFalseQuestions = [];

        loadTrueFalseQuestion();

        break;


    case "FILL_IN_THE_BLANK":

        fillBlankContainer.classList.remove("hidden");

        fillBlankQuestions = [];

        loadFillBlankQuestion();

        break;


    case "MATCHING":

        matchingContainer.classList.remove("hidden");

        matchingPairs = [];

        loadMatchingGame();

        break;


    case "CODE_OUTPUT":

    codeOutputContainer.classList.remove(
        "hidden"
    );

    codeOutputQuestions = [];

    loadCodeOutputQuestion();

    break;


case "CODE_ORDERING":

    codeOrderingContainer.classList.remove(
        "hidden"
    );

    codeOrderingQuestions = [];

    loadCodeOrderingQuestion();

    break;


case "DEBUGGING":

    debuggingContainer.classList.remove(
        "hidden"
    );

    debuggingQuestions = [];

    loadDebuggingQuestion();

    break;


case "CODE_CHALLENGE":

    codeChallengeContainer.classList.remove(
        "hidden"
    );

    codeChallengeQuestions = [];

    loadCodeChallenge();

    break;

    default:

        console.log(
            "Backend game engine not connected yet:",
            backendActivity.type
        );
}
}

initializeActivityPage();