var mongoose = require("mongoose");

// restaurant SCHEMA setup
var restaurantSchema = new mongoose.Schema({
    restaurantName: String,
    restaurantImage: String,
    description: String,
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