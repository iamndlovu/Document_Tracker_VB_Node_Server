const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
	{
		fullName: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		bio: { type: String, required: true },
		level: { type: String, required: true, default: 'staff' },
		picture: { type: String },
		logs: { type: Array },
	},
	{ timestamps: true }
);

const User = model('User', UserSchema);

module.exports = User;
