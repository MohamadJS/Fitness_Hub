const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Recipe = require("../models/recipes");
const comment = require("../models/comment");
const { recipeSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");

// Middleware
let validateRecipe = (req, res, next) => {
    const { error } = recipeSchema.validate(req.body);
    console.log(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


// Routes


router.get("/recipes", catchAsync(async (req, res) => {
    const recipes = await Recipe.find({});
    console.log(recipes);
    res.render("recipes/index", { recipes });
}))

router.get("/recipes/new", (req, res) => {
    res.render("recipes/new");
})

router.get("/recipes/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate("comments");
    res.render("recipes/edit", { recipe });
}))

router.get("/recipes/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    // .populate("comments")
    const recipe = await Recipe.findById(id).populate("comments");
    res.render("recipes/show", { recipe });
}))

router.post("/recipes/new", validateRecipe, catchAsync(async (req, res) => {
    const recipe = await new Recipe({ ...req.body.recipe });
    await recipe.save();
    req.flash("success", "Recipe Posted!");
    res.redirect("/recipes");
}))

router.put("/recipes/:id/edit", validateRecipe, catchAsync(async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndUpdate(id, { ...req.body.recipe });
    req.flash("success", "Successfully updated recipe!");
    res.redirect(`/recipes/${recipe._id}`);
}))

router.delete("/recipes/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted recipe!");
    res.redirect("/recipes");
}))

module.exports = router;