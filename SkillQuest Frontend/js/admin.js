// =====================================================
// ADMIN - BACKEND CONNECTED CONTENT MANAGEMENT
// =====================================================

let courses = [];
let topics = [];
let activities = [];

let editingCourseId = null;
let editingTopicId = null;
let editingActivityId = null;


// =====================================================
// ELEMENTS
// =====================================================

// Course
const courseManagement =
    document.getElementById("course-management");

const addCourseButton =
    document.getElementById("add-course-btn");

const courseFormContainer =
    document.getElementById("course-form-container");

const courseNameInput =
    document.getElementById("course-name-input");

const courseDescriptionInput =
    document.getElementById("course-description-input");

const saveCourseButton =
    document.getElementById("save-course-btn");

const cancelCourseButton =
    document.getElementById("cancel-course-btn");


// Topic
const topicManagement =
    document.getElementById("topic-management");

const addTopicButton =
    document.getElementById("add-topic-btn");

const topicFormContainer =
    document.getElementById("topic-form-container");

const topicCourseSelect =
    document.getElementById("topic-course-select");

const topicNameInput =
    document.getElementById("topic-name-input");

const topicDescriptionInput =
    document.getElementById("topic-description-input");

const topicOrderInput =
    document.getElementById("topic-order-input");

const saveTopicButton =
    document.getElementById("save-topic-btn");

const cancelTopicButton =
    document.getElementById("cancel-topic-btn");


// Activity
const activityManagement =
    document.getElementById("activity-management");

const addActivityButton =
    document.getElementById("add-activity-btn");

const activityFormContainer =
    document.getElementById("activity-form-container");

const activityCourseSelect =
    document.getElementById("activity-course-select");

const activityTopicSelect =
    document.getElementById("activity-topic-select");

const activityNameInput =
    document.getElementById("activity-name-input");

const activityDescriptionInput =
    document.getElementById("activity-description-input");

const activityTypeSelect =
    document.getElementById("activity-type-select");

const activityOrderInput =
    document.getElementById("activity-order-input");

const saveActivityButton =
    document.getElementById("save-activity-btn");

const cancelActivityButton =
    document.getElementById("cancel-activity-btn");


// =====================================================
// RESPONSE HELPER
// =====================================================

async function readResponse(response) {

    const contentType =
        response.headers.get("content-type");

    if (
        contentType &&
        contentType.includes("application/json")
    ) {
        return await response.json();
    }

    return await response.text();
}


async function getErrorMessage(response) {

    try {

        const data =
            await readResponse(response);

        if (
            typeof data === "object" &&
            data !== null
        ) {
            return (
                data.message ||
                JSON.stringify(data)
            );
        }

        return data ||
            "Request failed.";

    } catch (error) {

        return "Request failed.";
    }
}


// =====================================================
// LOAD BACKEND DATA
// =====================================================

async function loadAdminData() {

    try {

        const [
            courseResponse,
            topicResponse,
            activityResponse
        ] = await Promise.all([

            authenticatedFetch("/courses"),

            authenticatedFetch("/topics"),

            authenticatedFetch("/activities")
        ]);


        if (
            !courseResponse.ok ||
            !topicResponse.ok ||
            !activityResponse.ok
        ) {
            throw new Error(
                "Unable to load admin data."
            );
        }


        courses =
            await courseResponse.json();

        topics =
            await topicResponse.json();

        activities =
            await activityResponse.json();


        renderCourses();

        renderTopics();

        renderActivities();

        populateCourseSelects();

    } catch (error) {

        console.error(
            "Admin loading error:",
            error
        );

        alert(
            "Unable to load admin data."
        );
    }
}


// =====================================================
// COURSE DROPDOWNS
// =====================================================

function populateCourseSelects() {

    topicCourseSelect.innerHTML =
        `<option value="">
            Select Course
        </option>`;

    activityCourseSelect.innerHTML =
        `<option value="">
            Select Course
        </option>`;


    courses.forEach(course => {

        const topicOption =
            document.createElement("option");

        topicOption.value =
            course.id;

        topicOption.textContent =
            course.name;

        topicCourseSelect.appendChild(
            topicOption
        );


        const activityOption =
            document.createElement("option");

        activityOption.value =
            course.id;

        activityOption.textContent =
            course.name;

        activityCourseSelect.appendChild(
            activityOption
        );
    });
}


