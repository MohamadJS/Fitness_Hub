const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");
const foodApi = require("../utils/foodApi");
const FoodDiary = require("../models/foodDiaries");
const ExpressError = require("../utils/ExpressError");

const arrayPosition = [3, 2, 9, 8, 1, 43, 64, 63, 0, 15, 14, 42, 20, 28, 10, 11];
const arrayNames = ["Calories", "Total Carbohydrate", "Total Fiber", "Sugar", "Fat", "Saturated Fat",
    "Polyunsaturated Fat", "Monounsaturated Fat", "Protein", "Sodium", "Potassium",
"Cholesterol", "Vitamin A", "Vitamin C", "Calcium", "Iron"];


// router.param("date", (req, res, next, value) => {
//     value = Date.parse(value);
//     if (value) {
//         const date = new Date(value);
//         // console.log(value, date);
//         value = date.getFullYear() + "-" + date.getDate() + "-" + date.getDay();
//         // req.params.date = value;
//         next();
//     }
//     else {
//         const msg = "Invalid Date"
//         throw new ExpressError(msg, 400);
//     }
// })

router.get("/food", (req, res) => {
    const { search } = req.query;
    // console.log(search);
    res.render("foods/index", { search });
})

// Add another variable in which it is the id of the food, so we can send it with our 
router.get("/food/:food", catchAsync(async (req, res, next) => {
    const { food } = req.params;
    const data = await foodApi(food);
    // if there is no data recieved, go to error template, else display the food data.
    !data.foods[0] ? next() : res.render("foods/show", { data, arrayPosition, arrayNames }); 
    // console.log(data);
    // console.log(food)
    // console.log(data.foods[0].foodNutrients[0]);
    // console.log(data[0]);
    // res.render("food", { data, arrayPosition });
}))

// new Route
router.post("/food/:food", isLoggedIn, catchAsync(async (req, res) => {
    // res.send(req.body);
    const { foodName, servingSize, amount, fdcId, date, grams, meal } = req.body;
    // console.log(req.body);
    // return res.send(foodDiary);
    const userId = req.user.id;
    let user = await User.findOne({ userId });
    // let foodDiary = await User.findOne({ foodDairy: date, user: username });
    let foodDiary = await FoodDiary.findOne({ date, author: userId });
    // console.log(user.foodDiary);
    // console.log(foodDiary);
    if (!foodDiary) {
        console.log("\nNothing found!");
        foodDiary = await new FoodDiary({ date, author: userId });
        user.foodDiary.push(foodDiary._id);
        // console.log(foodDiary);
        console.log(user);
    }
    console.log(user);
    foodDiary.food[meal].push({ foodName, servingSize, amount, grams, fdcId });
    // console.log(foodName);
    // console.log(servingSize);
    // console.log(foodDiary.food);
    await foodDiary.save();
    await user.save();
    // let foodDiary = await FoodDiary.findOne({ date });
    // if (!foodDiary) {
    //     foodDiary = await new FoodDiary({ date });
    //     User.foodDiary.push(foodDiary);
    // }
    // res.send(foodDiary);
    // // console.log(`***${meal}***`);
    // foodDiary.food[meal].push({ foodName, servingSize, grams, fdcId });
    // await foodDiary.save();
    // // res.send(foodDiary);
    // // console.log(input);
    req.flash(`success`, `Logged ${foodName} for your ${meal}`);
    res.redirect("/food");
}))

// Show route v1
// router.get("/diary", catchAsync(async (req, res) => {
//     const userId = req.user.id;
//     // const user = await User.findOne({ userId });
//     // const diary = await User.findOne({ userId }).populate("foodDiary", "Diary");
//     const foodDiary = await FoodDiary.find({ author: userId});
//     // if (!diary) {
//     //     res.send("0");
//     // }
//     console.log(foodDiary);
//     res.send(foodDiary);
// }))

// Show route v2
// populates the foodDiary, probably should remove author from FoodDiary Schema/model, as it is uneccessary.
// Should change the new Route to just search the populated user schema for the foodDiary for the date, if there isn't
// anything found, then you would want to create a new FoodDiary and save that to the user, without the author on the diary.
router.get("/diary", isLoggedIn, catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findOne({ userId }).populate("foodDiary");
    // const foodDiary = user.foodDiary;
    // console.log(foodDiary);
    /*
    TODO: (DONE!)
    1. Find today's date and set the newDate to that, so it will always show the current
       date when on the diary page.
    2. Redirect them to that diary/:date route.
    */
    // get new date
    let today = new Date();
    today = today.getFullYear() + '-' + ('' + today.getMonth() + 1) + '-' + ( today.getDate() < 9 ? '0' + today.getDate() : today.getDate());
    let date = new Date(`${today}T00:00`);
    const day = ('0' + date.getDate()).slice(-2);
    // const day = '0' + date.getDate();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    // const month = '' + date.getMonth() + 1;
    const year = date.getFullYear();
    date = `${year}-${month}-${day}`;
    console.log(`today: ${today}`);
    // console.log(date);
    // const foodDiary = await FoodDiary.findOne({ date, author: userId });
    // console.log(today);
    res.redirect(`/diary/${date}`);
    // foodDiary ? res.render("diaries/edit", { foodDiary }) : res.render("diaries/editTemplate", { date });
    // res.render("diaries/show", {foodDiary});
    // res.send(user);
}));

