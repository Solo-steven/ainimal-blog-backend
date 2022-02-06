const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const PostSchema = new Schema({
    // Changeable
    title: String,
    content: String,
    tags: [String],
    status: String, // Draft or Pulish
    // Non-Chnageable
    author: String,
    timestamp: String,
    image: String,
});

module.exports = model("posts", PostSchema);