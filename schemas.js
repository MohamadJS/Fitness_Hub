const Joi = require("joi");

module.exports.foodDiarySchema = Joi.object({
    foodDiary: Joi.object({
        date: Joi.object({}).required(),
        food: Joi.object({
            breakfast: Joi.array().required(),
            lunch: Joi.array().required(),
            dinner: Joi.array().required(),
            snack: Joi.array().required()
        }).required(),
        author: Joi.object({}).required()
    })
})

module.exports.recipeSchema = Joi.object({
    recipe: Joi.object({
        title: Joi.string().required(),
        // image: Joi.object({
        //     // fieldname: Joi.string(),
        //     // originalname: Joi.string(),
        //     // encoding: Joi.string(),
        //     // mimetype: Joi.string(),
        //     // path: Joi.string().required(),
        //     // size: Joi.number(),
        //     // filename: Joi.string().required()
        // }).required(),
        ingredients: Joi.string().required(),
        body: Joi.string().required(),
    }).required()
})

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required()
    }).required()
})