// =====================================================
// TOPIC DROPDOWN FOR ACTIVITY
// =====================================================

function populateActivityTopics(courseId) {

    activityTopicSelect.innerHTML =
        `<option value="">
            Select Topic
        </option>`;


    topics
        .filter(
            topic =>
                Number(topic.courseId) ===
                Number(courseId)
        )
        .forEach(topic => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                topic.id;

            option.textContent =
                topic.name;

            activityTopicSelect
                .appendChild(option);
        });
}


// =====================================================
// RENDER COURSES
// =====================================================

function renderCourses() {

    courseManagement.innerHTML = "";

    courses.forEach(course => {

        const card =
            document.createElement("div");

        card.classList.add(
            "admin-course-card"
        );

        card.innerHTML = `
            <div>
                <h3>${course.name}</h3>
                <p>
                    ${course.description || ""}
                </p>
            </div>

            <div class="course-actions">

                <button
                    class="edit-course-btn">
                    Edit
                </button>

                <button
                    class="delete-course-btn">
                    Delete
                </button>

            </div>
        `;


        card.querySelector(
            ".edit-course-btn"
        ).addEventListener(
            "click",
            () => editCourse(course)
        );


        card.querySelector(
            ".delete-course-btn"
        ).addEventListener(
            "click",
            () => deleteCourse(course.id)
        );


        courseManagement.appendChild(
            card
        );
    });
}


// =====================================================
// RENDER TOPICS
// =====================================================

function renderTopics() {

    topicManagement.innerHTML = "";

    topics.forEach(topic => {

        const course =
            courses.find(
                item =>
                    Number(item.id) ===
                    Number(topic.courseId)
            );

        const card =
            document.createElement("div");

        card.classList.add(
            "admin-course-card"
        );

        card.innerHTML = `
            <div>

                <h3>${topic.name}</h3>

                <p>
                    ${course
                        ? course.name
                        : "Unknown Course"}
                    • Order ${topic.orderIndex}
                </p>

                <p>
                    ${topic.description || ""}
                </p>

            </div>

            <div class="course-actions">

                <button
                    class="edit-topic-btn">
                    Edit
                </button>

                <button
                    class="delete-topic-btn">
                    Delete
                </button>

            </div>
        `;


        card.querySelector(
            ".edit-topic-btn"
        ).addEventListener(
            "click",
            () => editTopic(topic)
        );


        card.querySelector(
            ".delete-topic-btn"
        ).addEventListener(
            "click",
            () => deleteTopic(topic.id)
        );


        topicManagement.appendChild(
            card
        );
    });
}


// =====================================================
// RENDER ACTIVITIES
// =====================================================

function renderActivities() {

    activityManagement.innerHTML = "";

    activities.forEach(activity => {

        const topic =
            topics.find(
                item =>
                    Number(item.id) ===
                    Number(activity.topicId)
            );

        const course =
            topic
                ? courses.find(
                    item =>
                        Number(item.id) ===
                        Number(topic.courseId)
                )
                : null;


        const card =
            document.createElement("div");

        card.classList.add(
            "admin-course-card"
        );

        card.innerHTML = `
            <div>

                <h3>
                    ${activity.title}
                </h3>

                <p>
                    ${course
                        ? course.name
                        : "Unknown Course"}
                    -
                    ${topic
                        ? topic.name
                        : "Unknown Topic"}
                </p>

                <p>
                    ${activity.type}
                    • Order
                    ${activity.orderIndex ?? "-"}
                </p>

            </div>

            <div class="course-actions">

                <button
                    class="edit-activity-btn">
                    Edit
                </button>

                <button
                    class="delete-activity-btn">
                    Delete
                </button>

            </div>
        `;


        card.querySelector(
            ".edit-activity-btn"
        ).addEventListener(
            "click",
            () => editActivity(activity)
        );


        card.querySelector(
            ".delete-activity-btn"
        ).addEventListener(
            "click",
            () =>
                deleteActivity(activity.id)
        );


        activityManagement.appendChild(
            card
        );
    });
}


// =====================================================
// COURSE FORM
// =====================================================

