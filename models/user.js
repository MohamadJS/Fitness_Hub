const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    foodDiary: [
        {
            type: Schema.Types.ObjectId,
            ref: "FoodDiary"
        },
    ]
})

// Adds on a username, field for password, makes sure usernames are unique,
// Gives us methods to use in our Schema.
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);