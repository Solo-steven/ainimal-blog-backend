const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
	name: String,
	email: String,
	passwordHash: String,
	salt: String,
});

module.exports = model('users', UserSchema);
