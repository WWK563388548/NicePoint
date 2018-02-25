var mongoose = require(mongoose);

var commentSchema = mongoose.Schema({
    text: String,
    author: String
});

module.exports = mongoose.module("Commemt", commentSchema);