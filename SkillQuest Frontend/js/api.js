const API_BASE_URL = "http://localhost:8080/api";


function getJwtToken() {
    return localStorage.getItem("jwtToken");
}


async function authenticatedFetch(
    endpoint,
    options = {}
) {

    const token = getJwtToken();


    const headers = {
        ...options.headers
    };


    if (token) {
        headers["Authorization"] =
            `Bearer ${token}`;
    }


    if (
        options.body &&
        !headers["Content-Type"]
    ) {
        headers["Content-Type"] =
            "application/json";
    }


    const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
        ...options,
        headers: headers
    }
);


if (response.status === 401) {

    localStorage.removeItem("jwtToken");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    alert(
        "Your session has expired. Please login again."
    );

    window.location.href =
        "login.html";

    throw new Error(
        "Authentication required"
    );
}

if (response.status === 403) {

    console.warn(
        "Access forbidden for this request."
    );

}


return response;
}

async function getMyGameStats() {

    try {

        const response =
            await authenticatedFetch(
                "/game-stats"
            );


        if (!response.ok) {

            console.error(
                "Unable to load game stats."
            );

            return null;
        }


        return await response.json();


    } catch (error) {

        console.error(
            "Game stats error:",
            error
        );

        return null;
    }

}


// ========================================
// API ERROR MESSAGE HELPER
// ========================================

async function getApiErrorMessage(
    response,
    fallbackMessage =
        "Something went wrong."
) {

    try {

        const errorData =
            await response.json();


        if (errorData.message) {

            return errorData.message;

        }


        if (errorData.error) {

            return errorData.error;

        }


        return fallbackMessage;


    } catch (error) {

        return fallbackMessage;

    }

}


async function loadCurrentUser() {

    const response =
        await authenticatedFetch(
            "/users/me"
        );


    if (!response.ok) {

        return null;

    }


    const user =
        await response.json();


    localStorage.setItem(
        "username",
        user.username
    );


    localStorage.setItem(
        "role",
        user.role
    );


    return user;

}