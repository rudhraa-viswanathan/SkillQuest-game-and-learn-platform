const defaultCourses = [
    {
        name: "Java Development",
        status: "Active"
    },
    {
        name: "Web Development",
        status: "Active"
    },
    {
        name: "SQL & Database",
        status: "Active"
    }
];


// ==============================
// LOAD DATA
// ==============================

const savedCourses =
    localStorage.getItem("adminCourses");

const courses =
    savedCourses
        ? JSON.parse(savedCourses)
        : [...defaultCourses];


const savedTopics =
    localStorage.getItem("adminTopics");

const topics =
    savedTopics
        ? JSON.parse(savedTopics)
        : [];


const savedActivities =
    localStorage.getItem("adminActivities");

const activities =
    savedActivities
        ? JSON.parse(savedActivities)
        : [];


// ==============================
// COURSE ELEMENTS
// ==============================

const courseManagement =
    document.getElementById("course-management");

const addCourseButton =
    document.getElementById("add-course-btn");

const courseFormContainer =
    document.getElementById("course-form-container");

const cancelCourseButton =
    document.getElementById("cancel-course-btn");

const saveCourseButton =
    document.getElementById("save-course-btn");

const courseNameInput =
    document.getElementById("course-name-input");


// ==============================
// TOPIC ELEMENTS
// ==============================

const topicCourseSelect =
    document.getElementById("topic-course-select");

const addTopicButton =
    document.getElementById("add-topic-btn");

const topicFormContainer =
    document.getElementById("topic-form-container");

const cancelTopicButton =
    document.getElementById("cancel-topic-btn");

const saveTopicButton =
    document.getElementById("save-topic-btn");

const topicNameInput =
    document.getElementById("topic-name-input");

const topicManagement =
    document.getElementById("topic-management");


// ==============================
// ACTIVITY ELEMENTS
// ==============================

const addActivityButton =
    document.getElementById("add-activity-btn");

const activityFormContainer =
    document.getElementById("activity-form-container");

const cancelActivityButton =
    document.getElementById("cancel-activity-btn");

const saveActivityButton =
    document.getElementById("save-activity-btn");

const activityCourseSelect =
    document.getElementById("activity-course-select");

const activityTopicSelect =
    document.getElementById("activity-topic-select");

const activityNameInput =
    document.getElementById("activity-name-input");

const activityManagement =
    document.getElementById("activity-management");


// ==============================
// EDITING STATE
// ==============================

let editingCourseIndex = null;

let editingTopicIndex = null;

let editingActivityIndex = null;


// ==============================
// SAVE FUNCTIONS
// ==============================

function saveCourses() {

    localStorage.setItem(
        "adminCourses",
        JSON.stringify(courses)
    );

}


function saveTopics() {

    localStorage.setItem(
        "adminTopics",
        JSON.stringify(topics)
    );

}


function saveActivities() {

    localStorage.setItem(
        "adminActivities",
        JSON.stringify(activities)
    );

}


// ==============================
// COURSE DROPDOWNS
// ==============================

function populateCourseSelect() {

    topicCourseSelect.innerHTML = `
        <option value="">
            Select Course
        </option>
    `;


    courses.forEach((course, index) => {

        const option =
            document.createElement("option");

        option.value = index;

        option.textContent =
            course.name;

        topicCourseSelect.appendChild(option);

    });

}


function populateActivityCourseSelect() {

    activityCourseSelect.innerHTML = `
        <option value="">
            Select Course
        </option>
    `;


    courses.forEach((course, index) => {

        const option =
            document.createElement("option");

        option.value = index;

        option.textContent =
            course.name;

        activityCourseSelect.appendChild(option);

    });

}


// ==============================
// ACTIVITY TOPIC DROPDOWN
// ==============================

function populateActivityTopicSelect(courseIndex) {

    activityTopicSelect.innerHTML = `
        <option value="">
            Select Topic
        </option>
    `;


    topics.forEach((topic, index) => {

        if (
            topic.courseIndex ===
            Number(courseIndex)
        ) {

            const option =
                document.createElement("option");

            option.value = index;

            option.textContent =
                topic.name;

            activityTopicSelect
                .appendChild(option);

        }

    });

}


// ==============================
// RENDER COURSES
// ==============================

