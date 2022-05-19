const un = document.querySelector("#username");
const pw = document.querySelector("#password");
const message = document.querySelectorAll(".invalid-feedback");
const form = document.querySelector(".validated-form");

un.addEventListener("input", (e) => feedback(e, message[0]));
pw.addEventListener("input", (e) => feedback(e, message[1]));

function feedback(e, iMessage) {
    if (e.target.value.trim() == '') {
        iMessage.classList.add("active");
        e.target.name == "username" ? un.classList.add("invalid") : pw.classList.add("invalid");
    } else {
        if (iMessage.classList.contains("active"));
            iMessage.classList.remove("active");
        e.target.name == "username" ? un.classList.remove("invalid") : pw.classList.remove("invalid");
    }
}


form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (un.value.trim() == '' || pw.value.trim() == '') {
        e.preventDefault();
        if (un.value.trim() == '') {
            message[0].classList.add("active");
            un.classList.add("invalid");
        }
        if (pw.value.trim() == '') {
            message[1].classList.add("active");
            pw.classList.add("invalid");
        }
    } else {
        form.submit();
    }
})