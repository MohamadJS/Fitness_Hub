const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
    modal.classList.toggle("show-modal");
    if (modal.classList.contains("show-modal")) {
        const main = document.querySelector("main");
        main.classList.add("no-scroll");
    }
}

// Get name of food from h1.

const modalTitle = document.querySelector(".modal-title");
const id = document.querySelector(".id");


// Search api with that name.

const params = {
    api_key: "baxUmQv1cwFdluJZ6Y6v1BLwLU9ibtQUfiJLUeX3",
    fdcId: id.innerText,
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

const defaultOption = document.querySelector("#food-portion");

async function displayOptions() {
    const placeholder = document.querySelector("option");
    const data = await getData();
    const foodPortions = data[0].foodPortions.length - 1;

    placeholder.remove();

    for (let i = -1; i < foodPortions; i++) {
        const option = document.createElement("option")
        if (i !== -1) {
            // Every other option
            if (i != 0) {
                option.value = data[0].foodPortions[i].gramWeight;
                option.text = data[0].foodPortions[i].portionDescription;   
            }
            if (defaultOption.value == 100);
            else if (i == 0) {
            option.value = 100;
            option.text = "100g";
            }
        } else {
            // First Value in option
            option.value = defaultOption.value;
            option.text = defaultOption.innerText;
            if (option.value == parseInt(data[0].foodPortions[i+1].gramWeight)) {
                option.value = defaultOption.value;
                option.text = defaultOption.innerText;
            }

        }
        if (option.value)
            servingSize.append(option);
    }

}

const nutrients = document.querySelectorAll(".nutrients");
const amountInput = document.querySelector("#amount");
const servingSize = document.querySelector("select");
displayOptions();

for (let i = 0; i < 16; i++) {
    previousNutrients[i] = Math.round(parseInt(nutrients[i].innerText));
}

const foodPortion = document.querySelector("#food-portion");

// Represents the previous Serving Size option
let previousOption = 100

const foodAmt = document.querySelector("#serving-size");

// Serving Size Calculator
servingSize.addEventListener("change", e => {
    for (let i = 0; i < nutrients.length; i++) {
        nutrients[i].innerText = (Math.round((parseInt(e.target.value) / previousOption) * previousNutrients[i] * amountInput.value));
    }
})

// Update amount per serving. (Number of Servings)

amountInput.addEventListener("input", e => {
    if (e.target.value < 0) e.target.value = 1;
})
    
amountInput.addEventListener("change", e => {
    if (e.target.value <= 0 || e.target.value === undefined) e.target.value = 1;
    if (!e.target.value) e.target.value = 1;
        
    // If the defaultOption is not 100g, and they change it back to 100g this is required.
    if (servingSize.value == 100) {
        for (let i = 0; i < nutrients.length; i++) 
            nutrients[i].innerText = Math.round(1 * previousNutrients[i] * e.target.value);
    }
    else {
        for (let i = 0; i < nutrients.length; i++) {
            nutrients[i].innerText = (Math.round((parseInt(servingSize.value) / previousOption) * previousNutrients[i] * e.target.value));
        }
    } 
})


for (nutrient of nutrients) {
    nutrient.innerText = Math.round(parseInt(nutrient.innerText) * parseInt(amountInput.value) * parseInt());
}

for (let i = 0; i < nutrients.length; i++) {
    nutrients[i].innerText = (Math.round((parseInt(servingSize.value) / previousOption) * previousNutrients[i] * amountInput.value));
}