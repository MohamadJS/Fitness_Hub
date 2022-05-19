const { foodDiarySchema, recipeSchema, commentSchema } = require("./schemas");
const Recipe = require("./models/recipes");
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

    if (!recipe.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/recipes/${id}`);
    }
    next();
}

module.exports.validateComment = async (req, res, next) => {
    const { error } = commentSchema.validate(req.body);

    const recipe = await Recipe.findById(req.params.id);

    if (req.body.comment.body.trim() == '') {
        req.flash("error", "Cannot post an empty comment.")
        return res.redirect(`/recipes/${recipe._id}`);
    }
    else if (error) {
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