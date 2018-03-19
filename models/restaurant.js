var mongoose = require("mongoose");

// restaurant SCHEMA setup
var restaurantSchema = new mongoose.Schema({
    restaurantName: String,
    price: String,
    restaurantImage: String,
    description: String,
    address: String,
    //location: String,
    createdAt: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
    ]
});

// Compile schema to a model
// module exports
module.exports = mongoose.model("Restaurant", restaurantSchema);