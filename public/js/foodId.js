// This finds the foods id from the form they submit, then you require it in the app.js to
// send to the route to show the page of the food, the route will search for the food.

const input = document.querySelector("#searchForm");
const searchDiv = document.querySelector(".search");
const searchQuery = window.location.search.slice(8);

// input.addEventListener("submit", async (e) => {
// //   e.preventDefault();
//   if (!input.searchFood.value) {
//     console.log("Sorry, nothing found");
//   } else {
//     api_url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(
//       params.api_key
//     )}&query=${encodeURIComponent(
//       input.searchFood.value
//     )}&dataType=${encodeURIComponent(
//       params.dataType
//     )}&pageSize=${encodeURIComponent(params.pagesize)}`;
//     const data = await getData();
//     console.log(data);
//     input.searchFood.value = "";
//     displayRes(data);
//   }
// });

// input.addEventListener("submit", async (e) => {
//     dataGrab();
// });

// Food Data Center API
const params = {
  api_key: "baxUmQv1cwFdluJZ6Y6v1BLwLU9ibtQUfiJLUeX3",
  query: searchQuery,
  dataType: ["Survey (FNDDS)"],
  pagesize: 20,
  pageNumber: 2,
};

let api_url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(
  params.api_key
)}&query=${encodeURIComponent(params.query)}&dataType=${encodeURIComponent(
  params.dataType
)}&pageSize=${encodeURIComponent(
  params.pagesize
)}&pageNumber=${params.pageNumber}`;

function getData() {
  return fetch(api_url)
    .then((response) => response.json())
    .catch((e) => {
      console.log(e);
    });
}

function displayRes(data) {
  // console.log(data.foods);

    for (let i = 0; i < data.foods.length; i++) {
      const div = document.createElement("div");
      const a = document.createElement("a");
      a.innerText = `${data.foods[i].description}` //fdcId
      // a.setAttribute("href", `/api/${data.foods[i].description.replace("%", "%25")}?id=${data.foods[i].fdcId}`)
      a.setAttribute("href", `/food/${data.foods[i].fdcId}`);
      searchDiv.append(a);
  }
}


async function dataGrab() {
  if (searchQuery) {
    api_url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(
        params.api_key
      )}&query=${encodeURIComponent(
        searchQuery
      )}&dataType=${encodeURIComponent(
        params.dataType
      )}&pageSize=${encodeURIComponent(params.pagesize)}`;
  const data = await getData();
    console.log(data);
    input.searchFood.value = "";
    displayRes(data);
  if (data.foods.length == 0) {
    // Nothing Found
    // Add class of nothing found.
    console.log("Nothing Found");
    
  }
  }
  else {
    console.log("Find food data")
  }
}


dataGrab();