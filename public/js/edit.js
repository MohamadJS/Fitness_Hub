const myDate = document.querySelector(".date");
let myDateText = myDate.innerText;
// let newDate = new Date(myDate);
// newDate.setDate(myDate);

const month = (parseInt(myDateText[5] + myDateText[6]) - 1);
const day = myDateText[8] + myDateText[9];
const year = myDateText[0] + myDateText[1] + myDateText[2] + myDateText[3];

let newDate = new Date(year, month, day);

const months =
    ["January", "Febuaray", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];


const strDate = `${months[month]} ${newDate.getDate()}, ${newDate.getFullYear()}`;

myDate.innerText = strDate;

// const str = "1/4";
const str = document.querySelector(".servings");
console.log(str);
// const substring = str.substring()
const serving = 0.1;
let matches = str ? str.innerText.match(/\d/g): null;

// const subString = str.innerText.splice(0, 3).replace(/[0-9]/g, '');
// console.log(subString);

// If serving size is 100g
if (matches && matches.length === 3) {
    // const subString = str.innerText.slice(0, 2).replace(/[0-9]/g, '');
    // const fullString = str.innerText.slice(2, str.innerText.length - 3);
    const subString = str.innerText.slice(3, str.innerText.length);
    const servingSize = serving * parseInt(matches[0] + matches[1] + matches[2]);
    str.innerText = servingSize + subString;
    console.log(servingSize);
}
// If serving size is a fraction (1/2)
else if (matches && matches.length === 2) {
    if (serving !== 1) {
        const subString = str.innerText.slice(0, 2).replace(/[0-9]/g, '');
        const fullString = str.innerText.slice(3, str.innerText.length);
        let servingSize = serving * (parseInt(matches[0]) / parseInt(matches[1]));
        if (servingSize === 0.5)
            servingSize = "1/2";
        else if (servingSize === 0.25)
            servingSize = "1/4";
        str.innerText = servingSize + fullString;
        console.log(servingSize);
    } else {
        const servingSize = str;
        console.log(servingSize);
    }
}
// If serving size is a single digit (1)
else if (matches && matches.length === 1) {
    const servingSize = serving * parseInt(matches[0]);
    // const subString = str.innerText.slice(0, 0).replace(/[0-9]/g, '');
    const subString = str.innerText.slice(1, str.innerText.length);
    console.log(servingSize);
    if (servingSize === 0.5) {
        str.innerText = `1/2${subString + fullString}`
    } else {
        str.innerText = servingSize + subString;
    }
    console.log(str.innerText);
}

const modalAdd = document.querySelector(".modal-add");
    const triggerAdd = document.querySelectorAll(".trigger");
    const closeButtonAdd = document.querySelector(".close-button-add");

    function toggleModal() {
        modalAdd.classList.toggle("show-modal-add");
    }

    function windowOnClick(event) {
        if (event.target === modalAdd) {
            toggleModal();
        }
    }

    for (triggers of triggerAdd) 
        triggers.addEventListener("click", toggleModal);
    closeButtonAdd.addEventListener("click", toggleModal);

const next = document.querySelector(".next");
const prev = document.querySelector(".previous");
const dateSelector = document.querySelector("#date-selector");

next.addEventListener("click", () => {
    const dateVal = new Date((new Date(Date.parse(dateSelector.value))).valueOf() + 86400000 + 86400000);
    updatePage(dateVal);
    // const newDateVal = new Date(dateVal);
    // console.log(newDateVal);
    // const newUrl = newDateVal.getFullYear() + '-' + ((newDateVal.getMonth() + 1) < 10 ? '0' + (newDateVal.getMonth() + 1) : (newDateVal.getMonth() + 1)) + '-' + (newDateVal.getDate() < 10 ? '0' + newDateVal.getDate() : newDateVal.getDate());
    // window.location.href = (window.location.origin += `/diary/${newUrl}`);
})

prev.addEventListener("click", () => {
    const dateVal = new Date((new Date(Date.parse(dateSelector.value))).valueOf());
    updatePage(dateVal);
    // const newDateVal = new Date(dateVal);
    // console.log(newDateVal);
    // const newUrl = newDateVal.getFullYear() + '-' + ((newDateVal.getMonth() + 1) < 10 ? '0' + (newDateVal.getMonth() + 1) : (newDateVal.getMonth() + 1)) + '-' + (newDateVal.getDate() < 10 ? '0' + newDateVal.getDate() : newDateVal.getDate());
    // window.location.href = (window.location.origin += `/diary/${newUrl}`);
})

function updatePage(value) {
    const newDateVal = new Date(value);
    console.log(newDateVal);
    const newUrl = newDateVal.getFullYear() + '-' + ((newDateVal.getMonth() + 1) < 10 ? '0' + (newDateVal.getMonth() + 1) : (newDateVal.getMonth() + 1)) + '-' + (newDateVal.getDate() < 10 ? '0' + newDateVal.getDate() : newDateVal.getDate());
    window.location.href = (window.location.origin += `/diary/${newUrl}`);
}