const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Recipe = require("../models/recipes");
const comment = require("../models/comment");


router.get("/recipes", catchAsync(async (req, res) => {
    const recipes = await Recipe.find({});
    console.log(recipes);
    res.render("recipes/index", { recipes });
}))

router.get("/recipes/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    // .populate("comments")
    const recipe = await Recipe.findById(id).populate("comments");
    res.render("recipes/show", { recipe });
}))

router.get("/recipes/new", (req, res) => {
    res.render("recipes/new");
})

router.post("/recipes/new", catchAsync(async (req, res) => {
    const { title, img, body } = req.body;
    const recipe = await new Recipe({ title, img, body });
    await recipe.save();
    req.flash("success", "Recipe Posted!");
    res.redirect("/recipes");
}))

module.exports = router;