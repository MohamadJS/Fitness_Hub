const myDate = document.querySelector(".date");
let myDateText = myDate.innerText;

const month = (parseInt(myDateText[5] + myDateText[6]) - 1);
const day = myDateText[8] + myDateText[9];
const year = myDateText[0] + myDateText[1] + myDateText[2] + myDateText[3];

let newDate = new Date(year, month, day);

const months =
    ["January", "Febuaray", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];


const strDate = `${months[month]} ${newDate.getDate()}, ${newDate.getFullYear()}`;

myDate.innerText = strDate;

const str = document.querySelector(".servings");
const serving = 0.1;

const modalAdd = document.querySelector(".modal-add");
const triggerAdd = document.querySelectorAll(".trigger");
const closeButtonAdd = document.querySelector(".close-button-add");
const html = document.querySelector("html");

function toggleModal() {
    modalAdd.classList.toggle("show-modal-add");
    html.classList.toggle("no-scroll");
}

// function windowOnClick(event) {
//     if (event.target === modalAdd) {
//         toggleModal();
//     }
// }

for (triggers of triggerAdd) 
    triggers.addEventListener("click", toggleModal);
closeButtonAdd.addEventListener("click", toggleModal);

const next = document.querySelector(".next");
const prev = document.querySelector(".previous");
const dateSelector = document.querySelector("#date-selector");

next.addEventListener("click", () => {
    const dateVal = new Date((new Date(Date.parse(dateSelector.value))).valueOf() + 86400000 + 86400000);
    updatePage(dateVal);
})

prev.addEventListener("click", () => {
    const dateVal = new Date((new Date(Date.parse(dateSelector.value))).valueOf());
    updatePage(dateVal);
})

function updatePage(value) {
    const newDateVal = new Date(value);
    const newUrl = newDateVal.getFullYear() + '-' + ((newDateVal.getMonth() + 1) < 10 ? '0' + (newDateVal.getMonth() + 1) : (newDateVal.getMonth() + 1)) + '-' + (newDateVal.getDate() < 10 ? '0' + newDateVal.getDate() : newDateVal.getDate());
    window.location.href = (window.location.origin += `/diary/${newUrl}`);
}