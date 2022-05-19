// Search food query

// Get params from URL
let urlParams = (new URL(document.location)).searchParams;
let data = null;

// Nutrient text on left side of div on modal
const nutrientsTab = document.querySelector(".nutrients-tab");

const params = {
    api_key: "baxUmQv1cwFdluJZ6Y6v1BLwLU9ibtQUfiJLUeX3",
    query: urlParams.get("food"),
    dataType: ["Survey (FNDDS)"],
    pagesize: 25,
    pageNumber: 1,
  };
  
let api_url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(
  params.api_key
)}&query=${encodeURIComponent(params.query)}&dataType=${encodeURIComponent(
  params.dataType
)}&pageSize=${encodeURIComponent(
  params.pagesize
)}&pageNumber=${params.pageNumber}`;
  
// Search without refreshing page
const searchForm = document.querySelector("#search-form");
const search = document.querySelector("#search");

search.addEventListener("input", e => {
    params.query = e.target.value;
})

searchForm.addEventListener("submit", e => {
    e.preventDefault();
    updateUrl();
    search.value.trim() ? dataGrab() : null;
    search.value = "";
})

function updateUrl() {
    api_url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(
  params.api_key
)}&query=${encodeURIComponent(params.query)}&dataType=${encodeURIComponent(
  params.dataType
)}&pageSize=${encodeURIComponent(
  params.pagesize
)}&pageNumber=${params.pageNumber}`;
}

function getData(api) {
    return fetch(api)
        .then((response) => response.json())
        .catch((e) => {
            console.log(e);
        });
};


async function dataGrab() {
    data = await getData(api_url);
    if(data.foods)
        displayRes();
}

function deleteRes() {
    const div = document.querySelector(".result");
    const p = document.querySelectorAll(".item");
    div ? div.remove() : null;
    if (div) div.remove();
    else if (p) {
        p.forEach(i => { i.remove() });
        const foodTitle = document.querySelector(".food-title");
        if (foodTitle)
            foodTitle.remove();
        button ? button.remove() : null;
    }
    const searchImg = document.querySelector(".search-image");
    searchImg.classList.add("hidden");
    removeOptions();
}

function displayRes() {
    deleteRes();
    const div = document.createElement("div");
    div.classList.add("result");
    for (let info of data.foods) {
        const li = document.createElement("li");
        li.textContent = `${info.description}`;
        li.classList.add("item-result", "clickable");
        li.setAttribute("value", `${info.fdcId}`);
        div.append(li);
        nutrientsTab.insertAdjacentElement("afterbegin", div);
    }
    document.querySelector(".servings").classList.add("hidden");
    itemListener();
}

function itemListener() {
    const li = document.querySelectorAll(".item-result");
    
    li.forEach(function (item) {
        item.addEventListener("click", function() {
            // display food data for particular food here 
            paramsV2.query = item.value + "";
            getAndDisplayFoodInfo();
        })
    })
}

const paramsV2 = {
    api_key: "baxUmQv1cwFdluJZ6Y6v1BLwLU9ibtQUfiJLUeX3",
    query: "",
    dataType: ["Survey (FNDDS)"],
    pagesize: 1,
    pageNumber: 1,
  };


// Individual Food That is clicked on. display its information.
let food = null;
const nutrientsContainer = document.querySelectorAll(".nutrient-container");

const arrayPosition = [3, 2, 9, 8, 1, 43, 64, 63, 0, 15, 14, 42, 20, 28, 10, 11];
const arrayNames = ["Calories", "Total Carbohydrate", "Total Fiber", "Sugar", "Fat", "Saturated Fat",
    "Polyunsaturated Fat", "Monounsaturated Fat", "Protein", "Sodium", "Potassium",
    "Cholesterol", "Vitamin A", "Vitamin C", "Calcium", "Iron"];

