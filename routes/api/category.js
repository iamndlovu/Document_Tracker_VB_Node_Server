const router = require('express').Router();
let Activity = require('../../models/Category.model');

router.route('/').get(async (req, res) => {
	try {
		const activities = await Activity.find();
		res.json({data: activities});
	} catch (err) {
		res.status(400).json({msg: 'Error: ' + err});
	}
});

router.route('/:id').get((req, res) => {
	Activity.findById(req.params.id)
		.then(activity => {
			if (activity) res.json(activity);
			else {
				res.status(400).json('Error: Object not found');
			}
		})
		.catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/add').post((req, res) => {
	const { name } = req.body;

	let activity = {
		name,
	};

	const newActivity = new Activity(activity);

	newActivity
		.save()
		.then(() => res.json(newActivity))
		.catch(err => res.status(400).json(`Error ${err}`));
});

router.route('/:id').delete((req, res) => {
	Activity.findByIdAndDelete(req.params.id)
		.then(() => res.json('Category deleted'))
		.catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
