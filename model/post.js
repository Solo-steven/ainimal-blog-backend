const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const PostSchema = new Schema({
    status: String,
    title: String,
    content: String,
    author: String,
    timestamp: String,
    image: String,
    tags: [String],
});

module.exports = model("posts", PostSchema);