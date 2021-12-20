const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Recipe = require("../models/recipes");
const comment = require("../models/comment");
const { cloudinary, storage } = require("../cloudinary");
const { isLoggedIn, validateRecipe, isAuthor } = require("../middleware");
const multer = require("multer");
const upload = multer({ storage });

// Routes


router.get("/recipes", catchAsync(async (req, res) => {
    const recipes = await Recipe.find({});
    res.render("recipes/index", { recipes });
}))

router.get("/recipes/new", isLoggedIn, (req, res) => {
    res.render("recipes/new");
})

router.get("/recipes/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate({
        path: "comments",
        populate: {
            path: "author"
        }
    }).populate("author");
    const ingredients = recipe.ingredients.split("\n");
    res.render("recipes/show", { recipe, ingredients });
}))

router.post("/recipes/new", isLoggedIn, upload.single("image"), validateRecipe, catchAsync(async (req, res) => {
    const { path, filename } = req.file;
    const recipe = await new Recipe({ ...req.body.recipe });
    recipe.author = req.user._id;
    recipe.image = { url: path, filename };
    await recipe.save();
    req.flash("success", "Recipe Posted!");
    res.redirect("/recipes");
}))

router.get("/recipes/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate("comments");
    res.render("recipes/edit", { recipe });
}))

router.put("/recipes/:id", isLoggedIn, isAuthor, upload.single("image"), validateRecipe, catchAsync(async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndUpdate(id, { ...req.body.recipe });
    if (req.file) {
        await cloudinary.uploader.destroy(recipe.image.filename);
        const { path, filename } = req.file;
        console.log(path);
        recipe.image = { url: path, filename };
    }
    await recipe.save();
    req.flash("success", "Successfully updated recipe!");
    res.redirect(`/recipes/${recipe._id}`);
}))

router.delete("/recipes/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndDelete(id);
    console.log(recipe);
    await cloudinary.uploader.destroy(recipe.image.filename);
    req.flash("success", "Successfully deleted recipe!");
    res.redirect("/recipes");
}))

module.exports = router;