const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipes");
const Comment = require("../models/comment");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateComment, isCommentAuthor } = require("../middleware");

// Routes
router.post("/:id/comments", isLoggedIn, validateComment, catchAsync(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    console.log(recipe);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    recipe.comments.push(comment);
    await comment.save();
    await recipe.save();
    req.flash("success", "Successfully posted comment!");
    res.redirect(`/recipes/${recipe._id}`);
}))

router.delete("/:id/comments/:commentId", isLoggedIn, isCommentAuthor, catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Recipe.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash("success", "Successfully deleted comment!");
    res.redirect(`/recipes/${id}`);
}))

module.exports = router;