

// const params = {
//     api_key: "baxUmQv1cwFdluJZ6Y6v1BLwLU9ibtQUfiJLUeX3",
//     fdcId: id,
//     nutrients: [208, 203, 204, 205, 291, 269, 301, 303, 306, 307, 401, 320, 606, 645, 646, 601],
// };
  
// let api_url = `https://api.nal.usda.gov/fdc/v1/foods/?api_key=${encodeURIComponent(
//     params.api_key
//   )}&fdcIds=${encodeURIComponent(params.fdcId)}&nutrients=${params.nutrients}`;
  
// function getData() {
//     return fetch(api_url)
//         .then((response) => response.json())
//         .catch((e) => {
//             console.log(e);
//         });
// };

// module.exports = getData();

// Sends data to the ejs template.

const fetch = require("node-fetch");

module.exports = id => {
    const params = {
        api_key: "baxUmQv1cwFdluJZ6Y6v1BLwLU9ibtQUfiJLUeX3",
        query: id,
        dataType: ["Survey (FNDDS)"],
        pagesize: 1,
        pageNumber: 1,
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
    };
    return getData();
};

// Return subscripts of desired nutritents to display.

// module.exports = arrayPosition = [3, 2, 9, 8, 1, 43, 64, 63, 0, 15, 14, 42, 20, 28, 10, 11];


