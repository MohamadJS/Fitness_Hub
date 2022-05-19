const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// foodDiary Schema
const FoodDiarySchema = new Schema({
    date: Object,
    food: {
        breakfast: [{
            foodName: String,
            calories: String,
            servingSize: String,
            grams: String,
            fdcId: String,
            amount: String
        }],
        lunch: [{
            foodName: String,
            calories: String,
            servingSize: String,
            grams: String,
            fdcId: String,
            amount: String
        }],
        dinner: [{
            foodName: String,
            calories: String,
            servingSize: String,
            grams: String,
            fdcId: String,
            amount: String
        }],
        snack: [{
            foodName: String,
            calories: String,
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