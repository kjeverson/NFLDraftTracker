function packNewToast(color, icon, prompt, message) {

    var newToast = document.createElement('div');
    newToast.classList.add("toast-body", color, "p-2", "m-2", "text-white");
    newToast.innerHTML = '<i class="' + icon + '"></i><strong> ' + prompt + '</strong> ' + message;

    var newToastObj = new bootstrap.Toast(newToast);

    var container = document.getElementById("toastContainer");
    container.appendChild(newToast);

    newToastObj.show();
}