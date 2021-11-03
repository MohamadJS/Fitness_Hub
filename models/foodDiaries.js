const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// foodDiary Schema
const FoodDiarySchema = new Schema({
    date: Object,
    food: {
        breakfast: [{
            foodName: String,
            servingSize: String,
            grams: String,
            fdcId: String,
            amount: String
        }],
        lunch: [{
            foodName: String,
            servingSize: String,
            grams: String,
            fdcId: String,
            amount: String
        }],
        dinner: [{
            foodName: String,
            servingSize: String,
            grams: String,
            fdcId: String,
            amount: String
        }],
        snack: [{
            foodName: String,
            servingSize: String,
            grams: String,
            fdcId: String,
            amount: String
        }]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("FoodDiary", FoodDiarySchema);

// In the request we are gonna find foodDiary by the date, and the author, if not found we create a new 
// food diary for that specified date.


// In our routes to log our food, 
// we will do foodDiary.date = req.body.date,
// foodDiary.food[req.body.meal].push({ req.body.foodName, req.body.servingSize, req.body.grams, req.body.fdcId })
// await foodDiary.save();

// We will add in user and put the user id in the foodDiary so we can search for the date and the author, 