addCourseButton.addEventListener(
    "click",
    () => {

        editingCourseId = null;

        courseNameInput.value = "";

        courseDescriptionInput.value = "";

        courseFormContainer.classList
            .remove("hidden");
    }
);


cancelCourseButton.addEventListener(
    "click",
    () => {

        editingCourseId = null;

        courseFormContainer.classList
            .add("hidden");
    }
);


function editCourse(course) {

    editingCourseId =
        course.id;

    courseNameInput.value =
        course.name;

    courseDescriptionInput.value =
        course.description || "";

    courseFormContainer.classList
        .remove("hidden");
}


saveCourseButton.addEventListener(
    "click",
    async () => {

        const name =
            courseNameInput.value.trim();

        const description =
            courseDescriptionInput
                .value
                .trim();


        if (
            !name ||
            !description
        ) {

            alert(
                "Enter course name and description."
            );

            return;
        }


        const body = {
            name,
            description
        };


        const url =
            editingCourseId
                ? `/courses/${editingCourseId}`
                : "/courses";

        const method =
            editingCourseId
                ? "PUT"
                : "POST";


        try {

            const response =
                await authenticatedFetch(
                    url,
                    {
                        method,

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(body)
                    }
                );


            if (!response.ok) {

                alert(
                    await getErrorMessage(
                        response
                    )
                );

                return;
            }


            editingCourseId = null;

            courseFormContainer.classList
                .add("hidden");

            await loadAdminData();


        } catch (error) {

            console.error(error);

            alert(
                "Unable to save course."
            );
        }
    }
);


async function deleteCourse(id) {

    if (
        !confirm(
            "Delete this course?"
        )
    ) {
        return;
    }


    const response =
        await authenticatedFetch(
            `/courses/${id}`,
            {
                method: "DELETE"
            }
        );


    if (!response.ok) {

        alert(
            await getErrorMessage(
                response
            )
        );

        return;
    }


    await loadAdminData();
}


// =====================================================
// TOPIC FORM
// =====================================================

addTopicButton.addEventListener(
    "click",
    () => {

        editingTopicId = null;

        topicCourseSelect.value = "";

        topicNameInput.value = "";

        topicDescriptionInput.value = "";

        topicOrderInput.value = "";

        topicFormContainer.classList
            .remove("hidden");
    }
);


cancelTopicButton.addEventListener(
    "click",
    () => {

        editingTopicId = null;

        topicFormContainer.classList
            .add("hidden");
    }
);


function editTopic(topic) {

    editingTopicId =
        topic.id;

    topicCourseSelect.value =
        topic.courseId;

    topicNameInput.value =
        topic.name;

    topicDescriptionInput.value =
        topic.description || "";

    topicOrderInput.value =
        topic.orderIndex;

    topicFormContainer.classList
        .remove("hidden");
}


saveTopicButton.addEventListener(
    "click",
    async () => {

        const courseId =
            topicCourseSelect.value;

        const name =
            topicNameInput.value.trim();

        const description =
            topicDescriptionInput
                .value
                .trim();

        const orderIndex =
            Number(topicOrderInput.value);


        if (
            !courseId ||
            !name ||
            !description ||
            !orderIndex
        ) {

            alert(
                "Complete all topic fields."
            );

            return;
        }


        const body = {
            name,
            description,
            orderIndex
        };


        const url =
            editingTopicId
                ? `/topics/${editingTopicId}`
                : `/topics/course/${courseId}`;

        const method =
            editingTopicId
                ? "PUT"
                : "POST";


        const response =
            await authenticatedFetch(
                url,
                {
                    method,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(body)
                }
            );


        if (!response.ok) {

            alert(
                await getErrorMessage(
                    response
                )
            );

            return;
        }


        editingTopicId = null;

        topicFormContainer.classList
            .add("hidden");

        await loadAdminData();
    }
);


async function deleteTopic(id) {

    if (
        !confirm(
            "Delete this topic?"
        )
    ) {
        return;
    }


    const response =
        await authenticatedFetch(
            `/topics/${id}`,
            {
                method: "DELETE"
            }
        );


    if (!response.ok) {

        alert(
            await getErrorMessage(
                response
            )
        );

        return;
    }


    await loadAdminData();
}


