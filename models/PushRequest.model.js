const { Schema, model } = require('mongoose');

const PushRequestSchema = new Schema(
	{
		commit: { type: String, required: true },
		status: { type: String, required: true, default: 'pending' },
		// path of updated file
		path: { type: String, required: true },
	},
	{ timestamps: true }
);

const PushRequest = model('PushRequest', PushRequestSchema);

module.exports = PushRequest;
