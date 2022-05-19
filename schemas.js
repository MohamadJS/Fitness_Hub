const Joi = require("joi");

module.exports.foodDiarySchema = Joi.object({
    foodDiary: Joi.object({
        foodName: Joi.string().required(),
        calories: Joi.number().required(),
        servingSize: Joi.string().required(),
        fdcId: Joi.string().required(),
        grams: Joi.number().required(),
        amount: Joi.number().required(),
        date: Joi.string().required().isoDate(),
        meal: Joi.string().required()
    }).required()
})

module.exports.recipeSchema = Joi.object({
    recipe: Joi.object({
        title: Joi.string().required(),
        ingredients: Joi.string().required(),
        body: Joi.string().required(),
    }).required()
})

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required().trim()
    }).required()
})