const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    title: String,
    image: String,
    ingredients: String,
    body: String,
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