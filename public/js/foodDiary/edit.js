const selectServingSize = document.querySelector("#selectServingSize");
const defaultOption = document.querySelector("#serving-size").value;

for (let servings of selectServingSize.options) {
    if (servings.textContent == defaultOption)
        selectServingSize.selectedIndex = servings.index;
}

const id = document.querySelector("#food-id");

const params = {
    api_key: "baxUmQv1cwFdluJZ6Y6v1BLwLU9ibtQUfiJLUeX3",
    fdcId: id.value,
    nutrients: [208, 203, 204, 205, 291, 269, 301, 303, 306, 307, 401, 320, 606, 645, 646, 601],
};
  
let api_url = `https://api.nal.usda.gov/fdc/v1/foods/?api_key=${
    params.api_key
  }&fdcIds=${params.fdcId}&nutrients=${params.nutrients}`;
  
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
let data = "";
// const selectServingSize = document.querySelector("#selectServingSize");


const servingSize = document.querySelector("select");

// Represents the previous Serving Size option
let previousOption = 100;

const nutrients = document.querySelectorAll(".nutrients");
const foodAmt = document.querySelector("#serving-size");

const initialNutrients = [];

for (let i = 0; i < nutrients.length; i++) {
    initialNutrients[i] = nutrients[i].innerText;
}

servingSize.addEventListener("change", e => {
    updateInformation();
    foodAmt.value = e.target.options[e.target.selectedIndex].text;
});

// Amount per Serving Calculator
const amountInput = document.querySelector("#amount");

amountInput.addEventListener("input", e => {
    if(e.target.value > 1000) {
        e.target.value = 1000;
        return;
    }
    if (e.target.value < 0) {
        e.target.value = 1;
    }
    updateInformation();

})

const calories = document.querySelector("#calories");

function updateInformation() {
    for (let i = 0; i < nutrients.length; i++)
        nutrients[i].innerText = Math.round((servingSize.value / 100) * initialNutrients[i] * amountInput.value);
    calories.value = nutrients[0].innerText;
}

for (let i = 0; i < nutrients.length; i++)
        nutrients[i].innerText = Math.round((servingSize.value / 100) * initialNutrients[i] * amountInput.value);
    calories.value = nutrients[0].innerText;