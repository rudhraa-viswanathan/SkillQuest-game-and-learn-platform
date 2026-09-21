if (
    localStorage.getItem("isLoggedIn") === "true"
) {
    window.location.href = "Dashboard.html";
}


const registerForm =
    document.getElementById("register-form");


registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            document
                .getElementById("register-name")
                .value
                .trim();

        const email =
            document
                .getElementById("register-email")
                .value
                .trim();

        const password =
            document
                .getElementById("register-password")
                .value
                .trim();

        const confirmPassword =
            document
                .getElementById("confirm-password")
                .value
                .trim();


        if (
            name === "" ||
            email === "" ||
            password === "" ||
            confirmPassword === ""
        ) {

            alert("Please fill in all fields.");
            return;
        }


        if (password.length < 6) {

            alert(
                "Password must be at least 6 characters."
            );

            return;
        }


        if (password !== confirmPassword) {

            alert("Passwords do not match.");
            return;
        }


        const user = {
            username: name,
            email: email,
            password: password
        };


        try {

            const response = await fetch(
                `${API_BASE_URL}/users/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(user)
                }
            );


            if (!response.ok) {

                let errorMessage =
                    "Registration failed.";

                try {

                    const errorData =
                        await response.json();

                    if (errorData.message) {
                        errorMessage =
                            errorData.message;
                    }

                } catch (error) {

                    console.error(
                        "Could not read error response:",
                        error
                    );
                }


                alert(errorMessage);
                return;
            }


            alert(
                "Registration successful."
            );


            window.location.href =
                "login.html";


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            alert(
                "Unable to connect to the SkillQuest server."
            );
        }

    }
);


const showRegisterPassword =
    document.getElementById(
        "show-register-password"
    );


showRegisterPassword.addEventListener(
    "change",
    () => {

        const passwordInput =
            document.getElementById(
                "register-password"
            );

        const confirmPasswordInput =
            document.getElementById(
                "confirm-password"
            );


        const type =
            showRegisterPassword.checked
                ? "text"
                : "password";


        passwordInput.type = type;
        confirmPasswordInput.type = type;

    }
);