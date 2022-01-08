// window.addEventListener("click", windowOnClick);

    


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
    pagesize: 20,
    pageNumber: 1,
  };
  
let api_url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(
  params.api_key
)}&query=${encodeURIComponent(params.query)}&dataType=${encodeURIComponent(
  params.dataType
)}&pageSize=${encodeURIComponent(
  params.pagesize
)}&pageNumber=${params.pageNumber}`;

// if (!urlParams.get("food")) {
//     const p = document.createElement("p");
//     p.append("Search for Food")
//     nutrientsTab.append(p);
// }
// if (urlParams.get("food")) {
//     modalAdd.classList.add("show-modal-add");
//     !urlParams.get("id") ? dataGrab() : null;
// }
  
// Search without refreshing page
const searchForm = document.querySelector("#search-form");
const search = document.querySelector("#search");

search.addEventListener("input", e => {
    // if (e.target.value.trim() == "") {
    //     var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    // }
    // else {
    //     var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?food=${e.target.value}`;
    // }
    // window.history.pushState({ path: newurl }, '', newurl);
    params.query = e.target.value;
    // console.log(e.target.value);
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
    console.log(data);
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
        // nutrientsTab.firstChild.remove();
        button ? button.remove() : null;
        // const h2 = document.querySelector(".food-title");
        // h2.remove();
        // button.remove();
        // nutrientsContainer.removeChild("h2");
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
        // p.setAttribute("href", `${document.location.href}&id=${info.fdcId}`);
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
            paramsV2.fdcId = item.value + "";
            getAndDisplayFoodInfo();
            console.log(item.value);
        })
    })

    // if (p) {
    //     p.addEventListener("click", e => {
    //         console.log("hey!");
    //     })
    // }
}


const paramsV2 = {
    api_key: "baxUmQv1cwFdluJZ6Y6v1BLwLU9ibtQUfiJLUeX3",
    fdcId: "",
    nutrients: [208, 203, 204, 205, 291, 269, 301, 303, 306, 307, 401, 320, 606, 645, 646, 601],
    // label: ["cal", "prot", "fat", "carbs", "fiber", "sugar", "calcium", "iron", "magnesium", "potassium",
    // "sodium", "vitmain c", "vitamin a", "saturated fat", "monounsaturated fat", "polyunsaturated fat", "cholesterol"]
};



// Individual Food That is clicked on. display its information.
let food = null;
const nutrientsContainer = document.querySelectorAll(".nutrient-container");

// const arrayPosition = [3, 2, 9, 8, 1, 43, 64, 63, 0, 15, 14, 42, 20, 28, 10, 11];
const arrayPosition = [0, 3, 4, 5, 2, 12, 14, 13, 1, 9, 8, 15, 11, 10, 6, 7]
const arrayNames = ["Calories", "Total Carbohydrate", "Total Fiber", "Sugar", "Fat", "Saturated Fat",
    "Polyunsaturated Fat", "Monounsaturated Fat", "Protein", "Sodium", "Potassium",
    "Cholesterol", "Vitamin A", "Vitamin C", "Calcium", "Iron"];

async function getAndDisplayFoodInfo() {
    const api_url_v2 = `https://api.nal.usda.gov/fdc/v1/foods?api_key=${paramsV2.api_key
}&fdcIds=${paramsV2.fdcId}&nutrients=${paramsV2.nutrients}`; 
    food = await getData(api_url_v2);
    displayFoodInfo();
    console.log(food);
}

function displayFoodInfo() {
    deleteRes();

    // display the nutrients by adding the p elements 
    for (let i = 0; i < 16; i++)
        i < 9 ? nutrientsContainer[0].append(addElements(i)) : nutrientsContainer[1].append(addElements(i));

    // for (let i = 9; i < 16; i++) {
    //     nutrientsContainer[1].append(addElements(i));
    // }

    addServingSize();
    addFormInfo();

    const button = document.createElement("button");
    button.textContent = "Back";
    button.classList.add("button", "back-button");
    nutrientsContainer[1].append(button);
    updateButton();

    const h2 = document.createElement("h2");
    h2.append(food[0].description);
    h2.classList.add("food-title");
    nutrientsTab.prepend(h2);
    document.querySelector(".servings").classList.remove("hidden");

    // Set the form data to current food selected.

    const foodName = document.querySelector("#food-name");
    foodName.value = food[0].description;
    const servingSizeInput = document.querySelector("#serving-size");
    servingSizeInput.value = `${servingSize.options[servingSize.selectedIndex].text}`;

    const fdcId = document.querySelector("#food-id");
    fdcId.value = food[0].fdcId;

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
    spanNutrients.innerText = Math.round(food[0].foodNutrients[arrayPosition[i]].amount);

    const spanUnit = document.createElement("span");
    spanUnit.innerText = food[0].foodNutrients[arrayPosition[i]].nutrient.unitName.toLowerCase();
        
    spanContainer.append(spanNutrients, spanUnit);
    p.append(arrayNames[i], spanContainer);

    return p;
}

const servingSize = document.querySelector("#food-portion");
const servingAmount = document.querySelector("#amount");
function addServingSize() {
    for (let i = -1; i < food[0].foodPortions.length - 1; i++) {
        const option = document.createElement("option");
        if (i === -1) {
            option.textContent = "100g";
            option.value = 100;
        }
        else {
            option.textContent = `${food[0].foodPortions[i].portionDescription}`
            option.value = parseInt(food[0].foodPortions[i].gramWeight);
        }
        option.classList.add("option");
        servingSize.append(option);
    }

    addEvents();
}

function addFormInfo() {

}

function removeOptions() {

    // Find out how to remove all options in a select
    const options = document.querySelectorAll(".option");
    for (let option of options)
        option.remove();
    servingAmount.value = 1;
    // for (let i = 0; i < servingSize.options.length - 1; i++) {
    //     servingSize.remove(0);
    // }
        
    
}

function addEvents() {
    servingSize.addEventListener("change", (e) => {
        console.log(e.target.value);
        for (let i = 0; i < food[0].foodNutrients.length; i++) {
            updateNutrients(e.target.value, servingAmount.value);
            // nutrientsSpan[i].textContent = `${Math.round(food[0].foodNutrients[arrayPosition[i]].amount * (e.target.value / 100) * servingAmount.value)}`;
        }
        const servingSizeInput = document.querySelector("#serving-size");
        servingSizeInput.value = `${e.target.options[e.target.selectedIndex].text}`;
    })

    servingAmount.addEventListener("input", (e) => {
        updateNutrients(servingSize.value, e.target.value);
    })
}

function updateNutrients(servingSize, servingAmount) {
    const nutrientsSpan = document.querySelectorAll(".nutrients")
    for (let i = 0; i < food[0].foodNutrients.length; i++) {
        const value = Math.round(food[0].foodNutrients[arrayPosition[i]].amount * (servingSize / 100) * servingAmount);
        nutrientsSpan[i].textContent = value;
    }
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
// const date = new Date();

// datePicker.value = date.getFullYear().toString() + '-' +
// (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0);

datePicker.addEventListener("change", e => {
    window.location.href = `${window.location.origin}/diary/${e.target.value}`;
})