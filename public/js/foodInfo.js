const number = window.location.search.slice(4);

const main = document.querySelector("main");

const params = {
    api_key: "baxUmQv1cwFdluJZ6Y6v1BLwLU9ibtQUfiJLUeX3",
    fdcId: number,
    nutrients: [208, 203, 204, 205, 291, 269, 301, 303, 306, 307, 401, 320, 606, 645, 646, 601],
};
  
let api_url = `https://api.nal.usda.gov/fdc/v1/foods/?api_key=${encodeURIComponent(
    params.api_key
  )}&fdcIds=${encodeURIComponent(params.fdcId)}&nutrients=${params.nutrients}`;
  
function getData() {
    return fetch(api_url)
        .then((response) => response.json())
        .catch((e) => {
            console.log(e);
        });
};

async function displayRes() {
    const data = await getData();
    const nutritionDiv = document.createElement("div");
    main.append(nutritionDiv);

    // portion
    const label = document.createElement("p");
    label.append("Serving Size: ")

    const servingSize = document.querySelector("select");
    nutritionDiv.append(label, servingSize);

    const foodPortions = data[0].foodPortions.length - 1;

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
}


// Labels for api, with value of nutrient nubmer, and subscript of array position from API.
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

displayRes();

const servingSize = document.querySelector("select");

let previousOption = 100;

servingSize.addEventListener("change", e => {
    const nutrients = document.querySelectorAll("span");
    for (let i = 0; i < nutrients.length; i++) {
        nutrients[i].innerText = (Math.round((parseInt(e.target.value) / previousOption) * previousNutrients[i]));
        previousNutrients[i] = ((parseInt(e.target.value) / previousOption) * previousNutrients[i]);
    }
    previousOption = e.target.value;
})

// This copies all of the previous nutrition info for the previous option that was selected.
// This is to keep the macros and vitamins the same values, and stop rounding errors.

let previousNutrients = [];

async function nutrientsCounter() {
    const data = await getData();
    for (let i = 0; i < 16; i++) {
        previousNutrients[i] = data[0].foodNutrients[nutrientLabels[i].sub].amount;
    }
}

nutrientsCounter();
