const { Schema, model } = require('mongoose');

const ActivitySchema = new Schema(
	{
		type: { type: String, required: true },
		reference: { type: String, required: true, unique: true },
	},
	{ timestamps: true }
);

const Activity = model('Activity', ActivitySchema);

module.exports = Activity;
