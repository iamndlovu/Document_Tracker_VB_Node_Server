const router = require('express').Router();
let Commit = require('../../models/Commit.model');

router.route('/').get(async (req, res) => {
	try {
		const commits = await Commit.find();
		res.json({data: commits});
	} catch (err) {
		res.status(400).json({msg: 'Error: ' + err});
	}
});

router.route('/:id').get((req, res) => {
	Commit.findById(req.params.id)
		.then(commit => {
			if (commit) res.json(commit);
			else {
				res.status(400).json('Error: Oblect not found');
			}
		})
		.catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/add').post((req, res) => {
	const { message, user, file } = req.body;

	let commit = {
		message,
		user,
		file,
	};

	const newCommit = new Commit(commit);

	newCommit
		.save()
		.then(() => res.json(newCommit))
		.catch(err => res.status(400).json(`Error ${err}`));
});

module.exports = router;
