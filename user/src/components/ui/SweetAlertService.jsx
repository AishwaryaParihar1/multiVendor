import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css"; 

// ✅ Custom CSS tweak
const toastOffsetStyle = document.createElement("style");
toastOffsetStyle.innerHTML = `
  .swal2-top-end {
    top: 55px !important;  /* 👈 upar se 15px ka gap */
    right: 15px !important;
  }
`;
document.head.appendChild(toastOffsetStyle);

const SweetAlertService = {
  showSuccess: (title, text = "", timer = 2000) => {
    Swal.fire({
      icon: "success",
      title: title,
      text: text,
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      toast: true,
      position: "top-end",
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  },

  showError: (title, text = "Something went wrong!", timer = 3000) => {
    Swal.fire({
      icon: "error",
      title: title,
      text: text,
      confirmButtonText: "OK",
      toast: true,
      position: "top-end",
      timer: timer,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  },

  showConfirm: async (
    title,
    text = "You won't be able to revert this!",
    confirmButtonText = "Yes, confirm it!"
  ) => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8D6749",   // Your primary theme color
      cancelButtonColor: "#4E5D45",    // Your secondary theme color
      confirmButtonText: confirmButtonText,
    });
    return result.isConfirmed;
  },

  showInfo: (title, text = "", timer = 2000) => {
    Swal.fire({
      icon: "info",
      title: title,
      text: text,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  },
};

export default SweetAlertService;
