const mongoose = require("mongoose");
const Comment = require("./comment");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_350");
})

const RecipeSchema = new Schema({
    title: String,
    image: ImageSchema,
    ingredients: String,
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})

RecipeSchema.post("findOneAndDelete", async function (doc) {
    // If we recieve a recipe that has been deleted, delete all comments that have their ids are in our doc.reviews array (the deleted recipe comment array).
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model("Recipe", RecipeSchema);