export function requestConfig() {
    return { headers: { "Content-type": "application/json" } };
}

export function authRequestConfig() {
    const user = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;

    if (user && user.token) {
        const config = requestConfig();
        config.headers.Authorization = "Bearer " + user.token;
        return config;
    } else {
        return requestConfig();
    }
}
