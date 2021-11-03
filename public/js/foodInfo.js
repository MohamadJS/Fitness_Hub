
// make a bool, called isDataDisplayed, set it to false, until we recieved the data, then set the bool to true.
// If it is false, play a css spinner, once it if true, set display to hidden.


// const number = window.location.pathname.slice(5);

const number = window.location.search.slice(4);

const main = document.querySelector("main");

const params = {
    api_key: "baxUmQv1cwFdluJZ6Y6v1BLwLU9ibtQUfiJLUeX3",
    fdcId: number,
    nutrients: [208, 203, 204, 205, 291, 269, 301, 303, 306, 307, 401, 320, 606, 645, 646, 601],
    // label: ["cal", "prot", "fat", "carbs", "fiber", "sugar", "calcium", "iron", "magnesium", "potassium",
    // "sodium", "vitmain c", "vitamin a", "saturated fat", "monounsaturated fat", "polyunsaturated fat", "cholesterol"]
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
    console.log(data[0]);

    // const titleDiv = document.createElement("div");
    // const h1 = document.createElement("h1");
    // h1.append(data[0].description);
    // titleDiv.append(h1);
    const nutritionDiv = document.createElement("div");
    main.append(nutritionDiv);
    // nutritionDiv.append(titleDiv);

    // portion
    const label = document.createElement("p");
    label.append("Serving Size: ")

    const servingSize = document.querySelector("select");
    nutritionDiv.append(label, servingSize);

    const foodPortions = data[0].foodPortions.length - 1;


    // do the value (g) / 100 (g) then multiply that result by the value of the nutrient.
    // So protein is 26.7g so you do 17/100 = 0.17 now we multiply by 26.7, protein is now 4.5g


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

    // display nutrients

    // for (let i = 0; i < 16; i++) {
    //     const nutrientLabelDiv = document.createElement("div");
    //     const p = document.createElement("p");
    //     const span = document.createElement("span");
    //     span.append(`${Math.round(data[0].foodNutrients[nutrientLabels[i].sub].amount)}`)
    //     p.append(`${nutrientLabels[i].label} `);
    //     p.append(span);
    //     // nutrientLabelDiv.append(p);
    //     // nutritionDiv.append(nutrientLabelDiv);
    //     nutritionDiv.append(p);
    // }
}
// console.dir(number);


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

// setTimeout(() => {
//     servingSize = document.querySelector("select");
//     servingSize.addEventListener("change", e => {
//         console.log(e);
//         console.log(e.target.value / previousOption)
//         const nutrients = document.querySelectorAll("span");
//         console.log(nutrients)
//         console.log(typeof (e.target.value))
//         // for (let nutrient of nutrients) {
//         //     console.log((e.target.value / previousOption))
//         //     console.log(parseInt(nutrient.innerText))
//         //     nutrient.innerText = Math.round((parseInt(e.target.value) / previousOption) * parseInt(nutrient.innerText));
//         // }
//         // previousOption = e.target.value;
//         for (let i = 0; i < nutrients.length; i++) {
//             nutrients[i].innerText = (Math.round((parseInt(e.target.value) / previousOption) * previousNutrients[i]));
//             previousNutrients[i] = ((parseInt(e.target.value) / previousOption) * previousNutrients[i]);
//         }
//         previousOption = e.target.value;
//     })
// }, 300)



// current option / previous option.

// console.log(servingSize);
// console.dir(Math)
// do {
//     servingSize = document.querySelector("select");
// } while (!servingSize);



//Array of previous Nutrients
// We are gonna use this to multiply with the previous option.
// We arn't gonna round until we get our final ansswer to see what we get.


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

console.log(previousNutrients);

// setTimeout(e => {
//     nutrientsCounter();
//     console.log(previousNutrients[0]);
// }, 3000)


// Find the one gram of foodPortions, then convert into the following grams that is desired.