function renderCourses() {

    courseManagement.innerHTML = "";


    courses.forEach((course, index) => {

        const courseCard =
            document.createElement("div");

        courseCard.classList.add(
            "admin-course-card"
        );


        courseCard.innerHTML = `
            <div>

                <h3>
                    ${course.name}
                </h3>

                <p>
                    ${course.status}
                </p>

            </div>

            <div class="course-actions">

                <button
                    class="edit-course-btn"
                    data-index="${index}"
                >
                    Edit
                </button>

                <button
                    class="delete-course-btn"
                    data-index="${index}"
                >
                    Delete
                </button>

            </div>
        `;


        courseManagement
            .appendChild(courseCard);


        // EDIT COURSE

        const editButton =
            courseCard.querySelector(
                ".edit-course-btn"
            );


        editButton.addEventListener(
            "click",
            () => {

                editingCourseIndex =
                    index;

                courseNameInput.value =
                    courses[index].name;

                courseFormContainer
                    .classList
                    .remove("hidden");

            }
        );


        // DELETE COURSE

        const deleteButton =
            courseCard.querySelector(
                ".delete-course-btn"
            );


        deleteButton.addEventListener(
    "click",
    () => {

        const hasTopics =
            topics.some(
                topic =>
                    topic.courseIndex === index
            );


        const hasActivities =
            activities.some(
                activity =>
                    activity.courseIndex === index
            );


        if (
            hasTopics ||
            hasActivities
        ) {

            alert(
                "Delete the related topics and activities before deleting this course."
            );

            return;
        }


        courses.splice(
            index,
            1
        );


        saveCourses();

        renderCourses();

        populateCourseSelect();

        populateActivityCourseSelect();

    }
);

    });

}


// ==============================
// RENDER TOPICS
// ==============================

function renderTopics() {

    topicManagement.innerHTML = "";


    topics.forEach((topic, index) => {

        const course =
            courses[topic.courseIndex];


        const topicCard =
            document.createElement("div");

        topicCard.classList.add(
            "admin-course-card"
        );


        topicCard.innerHTML = `
            <div>

                <h3>
                    ${topic.name}
                </h3>

                <p>
                    ${
                        course
                            ? course.name
                            : "Unknown Course"
                    }
                </p>

            </div>

            <div class="course-actions">

                <button
                    class="edit-topic-btn"
                    data-index="${index}"
                >
                    Edit
                </button>

                <button
                    class="delete-topic-btn"
                    data-index="${index}"
                >
                    Delete
                </button>

            </div>
        `;


        topicManagement
            .appendChild(topicCard);


        // EDIT TOPIC

        const editTopicButton =
            topicCard.querySelector(
                ".edit-topic-btn"
            );


        editTopicButton.addEventListener(
            "click",
            () => {

                editingTopicIndex =
                    index;


                topicNameInput.value =
                    topics[index].name;


                topicCourseSelect.value =
                    String(
                        topics[index].courseIndex
                    );


                topicFormContainer
                    .classList
                    .remove("hidden");

            }
        );


        // DELETE TOPIC

        const deleteTopicButton =
            topicCard.querySelector(
                ".delete-topic-btn"
            );


        deleteTopicButton.addEventListener(
            "click",
            () => {

                topics.splice(
                    index,
                    1
                );


                saveTopics();

                renderTopics();

            }
        );

    });

}


// ==============================
// RENDER ACTIVITIES
// ==============================

function renderActivities() {

    activityManagement.innerHTML = "";


    activities.forEach(
        (activity, index) => {

            const course =
                courses[
                    activity.courseIndex
                ];

            const topic =
                topics[
                    activity.topicIndex
                ];


            const activityCard =
                document.createElement("div");


            activityCard.classList.add(
                "admin-course-card"
            );


            activityCard.innerHTML = `
                <div>

                    <h3>
                        ${activity.name}
                    </h3>

                    <p>

                        ${
                            course
                                ? course.name
                                : "Unknown Course"
                        }

                        -

                        ${
                            topic
                                ? topic.name
                                : "Unknown Topic"
                        }

                    </p>

                </div>

                <div class="course-actions">

                    <button
                        class="edit-activity-btn"
                        data-index="${index}"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-activity-btn"
                        data-index="${index}"
                    >
                        Delete
                    </button>

                </div>
            `;


            activityManagement
                .appendChild(activityCard);


            // EDIT ACTIVITY

            const editActivityButton =
                activityCard.querySelector(
                    ".edit-activity-btn"
                );


            editActivityButton
                .addEventListener(
                    "click",
                    () => {

                        editingActivityIndex =
                            index;


                        activityNameInput.value =
                            activities[index].name;


                        activityCourseSelect.value =
                            String(
                                activities[index]
                                    .courseIndex
                            );


                        populateActivityTopicSelect(
                            activities[index]
                                .courseIndex
                        );


                        activityTopicSelect.value =
                            String(
                                activities[index]
                                    .topicIndex
                            );


                        activityFormContainer
                            .classList
                            .remove("hidden");

                    }
                );


            // DELETE ACTIVITY

            const deleteActivityButton =
                activityCard.querySelector(
                    ".delete-activity-btn"
                );


            deleteActivityButton
                .addEventListener(
                    "click",
                    () => {

                        activities.splice(
                            index,
                            1
                        );


                        saveActivities();

                        renderActivities();

                    }
                );

        }
    );

}


// ==============================
// ADD COURSE
// ==============================

addCourseButton.addEventListener(
    "click",
    () => {

        editingCourseIndex = null;

        courseNameInput.value = "";

        courseFormContainer
            .classList
            .remove("hidden");

    }
);


// ==============================
// CANCEL COURSE
// ==============================

cancelCourseButton.addEventListener(
    "click",
    () => {

        courseFormContainer
            .classList
            .add("hidden");

        courseNameInput.value = "";

        editingCourseIndex = null;

    }
);


