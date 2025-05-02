const router = require('express').Router();
let PushRequest = require('../../models/PushRequest.model');

router.route('/').get(async (req, res) => {
	try {
		const pushRequests = await PushRequest.find().sort({ createdAt: -1 });
		res.json({data: pushRequests});
	} catch (err) {
		res.status(400).json({msg:'Error: ' + err});
	}
});

router.route('/:id').get((req, res) => {
	PushRequest.findById(req.params.id)
		.then(pushRequest => {
			if (pushRequest) res.json(pushRequest);
			else {
				res.status(400).json('Error: Object not found');
			}
		})
		.catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/add').post((req, res) => {
	const { commit, type } = req.body;

	let pushRequest = {
		commit,
	};

	// if files present
	if (!(req.files === null)) {
		const actualFile = req.files.file;

		if (actualFile != null) {
			actualFile.mv(
				`${__dirname}/../../public/uploads/files/${commit}.${type.toLowerCase()}`,
				err => {
					if (err) {
						console.error(err);
						return res.status(500).send(err);
					}
				}
			);
		}
	} else res.status(400).json({ msg: 'No file uploaded' });

	pushRequest.path = `/uploads/files/${commit}.${type.toLowerCase()}`;

	const newPushRequest = new PushRequest(pushRequest);

	newPushRequest
		.save()
		.then(() => res.json(newPushRequest))
		.catch(err => res.status(400).json(`Error ${err}`));
});

router.route('/:id').delete((req, res) => {
	PushRequest.findByIdAndDelete(req.params.id)
		.then(() => res.json('PushRequest deleted'))
		.catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/update/:id').post((req, res) => {
	console.log("push status update ", req.params.id);
	const { status } = req.body;
	PushRequest.findById(req.params.id)
		.then(pushRequest => {
			pushRequest.status = status || pushRequest.status;
			pushRequest.save()
				.then(requestItem => {
					console.log("push status update done", requestItem._id);
					res.json(requestItem);
				});
		})
		.catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