// =====================================================
// ACTIVITY FORM
// =====================================================

activityCourseSelect.addEventListener(
    "change",
    () => {

        populateActivityTopics(
            activityCourseSelect.value
        );
    }
);


addActivityButton.addEventListener(
    "click",
    () => {

        editingActivityId = null;

        activityCourseSelect.value = "";

        activityTopicSelect.innerHTML =
            `<option value="">
                Select Topic
            </option>`;

        activityNameInput.value = "";

        activityDescriptionInput.value = "";

        activityTypeSelect.value = "";

        activityOrderInput.value = "";

        activityFormContainer.classList
            .remove("hidden");
    }
);


cancelActivityButton.addEventListener(
    "click",
    () => {

        editingActivityId = null;

        activityFormContainer.classList
            .add("hidden");
    }
);


function editActivity(activity) {

    editingActivityId =
        activity.id;

    const topic =
        topics.find(
            item =>
                Number(item.id) ===
                Number(activity.topicId)
        );


    if (topic) {

        activityCourseSelect.value =
            topic.courseId;

        populateActivityTopics(
            topic.courseId
        );

        activityTopicSelect.value =
            topic.id;
    }


    activityNameInput.value =
        activity.title;

    activityDescriptionInput.value =
        activity.description || "";

    activityTypeSelect.value =
        activity.type;

    activityOrderInput.value =
        activity.orderIndex ?? "";

    activityFormContainer.classList
        .remove("hidden");
}


saveActivityButton.addEventListener(
    "click",
    async () => {

        const topicId =
            activityTopicSelect.value;

        const title =
            activityNameInput.value.trim();

        const description =
            activityDescriptionInput
                .value
                .trim();

        const type =
            activityTypeSelect.value;

        const orderValue =
            activityOrderInput.value;

        const orderIndex =
            orderValue === ""
                ? null
                : Number(orderValue);


        if (
            !topicId ||
            !title ||
            !description ||
            !type
        ) {

            alert(
                "Complete all required activity fields."
            );

            return;
        }


        const body = {
            title,
            description,
            type,
            question: null,
            options: null,
            correctAnswer: null,
            codeSnippet: null,
            explanation: null,
            orderIndex
        };


        const url =
            editingActivityId
                ? `/activities/${editingActivityId}`
                : `/activities/topic/${topicId}`;

        const method =
            editingActivityId
                ? "PUT"
                : "POST";


        const response =
            await authenticatedFetch(
                url,
                {
                    method,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(body)
                }
            );


        if (!response.ok) {

            alert(
                await getErrorMessage(
                    response
                )
            );

            return;
        }


        editingActivityId = null;

        activityFormContainer.classList
            .add("hidden");

        await loadAdminData();
    }
);


async function deleteActivity(id) {

    if (
        !confirm(
            "Delete this activity?"
        )
    ) {
        return;
    }


    const response =
        await authenticatedFetch(
            `/activities/${id}`,
            {
                method: "DELETE"
            }
        );


    if (!response.ok) {

        alert(
            await getErrorMessage(
                response
            )
        );

        return;
    }


    await loadAdminData();
}

// =====================================================
// USER + PROGRESS MANAGEMENT
// =====================================================

const userManagement =
    document.getElementById(
        "user-management"
    );

const progressUserSelect =
    document.getElementById(
        "progress-user-select"
    );

const viewProgressButton =
    document.getElementById(
        "view-progress-btn"
    );

const userProgressManagement =
    document.getElementById(
        "user-progress-management"
    );


let adminUsers = [];


// =====================================================
// LOAD USERS
// =====================================================

async function loadAdminUsers() {

    try {

        const response =
            await authenticatedFetch(
                "/users"
            );

        if (!response.ok) {

            throw new Error(
                await getErrorMessage(
                    response
                )
            );
        }


        adminUsers =
            await response.json();


        renderAdminUsers();

        populateProgressUsers();


    } catch (error) {

        console.error(
            "User loading error:",
            error
        );

        userManagement.innerHTML =
            "<p>Unable to load users.</p>";
    }
}


// =====================================================
// RENDER USERS
// =====================================================

