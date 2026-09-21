const coursesContainer =
    document.getElementById(
        "courses-container"
    );

const searchInput =
    document.getElementById(
        "course-search"
    );

const noCoursesMessage =
    document.getElementById(
        "no-courses-message"
    );


let loadedCourses = [];


// ========================================
// Load Courses From Backend
// ========================================

async function loadCourses() {

coursesContainer.innerHTML = `
    <p class="loading-message">
        Loading courses...
    </p>
`;

noCoursesMessage.style.display =
    "none";

    try {

        const response =
            await authenticatedFetch(
                "/courses"
            );


        if (!response.ok) {

    const errorMessage =
        await getApiErrorMessage(
            response,
            "Unable to load courses."
        );


    coursesContainer.innerHTML = `
        <p class="error-message">
            ${errorMessage}
        </p>
    `;


    return;
}


        loadedCourses =
            await response.json();


        displayCourses(
            loadedCourses
        );


    } catch (error) {

    console.error(
        "Course loading error:",
        error
    );


    coursesContainer.innerHTML = `
        <p class="error-message">
            Unable to connect to SkillQuest.
            Please try again.
        </p>
    `;

}

}


// ========================================
// Display Courses
// ========================================

function displayCourses(courses) {

    coursesContainer.innerHTML = "";


    if (courses.length === 0) {

        noCoursesMessage.style.display =
            "block";

        return;
    }


    noCoursesMessage.style.display =
        "none";


    courses.forEach(course => {

        const courseCard =
            document.createElement(
                "div"
            );


        courseCard.classList.add(
            "course-card"
        );


        courseCard.innerHTML = `
            <h2>${course.name}</h2>

            <p>${course.description}</p>

            <button
                class="course-btn"
                data-course-id="${course.id}"
                data-course-name="${course.name}"
            >
                Continue Course
            </button>
        `;


        coursesContainer.appendChild(
            courseCard
        );

    });


    addCourseButtonEvents();

}


// ========================================
// Course Button Navigation
// ========================================

function addCourseButtonEvents() {

    const courseButtons =
        document.querySelectorAll(
            ".course-btn"
        );


    courseButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const courseName =
                    button.dataset.courseName
                        .toLowerCase();


                if (
                    courseName.includes(
                        "java"
                    )
                ) {

                    window.location.href =
                        "java-course.html";

                } else if (
                    courseName.includes(
                        "web"
                    )
                ) {

                    window.location.href =
                        "web-course.html";

                } else if (
                    courseName.includes(
                        "sql"
                    )
                ) {

                    window.location.href =
                        "sql-course.html";

                }

            }
        );

    });

}


// ========================================
// Search Courses
// ========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const searchText =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const filteredCourses =
                loadedCourses.filter(
                    course =>
                        course.name
                            .toLowerCase()
                            .includes(
                                searchText
                            )
                );


            displayCourses(
                filteredCourses
            );

        }
    );

}


// ========================================
// Start
// ========================================

loadCourses();