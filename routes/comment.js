const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipes");
const Comment = require("../models/comment");
const commentSchema = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

// Middleware
const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

// Routes
router.post("/", validateComment, catchAsync(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    const comment = new Comment(req.body);
    recipe.comments.push(comment);
    await comment.save();
    await recipe.save();
    req.flash("success", "Successfully posted comment!");
    res.redirect(`/recipes/${recipe._id}`);
}))

router.delete("/:commentId", catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Recipe.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash("success", "Successfully deleted comment!");
    res.redirect(`/recipes/${id}`);
}))

module.exports = router;