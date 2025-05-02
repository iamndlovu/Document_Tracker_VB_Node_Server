const { Schema, model } = require('mongoose');

const CommitSchema = new Schema(
	{
		message: { type: String, required: true },
		user: { type: String, required: true },
		file: { type: String, required: true },
	},
	{ timestamps: true }
);

const Commit = model('Commit', CommitSchema);

module.exports = Commit;
