// https://rapidapi.com/msilverman/api/nutritionix-nutrition-database/
// app ID: 2839acf8
// App keys: 082178427b2ab7068557ee9560a980e4

// axios.request(options).then(function (response) {
// 	console.log(response.data);
// }).catch(function (error) {
// 	console.error(error);
// });

// const nutrition = async (e) => {
// 	try {
// 		const config = { params: {fields: 'item_name,item_id,brand_name,nf_calories,nf_total_fat'}, headers: {'x-rapidapi-host': 'nutritionix-api.p.rapidapi.com', "x-app-id": "2839acf8", "x-app-key": "082178427b2ab7068557ee9560a980e4" } }
// 		const data = await axios.get("https://nutritionix-api.p.rapidapi.com/v2/search/", config);
// 		console.log(data);
// 	}
// 	catch (e) {
// 		console.log(e);
// 	}
// }

const input = document.querySelector("#searchForm");
const searchDiv = document.querySelector(".search");

// Listens for
input.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!input.searchFood.value) {
	  console.log("Sorry, nothing found");
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
    // await getNutrition(getData);
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

// getData().then(data => {
// 	// console.log(data.foods[0].foodNutrients)
// 	for (let i = 0; i < 3; i++) {
// 		console.log(data.foods[0].foodNutrients[i])
// 	}
// })

// async function getNutrition(data) {
//   const nutritionInfo = await data();
//   displayRes(nutritionInfo);
// }
// getNutrition(getData)

// Displays Nutritional information on the screen
async function displayRes(data, name) {
  const nutritionInfo = await data();
  if (!nutritionInfo.foods[0]) {
    console.log("Not Found")
  } else {
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

    console.log(nutritionInfo);


    // Carbs
    appendRes(label.carbs, directory.carbs, nutritionInfo.foods[0].foodNutrients, "g", nutritionContainer);

    // Fats
    // appendRes(label.fats, directory.fats, nutritionInfo.foods[0].foodNutrients, "g", nutritionContainer);

    // // Protein
    // appendRes(label.protein, directory.protein, nutritionInfo.foods[0].foodNutrients, "g", nutritionContainer);

    // Nutrients
    appendRes(label.nutrients, directory.nutrients, nutritionInfo.foods[0].foodNutrients, "mg", nutritionContainer);
  }
  // Vitamins
  // appendRes(label.vitamins, directory.vitamins, nutritionInfo.foods[0].foodNutrients, "mg", nutritionContainer);
  // for (let i = 0; i < label.vitamins.length; i++) {
  //   const p = document.createElement("p");
  //   p.append(`${label.vitamins[i]}: ${Math.ceil(nutritionInfo.foods[0].foodNutrients[directory.vitamins[i]].value)}`)
  //   resDiv.append(p);
  // }

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

// const options = {
// 	method: 'GET',
// 	url: 'https://nutritionix-api.p.rapidapi.com/v1_1/search/cheddar%20cheese',
// 	params: {fields: 'item_name,item_id,brand_name,nf_calories,nf_total_fat'},
// 	headers: {'x-rapidapi-host': 'nutritionix-api.p.rapidapi.com'}
//   };

//   axios.request(options).then(function (response) {
// 	  console.log(response.data);
//   }).catch(function (error) {
// 	  console.error(error);
//   });
