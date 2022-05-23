const input = document.querySelector("#searchForm");
const searchDiv = document.querySelector(".search");

// Listens for
input.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!input.searchFood.value) {
	  reset();
  } else {
    api_url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(
      params.api_key
    )}&query=${encodeURIComponent(
      input.searchFood.value
    )}&dataType=${encodeURIComponent(
      params.dataType
    )}&pageSize=${encodeURIComponent(params.pagesize)}`;
    reset();
    await displayRes(getData, input.searchFood.value.trim());
    input.searchFood.value = "";
  }
});

// Food Data Center API
const params = {
  api_key: "baxUmQv1cwFdluJZ6Y6v1BLwLU9ibtQUfiJLUeX3",
  query: input.searchFood.value,
  dataType: ["Survey (FNDDS)", "SR Legacy Foods"],
  pagesize: 1,
};

let api_url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(
  params.api_key
)}&query=${encodeURIComponent(params.query)}&dataType=${encodeURIComponent(
  params.dataType
)}&pageSize=${encodeURIComponent(params.pagesize)}`;

function getData() {
  return fetch(api_url)
    .then((response) => response.json())
    .catch((e) => {
      console.log(e);
    });
}

// Displays Nutritional information on the screen
async function displayRes(data, name) {
  const nutritionInfo = await data();
  if (nutritionInfo?.foods[0]) {
  }
    const resDiv = document.createElement("div");
    const nutritionContainer = document.createElement("div");

    const label = {
      carbs: ["Carbs", "Dietary Fiber", "Sugar", "Fat", "Saturated", "Polyunsaturated", "Monounsaturated", "Protein"],
      fats: ["Fat", "Saturated", "Polyunsaturated", "Monounsaturated"],
      protein: ["Protein"],
      nutrients: ["Sodium", "Potassium", "Cholesterol", "Vitamin A", "Vitamin C", "Calcium", "Iron"],
      vitamins: ["Vitamin A", "Vitamin C", "Calcium", "Iron"]
    };

    // Position of corresponding label from API
    const directory = {
      carbs: [2, 9, 8, 1, 43, 64, 63, 0],
      fats: [1, 43, 64, 63],
      protein: [0],
      nutrients: [15, 14, 42, 20, 28, 10, 11],
      vitamins: [20, 28, 10, 11]
    }

    const h2 = document.createElement("h2");
    const h3 = document.createElement("h3");

    foodName = name.replace(name[0], name[0].toUpperCase());

    h2.append(nutritionInfo.foods[0].description);
    h3.append(nutritionInfo.foods[0].foodCategory);
    h2.classList.add("title");
    h3.classList.add("description");

    resDiv.append(h2);
    resDiv.append(h3);
    resDiv.classList.add("nutrition");
    searchDiv.insertAdjacentElement("afterend", resDiv);

    // Calories
    const calories = document.createElement("p");
    calories.append(`${nutritionInfo.foods[0].foodNutrients[3].value} Calories`);
    resDiv.append(calories);

    nutritionContainer.classList.add("nutrition-container");
    resDiv.append(nutritionContainer);



    // Carbs
    appendRes(label.carbs, directory.carbs, nutritionInfo.foods[0].foodNutrients, "g", nutritionContainer);

    // Nutrients
    appendRes(label.nutrients, directory.nutrients, nutritionInfo.foods[0].foodNutrients, "mg", nutritionContainer);
  }

function appendRes(name, dir, data, unit, div) {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("nutrition-section");
  div.append(itemDiv);
  for (let i = 0; i < name.length; i++) {
    const p = document.createElement("p");
    const span = document.createElement("span");
    span.append(`${parseInt(data[dir[i]].value)}${unit}`);
    p.append(`${name[i]}`, span);
    p.classList.add("item");
    itemDiv.append(p);
  }
}

// Resets the output when searching for a new item
function reset() {
  const foodInfo = document.querySelectorAll(".nutrition");
  for (let i = 0; i < foodInfo.length; i++) {
    foodInfo[i].remove();
  }
}
