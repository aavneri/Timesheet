const Logout = () => {
    window.dispatchEvent(new Event("logout"));
    localStorage.removeItem("userInfo");
};

export default Logout;
