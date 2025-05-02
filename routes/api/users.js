const router = require('express').Router();
let User = require('../../models/User.model');

router.route('/').get(async (req, res) => {
	try {
		const users = await User.find().sort({ createdAt: -1 });
		res.json({data: users});
	} catch (err) {
		res.status(400).json({msg: 'Error: ' + err});
	}
});

router.route('/:id').get((req, res) => {
	User.findById(req.params.id)
		.then(user => {
			if (user) res.json(user);
			else {
				res.status(400).json('Error: user not found');
			}
		})
		.catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/login').post(async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username, password });
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(400).json('Error: user not found');
		}
	} catch (err) {
		res.status(400).json(`Error: ${err}`);
	}
});

router.route('/add').post((req, res) => {
	const { fullName, username, email, password, bio, level } = req.body;

	let user = {
		fullName,
		username,
		email,
		password,
		bio,
		level,
	};

	const newUser = new User(user);

	// if files present
	if (!(req.files === null)) {
		const picture = req.files.picture;

		// SAVE IMAGE AS IN SERVER
		if (picture != null) {
			picture.mv(
				`${__dirname}/../../public/uploads/userDp/${newUser._id}${picture.name
					.substring(picture.name.lastIndexOf('.'))
					.toLowerCase()}`,
				err => {
					if (err) {
						console.error(err);
						return res.status(500).send(err);
					}
				}
			);
			newUser.picture = `/uploads/userDp/${newUser._id}${picture.name
				.substring(picture.name.lastIndexOf('.'))
				.toLowerCase()}`;
		}
	}

	// TODO: Password hashing

	newUser
		.save()
		.then(() => res.json(newUser))
		.catch(err => res.status(400).json(`Error ${err}`));
});

router.route('/:id').delete((req, res) => {
	User.findByIdAndDelete(req.params.id)
		.then(() => res.json('User deleted'))
		.catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/update/:id').post((req, res) => {
	User.findById(req.params.id)
		.then(user => {
			user.username = req.body.username || user.username;
			user.email = req.body.email || user.email;
			user.password = req.body.password || user.password;
			user.bio = req.body.bio || user.bio;

			if (!(req.files === null)) {
				const picture = req.files.picture;

				// SAVE IMAGE AS BINARY
				if (picture != null) {
					picture.mv(
						`${__dirname}/../../public/uploads/userDp/${user._id}${picture.name
							.substring(picture.name.lastIndexOf('.'))
							.toLowerCase()}`,
						err => {
							if (err) {
								console.error(err);
								return res.status(500).send(err);
							}
						}
					);
					user.picture = `/uploads/userDp/${user._id}${picture.name
						.substring(picture.name.lastIndexOf('.'))
						.toLowerCase()}`;
				}
			}

			user
				.save()
				.then(() => res.json('User updated'))
				.catch(err => res.status(400).json(`Error: ${err}`));
		})
		.catch(err => res.status(400).json(`Error: ${err}`));
});

// GET USER IMAGES
router.route('/images/:id').get(async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.contentType = user.imgType;
		res.end(Buffer.from(user.picture, 'binary'));
	} catch (err) {
		res.status(400).json({ err: err });
	}
});

module.exports = router;
