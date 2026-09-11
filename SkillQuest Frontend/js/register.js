if (
    localStorage.getItem(
        "isLoggedIn"
    ) === "true"
) {

    window.location.href =
        "Dashboard.html";

}

const registerForm =
    document.getElementById("register-form");


registerForm.addEventListener(
    "submit",
    (event) => {

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

            alert(
                "Please fill in all fields."
            );

            return;
        }


        if (password.length < 6) {

            alert(
                "Password must be at least 6 characters."
            );

            return;
        }


        if (
            password !== confirmPassword
        ) {

            alert(
                "Passwords do not match."
            );

            return;
        }

const existingUser =
    localStorage.getItem(
        "skillQuestUser"
    );


if (existingUser) {

    const storedUser =
        JSON.parse(existingUser);


    if (
        storedUser.email === email
    ) {

        alert(
            "An account with this email already exists."
        );

        return;
    }

}


        const user = {
            name: name,
            email: email,
            password: password
        };


        localStorage.setItem(
            "skillQuestUser",
            JSON.stringify(user)
        );


        alert(
            "Registration successful."
        );


        window.location.href =
            "login.html";

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