// add food from the diary page itself route

router.post("/diary", isLoggedIn, catchAsync(async (req, res) => {
    const { foodName, servingSize, amount, fdcId, date, grams, meal } = req.body;
    const userId = req.user.id;
    const user = await User.findOne({ userId });
    let foodDiary = await FoodDiary.findOne({ date, author: userId });

    if (!foodDiary) {
        // let newDate = new Date(`${date}T00:00`);
        // const theDate = ('0' + newDate.getDate()).slice(-2);
        // const month = ('0' + (newDate.getMonth() + 1)).slice(-2);
        // const year = newDate.getFullYear();
        // newDate = `${year}-${month}-${theDate}`;
        // newDate = `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()}`
        // foodDiary = await new FoodDiary({ date, author: userId });
        // res.send(foodDiary);
        foodDiary = await new FoodDiary({ date, author: userId });
        user.foodDiary.push(foodDiary._id);
    }

    foodDiary.food[meal].push({ foodName, servingSize, amount, grams, fdcId });
    await foodDiary.save();
    await user.save();

    req.flash(`success`, `Logged ${foodName} for your ${meal}`);
    res.redirect(`/diary/${date}`);


}))

// Shows particular food diary of date.
router.get("/diary/:date", isLoggedIn, catchAsync(async (req, res) => {
    const date = req.params.date;
    const userId = req.user.id;
    const user = await User.findOne({ userId }).populate("foodDiary");
    let foodDiary = await FoodDiary.findOne({ date, "author": userId });
    // user.foodDiary.forEach(i => {
    //     if (i.date == date) {
    //         foodDiary = i;
    //     }
    // })
    // if there is no food diary, just render a template page to add food.
    // const diary = user.foodDiary[0];
    if (!foodDiary) {
        // const value = Date.parse(date);
        // const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        // const days = [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
        //     23, 24, 25, 26, 27, 28, 29, 30, 31, 01];
        
        // let newDate = new Date(date + "EDT");
        // var year = newDate.getFullYear();
        // var month = newDate.getMonth();
        // // month < 10 ? month = "0" + month : null;
        // var day = newDate.getDate();
        // day < 10 ? day = "0" + day : null;
        
        // newDate = new Date(value);

        // var options = {
        //     year: 'numeric', month: 'numeric', day: 'numeric', timezone : "EDT"
        // };

        // console.log(date);
        const newDate = new Date(`${date}T00:00`);
        console.log("newDate " + newDate);
        if (newDate == "Invalid Date") {
            throw new ExpressError("Invalid Date", 400);
        } 
        // console.log("DATE: " + newDate);
        // let result = newDate.toLocaleDateString('en', options);
        // console.log(result);
        // console.log(year + "-" + month + "-" + day);
        // console.log(month);
        // console.log(day);
        // realDate = `${year}-${months[month]}-${days[day]}`
        // console.log(realDate);
        // const foodDiary = new foodDiary({})
        // newDate = newDate.getFullYear() + "-" + newDate.getDate() + "-" + newDate.getDay();
        // newDate = newDate.getFullYear() + "-" + `${newDate.getMonth() + 1}` + "-" + `${newDate.getDate() + 1}`;
    }
    foodDiary ? res.render("diaries/edit", {foodDiary}) : res.render("diaries/editTemplate", {date});
    // res.send(foodDiary);
}));

//Route to gain access to certain food saved, to update food information (Serving Size.)
router.get("/diary/:date/:meal/:id", isLoggedIn, catchAsync(async (req, res) => {
    const date = req.params.date;
    const foodId = req.params.id;
    const meal = req.params.meal;
    const userId = req.user.id;
    const user = await User.findOne({ userId }).populate("foodDiary");
    const foodDiary = await FoodDiary.findOne({ date, author: userId });
    const pickFood = await FoodDiary.findOne({ date, food: meal, author: userId });
    console.log(pickFood);
    let selectedFood = foodDiary.food[meal].filter(function (el) { return el._id == foodId })[0];
    const data = await foodApi(selectedFood.foodName);
    // console.log(data);
    // console.log(selectedFood);
    res.render("diaries/modals", {foodDiary, selectedFood, data, arrayPosition, arrayNames} );
    // res.render("diaries/edit", { foodDiary });
}))


// Route to remove food from the food Diary. (PUT ROUTE)
router.delete("/diary/:date/:meal/:objectId", isLoggedIn, catchAsync(async (req, res) => {
    const { date, meal} = req.params;
    const foodId = req.params.objectId;
    const userId = req.user.id;
    let foodDiary = await FoodDiary.findOne({ date, author: userId });
    console.log(foodDiary);
    const deletedItem = foodDiary.food[meal].filter(function (el) { return el._id == foodId });
    foodDiary.food[meal] = foodDiary.food[meal].filter(function (el) { return el._id != foodId });
    console.log(foodDiary);
    console.log(deletedItem);
    await foodDiary.save();
    req.flash("success", `Removed ${deletedItem[0].foodName}`);
    res.redirect(`/diary/${date}`);
}));


module.exports = router;