// ==============================
// SAVE COURSE
// ==============================

saveCourseButton.addEventListener(
    "click",
    () => {

        const courseName =
            courseNameInput
                .value
                .trim();


        if (courseName === "") {
            return;
        }


        if (
            editingCourseIndex !== null
        ) {

            courses[
                editingCourseIndex
            ].name = courseName;


            editingCourseIndex =
                null;

        } else {

            const newCourse = {

                name: courseName,

                status: "Active"

            };


            courses.push(
                newCourse
            );

        }


        saveCourses();

        renderCourses();

        populateCourseSelect();

        populateActivityCourseSelect();


        courseNameInput.value = "";


        courseFormContainer
            .classList
            .add("hidden");

    }
);


// ==============================
// ADD TOPIC
// ==============================

addTopicButton.addEventListener(
    "click",
    () => {

        editingTopicIndex = null;

        topicNameInput.value = "";

        topicCourseSelect.value = "";


        topicFormContainer
            .classList
            .remove("hidden");

    }
);


// ==============================
// CANCEL TOPIC
// ==============================

cancelTopicButton.addEventListener(
    "click",
    () => {

        topicFormContainer
            .classList
            .add("hidden");


        topicNameInput.value = "";

        topicCourseSelect.value = "";

        editingTopicIndex = null;

    }
);


// ==============================
// SAVE TOPIC
// ==============================

saveTopicButton.addEventListener(
    "click",
    () => {

        const topicName =
            topicNameInput
                .value
                .trim();


        const selectedCourse =
            topicCourseSelect.value;


        if (
            topicName === "" ||
            selectedCourse === ""
        ) {
            return;
        }


        if (
            editingTopicIndex !== null
        ) {

            topics[
                editingTopicIndex
            ].name =
                topicName;


            topics[
                editingTopicIndex
            ].courseIndex =
                Number(
                    selectedCourse
                );


            editingTopicIndex =
                null;

        } else {

            const newTopic = {

                name: topicName,

                courseIndex:
                    Number(
                        selectedCourse
                    )

            };


            topics.push(
                newTopic
            );

        }


        saveTopics();

        renderTopics();


        topicNameInput.value = "";

        topicCourseSelect.value = "";


        topicFormContainer
            .classList
            .add("hidden");

    }
);


// ==============================
// ADD ACTIVITY
// ==============================

addActivityButton.addEventListener(
    "click",
    () => {

        editingActivityIndex =
            null;


        activityNameInput.value =
            "";


        activityCourseSelect.value =
            "";


        activityTopicSelect.innerHTML = `
            <option value="">
                Select Topic
            </option>
        `;


        activityFormContainer
            .classList
            .remove("hidden");

    }
);


// ==============================
// COURSE CHANGE FOR ACTIVITY
// ==============================

activityCourseSelect
    .addEventListener(
        "change",
        () => {

            const selectedCourse =
                activityCourseSelect.value;


            if (
                selectedCourse === ""
            ) {

                activityTopicSelect.innerHTML = `
                    <option value="">
                        Select Topic
                    </option>
                `;

                return;
            }


            populateActivityTopicSelect(
                selectedCourse
            );

        }
    );


// ==============================
// CANCEL ACTIVITY
// ==============================

cancelActivityButton.addEventListener(
    "click",
    () => {

        activityFormContainer
            .classList
            .add("hidden");


        activityNameInput.value =
            "";


        activityCourseSelect.value =
            "";


        activityTopicSelect.innerHTML = `
            <option value="">
                Select Topic
            </option>
        `;


        editingActivityIndex =
            null;

    }
);


// ==============================
// SAVE ACTIVITY
// ==============================

saveActivityButton.addEventListener(
    "click",
    () => {

        const activityName =
            activityNameInput
                .value
                .trim();


        const selectedCourse =
            activityCourseSelect.value;


        const selectedTopic =
            activityTopicSelect.value;


        if (
            activityName === "" ||
            selectedCourse === "" ||
            selectedTopic === ""
        ) {
            return;
        }


        if (
            editingActivityIndex !== null
        ) {

            activities[
                editingActivityIndex
            ].name =
                activityName;


            activities[
                editingActivityIndex
            ].courseIndex =
                Number(
                    selectedCourse
                );


            activities[
                editingActivityIndex
            ].topicIndex =
                Number(
                    selectedTopic
                );


            editingActivityIndex =
                null;

        } else {

            const newActivity = {

                name:
                    activityName,

                courseIndex:
                    Number(
                        selectedCourse
                    ),

                topicIndex:
                    Number(
                        selectedTopic
                    )

            };


            activities.push(
                newActivity
            );

        }


        saveActivities();

        renderActivities();


        activityNameInput.value =
            "";


        activityCourseSelect.value =
            "";


        activityTopicSelect.innerHTML = `
            <option value="">
                Select Topic
            </option>
        `;


        activityFormContainer
            .classList
            .add("hidden");

    }
);


// ==============================
// INITIAL PAGE LOAD
// ==============================

renderCourses();

populateCourseSelect();

populateActivityCourseSelect();

renderTopics();

renderActivities();