async function getAndDisplayFoodInfo() {
    const api_url_v2 = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(
    paramsV2.api_key
  )}&query=${encodeURIComponent(paramsV2.query)}&dataType=${encodeURIComponent(
    paramsV2.dataType
  )}&pageSize=${encodeURIComponent(
    paramsV2.pagesize
  )}&pageNumber=${paramsV2.pageNumber}`;
    food = await getData(api_url_v2);
    displayFoodInfo();
}

function displayFoodInfo() {
    deleteRes();

    // display the nutrients by adding the p elements 
    for (let i = 0; i < 16; i++)
    i < 9 ? nutrientsContainer[0].append(addElements(i)) : nutrientsContainer[1].append(addElements(i));
    const nutrientsSpan = document.querySelector(".nutrients");
    calories.value = parseInt(nutrientsSpan.innerText);

    addServingSize();
    addFormInfo();

    const button = document.createElement("button");
    button.textContent = "Back";
    button.classList.add("button", "back-button");
    nutrientsContainer[1].append(button);
    updateButton();

    const h2 = document.createElement("h2");
    h2.append(food.foods[0].description);
    h2.classList.add("food-title");
    nutrientsTab.prepend(h2);
    document.querySelector(".servings").classList.remove("hidden");

    // Set the form data to current food selected.

    const foodName = document.querySelector("#food-name");
    foodName.value = food.foods[0].description;
    const servingSizeInput = document.querySelector("#serving-size");
    servingSizeInput.value = `${servingSize.options[servingSize.selectedIndex]?.text}`;

    const fdcId = document.querySelector("#food-id");
    fdcId.value = food.foods[0].fdcId;

}

// Adds elements to the nutrition information for one food.
function addElements(i) {
    const p = document.createElement("p");
    p.classList.add("item");

    const spanContainer = document.createElement("span");
    spanContainer.classList.add("unit");
    spanContainer.append()

    const spanNutrients = document.createElement("span");
    spanNutrients.classList.add("nutrients");
    spanNutrients.innerText = Math.round(food.foods[0].foodNutrients[arrayPosition[i]].value)

    const spanUnit = document.createElement("span");
    spanUnit.innerText = food.foods[0].foodNutrients[arrayPosition[i]].unitName.toLowerCase();
        
    spanContainer.append(spanNutrients, spanUnit);
    p.append(arrayNames[i], spanContainer);

    return p;
}

const servingSize = document.querySelector("#food-portion");
const servingAmount = document.querySelector("#amount");
function addServingSize() {

    if (food.foods[0].foodMeasures.length == 0) {
        const option = document.createElement("option");
        option.textContent = food.foods[0].description;
        option.value = 100;
        option.classList.add("option");
        servingSize.append(option);
    }

    for (let i = -1; i < food.foods[0].foodMeasures.length - 1; i++) {
        const option = document.createElement("option");
        if (i === -1) {
            option.textContent = "100g";
            option.value = 100;
        }
        else {
            option.textContent = `${food.foods[0].foodMeasures[i].disseminationText}`
            option.value = parseInt(food.foods[0].foodMeasures[i].gramWeight);
        }
        option.classList.add("option");
        servingSize.append(option);
    }

    addEvents();
}

function addFormInfo() {

}

function removeOptions() {

    const options = document.querySelectorAll(".option");
    for (let option of options)
        option.remove();
    servingAmount.value = 1;
        
    
}

function addEvents() {
    servingSize.addEventListener("change", (e) => {
        for (let i = 0; i < food.foods[0].foodNutrients.length; i++) {
            updateNutrients(e.target.value, servingAmount.value);
        }
        const servingSizeInput = document.querySelector("#serving-size");
        servingSizeInput.value = `${e.target.options[e.target.selectedIndex].text}`;
    })

    servingAmount.addEventListener("input", (e) => {
        updateNutrients(servingSize.value, e.target.value);
    })
}

const calories = document.querySelector("#calories");

function updateNutrients(servingSize, servingAmount) {
    const nutrientsSpan = document.querySelectorAll(".nutrients")
    for (let i = 0; i < arrayPosition.length; i++) {
        const value = Math.round(food.foods[0].foodNutrients[arrayPosition[i]].value * (servingSize / 100) * servingAmount);
        nutrientsSpan[i].innerText = value;
    }
    calories.value = parseInt(nutrientsSpan[0].innerText);
}

let button = document.querySelector(".back-button");

function updateButton() {
    button = document.querySelector(".back-button");
    
    button.addEventListener("click", () => {
        displayRes();
        // button.remove();
    })
}

const meal = document.querySelector("#meal");
const trigger = document.querySelectorAll(".trigger");

// Sets the meal selection to the button that was pressed correesponding to the meal.
trigger.forEach(function (el) {
    el.addEventListener("click", function (e) {
        for (let option of meal.options) {
            if (option.value == e.target.value)
                option.setAttribute("selected", "")
            else
                option.removeAttribute("selected", "");
        }
    })
})


//Update page when date input is updated.

const datePicker = document.querySelector("#date-selector");

datePicker.addEventListener("change", e => {
    window.location.href = `${window.location.origin}/diary/${e.target.value}`;
})