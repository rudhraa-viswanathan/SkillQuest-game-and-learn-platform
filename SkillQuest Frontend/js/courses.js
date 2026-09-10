function getSavedProgress(courseId, defaultProgress) {
    const savedProgress = localStorage.getItem(courseId + "Progress");

    if (savedProgress !== null) {
        return Number(savedProgress);
    }

    return defaultProgress;
}

const courses = [
    {
        id: "java",
        name: "Java Development",
        description: "Learn Java from fundamentals to advanced concepts.",
        progress: 72,
        lessonsCompleted: 18,
        totalLessons: 25,
        xp: 850
    },
    {
        id: "web",
        name: "Web Development",
        description: "Learn HTML, CSS and JavaScript to build websites.",
        progress: 48,
        lessonsCompleted: 12,
        totalLessons: 25,
        xp: 620
    },
    {
        id: "sql",
        name: "SQL & Database",
        description: "Learn SQL queries and database concepts.",
        progress: 35,
        lessonsCompleted: 9,
        totalLessons: 25,
        xp: 430
    }
];


const coursesContainer = document.getElementById("courses-container");


courses.forEach(course => {

    const currentProgress = getSavedProgress(
    course.id,
    course.progress
);

    let courseStatus;

if (currentProgress === 0) {
    courseStatus = "Not Started";
} else if (currentProgress === 100) {
    courseStatus = "Completed";
} else {
    courseStatus = "In Progress";
}

    const courseCard = document.createElement("div");

    courseCard.classList.add("course-card");

    courseCard.innerHTML = `
        <h2>${course.name}</h2>

        <p>${course.description}</p>
        <p class="course-status">
         Status: ${courseStatus}
        </p>
        <p class="lesson-count">
            ${course.lessonsCompleted} / ${course.totalLessons} lessons completed
        </p>
        <p class="course-xp">
            XP: ${course.xp}
        </p>
        <div class="course-progress">
            <span>Progress: ${currentProgress}%</span>

            <div class="progress-bar">
                <div
                    class="progress-fill"
                    style="width: ${currentProgress}%;"
                </div>
            </div>
        </div>

        <button class="course-btn" data-course="${course.id}">
            Continue Course
        </button>
    `;

    coursesContainer.appendChild(courseCard);
});

const courseButtons = document.querySelectorAll(".course-btn");

courseButtons.forEach(button => {

    button.addEventListener("click", () => {

        const courseId = button.dataset.course;

        if (courseId === "java") {
            window.location.href = "java-course.html";
        }

        if (courseId === "web") {
            window.location.href = "web-course.html";
        }

        if (courseId === "sql") {
            window.location.href = "sql-course.html";
        }
    });
});

const searchInput = document.getElementById("course-search");
const noCoursesMessage = document.getElementById("no-courses-message");

if (searchInput && noCoursesMessage) {

    searchInput.addEventListener("input", () => {

        const searchText = searchInput.value.toLowerCase();

        const courseCards = document.querySelectorAll(".course-card");

        let visibleCourses = 0;

        courseCards.forEach(card => {

            const courseName = card.querySelector("h2").textContent.toLowerCase();

            if (courseName.includes(searchText)) {
                card.style.display = "flex";
                visibleCourses++;
            } else {
                card.style.display = "none";
            }
        });

        if (visibleCourses === 0) {
            noCoursesMessage.style.display = "block";
        } else {
            noCoursesMessage.style.display = "none";
        }
    });
}