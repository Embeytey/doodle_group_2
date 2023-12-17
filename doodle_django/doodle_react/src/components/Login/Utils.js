const isUserAuthenticated = () => {
    const token = sessionStorage.getItem("token");
    console.log("auth", !!token);
    return !!token;
};

const getUserInfo = () => {
    const user = sessionStorage.getItem("user");
    return JSON.parse(user) ? user : {};
};

export {isUserAuthenticated, getUserInfo}