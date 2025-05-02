const { Schema, model } = require('mongoose');

const FileSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		category: { type: String },
		description: { type: String, required: true },
		tags: { type: Array },
		type: { type: String, required: true },
		path: { type: String, required: true, unique: true },
		history: { type: Array, default: [] },
		owner: { type: String, required: true },
	},
	{ timestamps: true }
);

const File = model('File', FileSchema);

module.exports = File;
