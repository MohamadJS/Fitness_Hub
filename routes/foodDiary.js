const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const { isLoggedIn, validateDiary } = require("../middleware");
const foodApi = require("../utils/foodApi");
const FoodDiary = require("../models/foodDiaries");
const ExpressError = require("../utils/ExpressError");
const getDate = require("../utils/getDate");

const arrayPosition = [3, 2, 9, 8, 1, 43, 64, 63, 0, 15, 14, 42, 20, 28, 10, 11];
const arrayNames = ["Calories", "Total Carbohydrate", "Total Fiber", "Sugar", "Fat", "Saturated Fat",
    "Polyunsaturated Fat", "Monounsaturated Fat", "Protein", "Sodium", "Potassium",
"Cholesterol", "Vitamin A", "Vitamin C", "Calcium", "Iron"];


// Food Routes

router.get("/food", (req, res) => {
    const { search } = req.query;
    res.render("foods/index", { search });
})

// Add another variable in which it is the id of the food, so we can send it with our 
router.get("/food/:food", catchAsync(async (req, res, next) => {
    const { food } = req.params;
    const data = await foodApi(food);

    // if there is no data recieved, go to error template, else display the food data.
    !data.foods[0] ? next() : res.render("foods/show", { data, arrayPosition, arrayNames }); 
}))

// new Route
router.post("/food/:food", isLoggedIn, validateDiary, catchAsync(async (req, res) => {
    const { foodName, calories, servingSize, amount, fdcId, date, grams, meal } = req.body.foodDiary;
    const userId = req.user.id;
    let user = await User.findOne({ userId });
    let foodDiary = await FoodDiary.findOne({ date, author: userId });

    if (!foodDiary) {
        foodDiary = await new FoodDiary({ date, author: userId });
        user.foodDiary.push(foodDiary._id);
    }

    foodDiary.food[meal].push({ foodName, calories, servingSize, amount, grams, fdcId });
    await foodDiary.save();
    await user.save();

    req.flash(`success`, `Logged ${foodName} for your ${meal}`);
    res.redirect("/food");
}))

// Diary routes
router.get("/diary", isLoggedIn, catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findOne({ userId }).populate("foodDiary");

    // get new date
    date = getDate();

    res.redirect(`/diary/${date}`);
}));

// add food from the diary page itself route

router.post("/diary", isLoggedIn, validateDiary, catchAsync(async (req, res) => {
    const { foodName, calories, servingSize, amount, fdcId, date, grams, meal } = req.body.foodDiary;
    const userId = req.user.id;
    const user = await User.findOne({ userId });
    let foodDiary = await FoodDiary.findOne({ date, author: userId });

    if (!foodDiary) {
        foodDiary = await new FoodDiary({ date, author: userId });
        user.foodDiary.push(foodDiary._id);
    }

    foodDiary.food[meal].push({ foodName, calories, servingSize, amount, grams, fdcId });
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
    // if there is no food diary, just render a template page to add food.
    if (!foodDiary) {
        const dateFormat = new Date(`${date}T00:00`);
        if (dateFormat == "Invalid Date") {
            throw new ExpressError("Invalid Date", 400);
        } 
    }
    foodDiary ? res.render("diaries/index", {foodDiary}) : res.render("diaries/indexTemplate", {date});
}));

//Route to gain access to certain food saved, to update food information (Serving Size.)
router.get("/diary/:date/:meal/:id", isLoggedIn, catchAsync(async (req, res) => {
    try {
        const { date, id, meal } = req.params;
        const userId = req.user.id;
        const user = await User.findOne({ userId }).populate("foodDiary");
        const foodDiary = await FoodDiary.findOne({ date, author: userId });
        const pickFood = await FoodDiary.findOne({ date, food: meal, author: userId });
        let selectedFood = foodDiary.food[meal].filter(function (el) { return el._id == id })[0];
        const data = await foodApi(selectedFood.foodName);
    
        res.render("diaries/edit", {foodDiary, selectedFood, id, meal, data, arrayPosition, arrayNames} );
    } catch (error) {
        throw new ExpressError("Invalid Diary", 400);
    }
}))

router.put("/diary/:date/:meal/:id", isLoggedIn, catchAsync(async (req, res) => {
    const { date, meal, id } = req.params;
    const { calories, grams, servingSize, amount } = req.body.foodDiary;
    const userId = req.user.id;
    let foodDiary = await FoodDiary.findOne({ date, author: userId });
    let item = foodDiary.food[meal].filter(function (el) { return el._id == id })[0];

    for (let food of foodDiary.food[meal]) {
        if (food._id == id) {
            food.calories = calories;
            food.grams = grams;
            food.servingSize = servingSize;
            food.amount = amount;
        }
    }

    foodDiary.save();

    req.flash("success", `Successfully edited ${item.foodName}`);
    res.redirect(`/diary/${date}`);
}))

// Route to remove food from the food Diary. (PUT ROUTE)
router.delete("/diary/:date/:meal/:objectId", isLoggedIn, catchAsync(async (req, res) => {
    const { date, meal} = req.params;
    const foodId = req.params.objectId;
    const userId = req.user.id;
    let foodDiary = await FoodDiary.findOne({ date, author: userId });
    const deletedItem = foodDiary.food[meal].filter(function (el) { return el._id == foodId })[0];

    foodDiary.food[meal] = foodDiary.food[meal].filter(function (el) { return el._id != foodId });
    await foodDiary.save();

    req.flash("success", `Removed ${deletedItem.foodName}`);
    res.redirect(`/diary/${date}`);
}));


module.exports = router;