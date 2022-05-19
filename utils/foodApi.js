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
