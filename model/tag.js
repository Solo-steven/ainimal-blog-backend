const { Schema, model } = require('mongoose');

const TagSchema = new Schema({
	name: String,
});

module.exports = model('tags', TagSchema);
