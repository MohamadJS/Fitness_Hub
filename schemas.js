const BaseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} cannot include HTML!"
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) return helpers.error("string.escapeHTML", { value });
                return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension);

module.exports.foodDiarySchema = Joi.object({
    foodDiary: Joi.object({
        foodName: Joi.string().trim().required().escapeHTML(),
        calories: Joi.number().required(),
        servingSize: Joi.string().trim().required().escapeHTML(),
        fdcId: Joi.string().trim().required().escapeHTML(),
        grams: Joi.number().required(),
        amount: Joi.number().required(),
        date: Joi.string().trim().required().isoDate().escapeHTML(),
        meal: Joi.string().trim().required().escapeHTML()
    }).required()
})

module.exports.recipeSchema = Joi.object({
    recipe: Joi.object({
        title: Joi.string().trim().required(),
        ingredients: Joi.string().required(),
        body: Joi.string().required(),
    }).required()
})

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().trim().required().escapeHTML()
    }).required()
})