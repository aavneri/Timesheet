import Swal from "sweetalert2";
const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

const Logout = () => {
    return Toast.fire({
        icon: "info",
        title: "Logging Out...",
    }).then(() => {
        window.dispatchEvent(new Event("logout"));
        localStorage.removeItem("userInfo");
    });
};

export default Logout;
