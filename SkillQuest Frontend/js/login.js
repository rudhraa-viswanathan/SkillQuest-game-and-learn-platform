if (
    localStorage.getItem(
        "isLoggedIn"
    ) === "true"
) {

    window.location.href =
        "Dashboard.html";

}

const loginForm =
    document.getElementById("login-form");


loginForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const email =
            document
                .getElementById("login-email")
                .value
                .trim();

        const password =
            document
                .getElementById("login-password")
                .value
                .trim();


        if (
            email === "" ||
            password === ""
        ) {

            alert(
                "Please fill in all fields."
            );

            return;
        }


        const savedUser =
            localStorage.getItem(
                "skillQuestUser"
            );


        if (!savedUser) {

            alert(
                "No registered user found. Please register first."
            );

            return;
        }


        const user =
            JSON.parse(savedUser);


        if (
            email === user.email &&
            password === user.password
        ) {

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );


            alert(
                "Login successful."
            );


            window.location.href =
                "Dashboard.html";

        } else {

            alert(
                "Invalid email or password."
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