function renderAdminUsers() {

    userManagement.innerHTML = "";


    adminUsers.forEach(user => {

        const card =
            document.createElement("div");

        card.classList.add(
            "admin-course-card"
        );


        card.innerHTML = `
            <div>

                <h3>
                    ${user.username}
                </h3>

                <p>
                    ${user.email || ""}
                </p>

                <p>
                    Role:
                    ${user.role || "USER"}
                </p>

                <p>
                    Status:
                    ${
                        user.restricted
                            ? "Restricted"
                            : "Active"
                    }
                </p>

            </div>

            <div class="course-actions">

                <button
                    class="restriction-btn">

                    ${
                        user.restricted
                            ? "Unrestrict"
                            : "Restrict"
                    }

                </button>

            </div>
        `;


        card.querySelector(
            ".restriction-btn"
        ).addEventListener(
            "click",
            () => {

                setRestriction(
                    user.id,
                    !user.restricted
                );
            }
        );


        userManagement.appendChild(
            card
        );
    });
}


// =====================================================
// RESTRICT / UNRESTRICT USER
// =====================================================

async function setRestriction(
    userId,
    restricted
) {

    const response =
        await authenticatedFetch(
            `/users/${userId}/restriction?restricted=${restricted}`,
            {
                method: "PUT"
            }
        );


    if (!response.ok) {

        alert(
            await getErrorMessage(
                response
            )
        );

        return;
    }


    await loadAdminUsers();
}


// =====================================================
// PROGRESS USER DROPDOWN
// =====================================================

function populateProgressUsers() {

    progressUserSelect.innerHTML =
        `<option value="">
            Select User
        </option>`;


    adminUsers.forEach(user => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            user.id;

        option.textContent =
            `${user.username} (ID ${user.id})`;

        progressUserSelect.appendChild(
            option
        );
    });
}


// =====================================================
// VIEW USER PROGRESS
// =====================================================

viewProgressButton.addEventListener(
    "click",
    async () => {

        const userId =
            progressUserSelect.value;


        if (!userId) {

            alert(
                "Select a user."
            );

            return;
        }


        const response =
            await authenticatedFetch(
                `/progress/admin/users/${userId}`
            );


        if (!response.ok) {

            alert(
                await getErrorMessage(
                    response
                )
            );

            return;
        }


        const progressList =
            await response.json();


        renderUserProgress(
            userId,
            progressList
        );
    }
);


// =====================================================
// RENDER USER PROGRESS
// =====================================================

function renderUserProgress(
    userId,
    progressList
) {

    userProgressManagement.innerHTML =
        "";


    if (
        !progressList ||
        progressList.length === 0
    ) {

        userProgressManagement.innerHTML =
            "<p>No course progress found.</p>";

        return;
    }


    progressList.forEach(progress => {

        const card =
            document.createElement("div");

        card.classList.add(
            "admin-course-card"
        );


        card.innerHTML = `
            <div>

                <h3>
                    ${progress.courseName}
                </h3>

                <p>
                    Completed:
                    ${progress.completedActivities}
                    /
                    ${progress.totalActivities}
                </p>

                <p>
                    Progress:
                   ${Math.round(progress.progressPercentage)}%
                </p>

            </div>

            <div class="course-actions">

                <button
                    class="reset-progress-btn">

                    Reset Progress

                </button>

            </div>
        `;


        card.querySelector(
            ".reset-progress-btn"
        ).addEventListener(
            "click",
            () => {

                resetUserProgress(
                    userId,
                    progress.courseId
                );
            }
        );


        userProgressManagement
            .appendChild(card);
    });
}


// =====================================================
// RESET USER COURSE PROGRESS
// =====================================================

async function resetUserProgress(
    userId,
    courseId
) {

    if (
        !confirm(
            "Reset this user's course progress?"
        )
    ) {
        return;
    }


    const response =
        await authenticatedFetch(
            `/progress/admin/users/${userId}/courses/${courseId}`,
            {
                method: "DELETE"
            }
        );


    if (!response.ok) {

        alert(
            await getErrorMessage(
                response
            )
        );

        return;
    }


    alert(
        "Progress reset successfully."
    );


    viewProgressButton.click();
}


// =====================================================
// LOAD ADMIN USERS
// =====================================================

loadAdminUsers();


// =====================================================
// START ADMIN PAGE
// =====================================================

loadAdminData();