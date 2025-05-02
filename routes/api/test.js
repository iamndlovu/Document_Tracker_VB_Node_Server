const mongoose = require('mongoose');
let User = require('../../models/User.model');

const user = {
	fullName: "Administrator",
	username: "admin",
	email: "admin@example.mail",
	password: "admin",
	bio: "System Administrator",
	level: "admin",
};

// Database URI
const uri = 'mongodb://localhost:27017/document_tracker_local?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
try {
	mongoose.connect(uri);

	// Connect database
	const connection = mongoose.connection;
	connection.once('open', () =>
		console.log('MongoDB database connection established successfully\n')
	);
} catch (error) {
	console.error(error);
}

const newUser = new User(user);

newUser.save().then(res => console.log(res));