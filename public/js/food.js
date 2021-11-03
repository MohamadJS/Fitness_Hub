// const number = window.location.search.slice(4);

// Store id in the form
// const formId = document.querySelector("#food-id");
// formId.value = number;
// Set the calender to current date.
const calender = document.getElementById('date-picker');
const date = new Date();

if (calender) {
    calender.value = date.getFullYear().toString() + '-' +
    (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0);
}


const id = document.querySelector("#food-id");

const params = {
    api_key: "baxUmQv1cwFdluJZ6Y6v1BLwLU9ibtQUfiJLUeX3",
    fdcId: id.value,
    nutrients: [208, 203, 204, 205, 291, 269, 301, 303, 306, 307, 401, 320, 606, 645, 646, 601],
    // label: ["cal", "prot", "fat", "carbs", "fiber", "sugar", "calcium", "iron", "magnesium", "potassium",
    // "sodium", "vitmain c", "vitamin a", "saturated fat", "monounsaturated fat", "polyunsaturated fat", "cholesterol"]
};
  
let api_url = `https://api.nal.usda.gov/fdc/v1/foods/?api_key=${
    params.api_key
  }&fdcIds=${params.fdcId}&nutrients=${params.nutrients}`; //&nutrients=${params.nutrients}
  
function getData() {
    return fetch(api_url)
        .then((response) => response.json())
        .catch((e) => {
            console.log(e);
        });
};

// Represents previous nutrient values
let previousNutrients = [];

const nutrientLabels = [
    { label: "Calories", value: 208, sub: 0 },
    { label: "Carbs", value: 256, sub: 3 },
    { label: "Dietary Fiber", value: 291, sub: 4 },
    { label: "Sugar", value: 269, sub: 5 },
    { label: "Fat", value: 204, sub: 2 },
    { label: "Saturated", value: 606, sub: 12 },
    { label: "Polyunsaturated", value: 646, sub: 14 },
    { label: "Monounsaturated", value: 645, sub: 13 },
    { label: "Protein", value: 203, sub: 1 },
    { label: "Sodium", value: 307, sub: 9 },
    { label: "Potassium", value: 306, sub: 8 },
    { label: "Cholesterol", value: 601, sub: 15 },
    { label: "Vitamin A", value: 320, sub: 11 },
    { label: "Vitamin C", value: 401, sub: 10 },
    { label: "Calcium", value: 301, sub: 6 },
    { label: "Iron", value: 303, sub: 7 }
]

async function displayOptions() {
    const placeholder = document.querySelector("option");
    const data = await getData();
    console.log(data);
    const foodPortions = data[0].foodPortions.length - 1;

    placeholder.remove();

    for (let i = -1; i < foodPortions; i++) {
        const option = document.createElement("option")
        if (i !== -1) {
            option.value = data[0].foodPortions[i].gramWeight;
            option.text = data[0].foodPortions[i].portionDescription;
        } else {
            option.value = 100;
            option.text = "100g";
        }
        servingSize.append(option);
    }

    for (let i = 0; i < 16; i++) {
        previousNutrients[i] = data[0].foodNutrients[nutrientLabels[i].sub].amount;
    }
}
displayOptions();

const nutrients = document.querySelectorAll(".nutrients");
const servingSize = document.querySelector("select");

// Represents the previous Serving Size option
let previousOption = 100;

const foodAmt = document.querySelector("#serving-size");

// Serving Size Calculator
servingSize.addEventListener("change", e => {
    for (let i = 0; i < nutrients.length; i++) {
        nutrients[i].innerText = (Math.round((parseInt(e.target.value) / previousOption) * previousNutrients[i] * amountInput.value));
    }
    // console.log(e);
    // console.log(e.target.innerText);
    foodAmt.value = e.target.options[e.target.selectedIndex].text;
})

// Amount per Serving Calculator
const amountInput = document.querySelector("#amount");

amountInput.addEventListener("input", e => {
    if (e.target.value < 0) e.target.value = 1;
    console.log(e.target.value);
})

amountInput.addEventListener("change", e => {
    if (e.target.value <= 0 || e.target.value === undefined) e.target.value = 1;
    if (!e.target.value) e.target.value = 1;
    console.log(nutrients[0]);
    for (let i = 0; i < nutrients.length; i++) {
        nutrients[i].innerText = (Math.round((parseInt(servingSize.value) / previousOption) * previousNutrients[i] * e.target.value));
    }
    console.log(e.target.value);

})


// console.log(previousNutrients[0]);