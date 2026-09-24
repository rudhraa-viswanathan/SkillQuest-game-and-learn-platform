if (localStorage.getItem("jwtToken")) {
    window.location.href = "Dashboard.html";
}


const loginForm =
    document.getElementById("login-form");


loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const username =
            document
                .getElementById("login-username")
                .value
                .trim();

        const password =
            document
                .getElementById("login-password")
                .value
                .trim();


        if (
            username === "" ||
            password === ""
        ) {

            alert("Please fill in all fields.");
            return;
        }


        const loginData = {
            username: username,
            password: password
        };


        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(loginData)
                }
            );


            if (!response.ok) {

                let errorMessage =
                    "Invalid username or password.";

                try {

                    const errorData =
                        await response.json();

                    if (errorData.message) {
                        errorMessage =
                            errorData.message;
                    }

                } catch (error) {

                    console.error(
                        "Could not read login error:",
                        error
                    );
                }


                alert(errorMessage);
                return;
            }


            const data =
                await response.json();



            localStorage.setItem(
                "jwtToken",
                data.token
            );


            localStorage.setItem(
                "isLoggedIn",
                "true"
            );


            localStorage.setItem(
                "username",
                username
            );


            alert("Login successful.");


            window.location.href =
                "Dashboard.html";


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            alert(
                "Unable to connect to the SkillQuest server."
            );
        }

    }
);


const showLoginPassword =
    document.getElementById(
        "show-login-password"
    );


showLoginPassword.addEventListener(
    "change",
    () => {

        const passwordInput =
            document.getElementById(
                "login-password"
            );


        passwordInput.type =
            showLoginPassword.checked
                ? "text"
                : "password";

    }
);