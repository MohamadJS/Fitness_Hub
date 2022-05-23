const { foodDiarySchema, recipeSchema, commentSchema } = require("./schemas");
const Recipe = require("./models/recipes");
const FoodDiary = require("./models/foodDiaries");
const Comment = require("./models/comment");
const ExpressError = require("./utils/ExpressError");
const comment = require("./models/comment");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.validateDiary = (req, res, next) => {
    const { error } = foodDiarySchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.validateRecipe = (req, res, next) => {
    const { error } = recipeSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (!recipe) {
        req.flash("error", "Recipe not found");
        return res.redirect("/recipes");
    } 
    else if (!recipe.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/recipes/${id}`);
    }
    next();
}

module.exports.isDiaryAuthor = async (req, res, next) => {
    const { date } = req.params;
    const userId = req.user.id
    const foodDiary = await FoodDiary.findOne({ date, author: userId });

    if (!foodDiary) {
        console.log("Food Diary")
        req.flash("error", "No Diary Found.");
        return res.redirect(`/diary/${date}`);
    }
    else if (!foodDiary.author.equals(req.user._id)) {
        console.log("author")
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/diary/${date}`);
    }
    next();
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    const id = req.params;

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/recipes/${id}`);
    }
    next();
}

module.exports.validateUser = async (req, res, next) => {
    const { username, password } = req.body;

    const deniedChars = [" ", "!", "?", "@", "#", "$", "%", "^", "&", "*", "(", ")",
    "[", "]", "{", "}", "|", "\\", ";", ":", "'", '"', "<", ",", ">", ".", "/"];


    for (let i = 0; i < deniedChars.length; i++) {
        if (username.includes(deniedChars[i])) {
            req.flash("error", "Username contains an illegal character.");
            return res.redirect("/signup");
        }
    }
    
    if (username.length <= 4) {
        req.flash("error", "Username must be longer than 4 characters.");
        return res.redirect("/signup");
    }
    else if (password.length <= 7) {
        req.flash("error", "Password must be longer than 7 characters.");
        return res.redirect("/signup")
    }

    next();
}