const dateSelector = document.querySelector("select");
const dates = document.querySelectorAll("option");

dateSelector.addEventListener("change", e => {
    window.location.href = `${window.location.href}/${e.target.value}`;
})
