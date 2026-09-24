document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // ========================================
        // ELEMENTS
        // ========================================

        const loadingMessage =
            document.getElementById(
                "assessment-loading"
            );

        const assessmentContent =
            document.getElementById(
                "assessment-content"
            );

        const assessmentTitle =
            document.getElementById(
                "assessment-title"
            );

        const assessmentQuestion =
            document.getElementById(
                "assessment-question"
            );

            const assessmentAnswer =
    document.getElementById(
        "assessment-answer"
    );

const submitButton =
    document.getElementById(
        "submit-assessment"
    );

const assessmentResult =
    document.getElementById(
        "assessment-result"
    );


let currentAssessment = null;

        // ========================================
        // COURSE ID
        // ========================================

        const params =
            new URLSearchParams(
                window.location.search
            );


        const courseId =
            Number(
                params.get("courseId")
            );


        // ========================================
        // VALIDATE COURSE ID
        // ========================================

        if (!courseId) {

            loadingMessage.textContent =
                "Course information is missing.";

            return;

        }


        // ========================================
        // LOAD ASSESSMENT
        // ========================================

        try {

            const response =
                await authenticatedFetch(
                    `/assessments/courses/${courseId}`
                );


            // Assessment locked

            if (
                response.status === 403 ||
                response.status === 400
            ) {

                loadingMessage.textContent =
                    "This assessment is locked. Reach 75% course progress first.";

                return;

            }


            // Other error

            if (!response.ok) {

                loadingMessage.textContent =
                    "Unable to load the assessment.";

                return;

            }


            // ========================================
            // REAL BACKEND ASSESSMENT
            // ========================================

            const assessment =
                await response.json();

                currentAssessment =
                assessment;

           
            /*
             * Only display fields returned by
             * the backend response DTO.
             *
             * The expected answer must never
             * be exposed to the frontend.
             */


            assessmentTitle.textContent =
                assessment.title ||
                "Java Programming Assessment";


            assessmentQuestion.textContent =
    assessment.problemDescription ||
    "Programming challenge";


            loadingMessage.hidden =
                true;


            assessmentContent.hidden =
                false;

            // ========================================
// ALREADY COMPLETED
// ========================================

if (assessment.passed) {

    assessmentResult.hidden =
        false;

    assessmentResult.innerHTML = `
        <h3>
            ✅ Assessment Completed
        </h3>

        <p>
            You have already passed the
            Java Programming Assessment.
        </p>
    `;


    assessmentAnswer.disabled =
        true;


    submitButton.disabled =
        true;


    submitButton.textContent =
        "Assessment Completed ✓";

}    


        } catch (error) {

            console.error(
                "Assessment loading error:",
                error
            );


            loadingMessage.textContent =
                "Unable to load the assessment.";

        }


        // ========================================
// SUBMIT ASSESSMENT
// ========================================

submitButton.addEventListener(
    "click",
    async function () {

        const answer =
            assessmentAnswer.value.trim();


        // ========================================
        // VALIDATE ANSWER
        // ========================================

        if (!answer) {

            assessmentResult.hidden =
                false;

            assessmentResult.textContent =
                "Please enter your answer before submitting.";

            return;

        }


        if (!currentAssessment) {

            assessmentResult.hidden =
                false;

            assessmentResult.textContent =
                "Assessment information is unavailable.";

            return;

        }


        // ========================================
        // PREPARE REQUEST
        // ========================================

        const submission = {

    assessmentId:
        currentAssessment.assessmentId,

    answer:
        answer

};


        submitButton.disabled =
            true;

        submitButton.textContent =
            "Submitting...";


        try {

            // ========================================
            // SEND TO BACKEND
            // ========================================

            const response =
                await authenticatedFetch(
                    "/assessments/submit",
                    {
                        method: "POST",

                        body:
                            JSON.stringify(
                                submission
                            )
                    }
                );


            // ========================================
            // ERROR RESPONSE
            // ========================================

            if (!response.ok) {

                let errorMessage =
                    "Unable to submit assessment.";


                try {

                    const errorData =
                        await response.json();


                    if (errorData.message) {

                        errorMessage =
                            errorData.message;

                    }

                } catch (error) {

                    console.error(
                        "Could not read assessment error:",
                        error
                    );

                }


                assessmentResult.hidden =
                    false;

                assessmentResult.textContent =
                    errorMessage;


                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Submit Assessment";


                return;

            }


            // ========================================
            // REAL BACKEND RESULT
            // ========================================

            const result =
                await response.json();


            assessmentResult.hidden =
                false;


            // ========================================
            // PASSED
            // ========================================

            if (result.passed) {

                assessmentResult.innerHTML = `
                    <h3>
                        ✅ Assessment Passed!
                    </h3>

                    <p>
                        Score:
                        ${result.scorePercentage}%
                    </p>

                    <p>
                        Java Programming Assessment
                        completed successfully.
                    </p>
                `;


                submitButton.textContent =
                    "Assessment Completed ✓";


                submitButton.disabled =
                    true;


                assessmentAnswer.disabled =
                    true;


            } else {

                // ========================================
                // FAILED — UNLIMITED RETRY
                // ========================================

                assessmentResult.innerHTML = `
                    <h3>
                        ❌ Assessment Not Passed
                    </h3>

                    <p>
                        Score:
                        ${result.scorePercentage}%
                    </p>

                    <p>
                        You can correct your answer
                        and try again.
                    </p>
                `;


                submitButton.disabled =
                    false;


                submitButton.textContent =
                    "Try Again";

            }


        } catch (error) {

            console.error(
                "Assessment submission error:",
                error
            );


            assessmentResult.hidden =
                false;


            assessmentResult.textContent =
                "Unable to submit assessment.";


            submitButton.disabled =
                false;


            submitButton.textContent =
                "Submit Assessment";

        }

    }
);


    }
);