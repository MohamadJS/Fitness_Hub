const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");
const foodApi = require("../utils/foodApi");
const FoodDiary = require("../models/foodDiaries");

const arrayPosition = [3, 2, 9, 8, 1, 43, 64, 63, 0, 15, 14, 42, 20, 28, 10, 11];
const arrayNames = ["Calories", "Total Carbohydrate", "Total Fiber", "Sugar", "Fat", "Saturated Fat",
    "Polyunsaturated Fat", "Monounsaturated Fat", "Protein", "Sodium", "Potassium",
    "Cholesterol", "Vitamin A", "Vitamin C", "Calcium", "Iron"];


router.get("/food", (req, res) => {
    const { search } = req.query;
    // console.log(search);
    res.render("diaries/index", { search });
})

// Add another variable in which it is the id of the food, so we can send it with our 
router.get("/food/:food", catchAsync(async (req, res, next) => {
    const { food } = req.params;
    const data = await foodApi(food);
    // if there is no data recieved, go to error template, else display the food data.
    !data.foods[0] ? next() : res.render("diaries/new", { data, arrayPosition }); 
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
    const foodDiary = user.foodDiary;
    // console.log(foodDiary);
    res.render("diaries/show", {foodDiary});
    // res.send(user);
}));

// Shows particular food diary of date.
router.get("/diary/:date", isLoggedIn, catchAsync(async (req, res) => {
    const date = req.params.date;
    const userId = req.user.id;
    const user = await User.findOne({ userId }).populate("foodDiary");
    const foodDiary = await FoodDiary.findOne({ date, author: userId });
    const diary = user.foodDiary[0];
    res.render("diaries/edit", {foodDiary});
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