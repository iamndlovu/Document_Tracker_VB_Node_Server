const router = require('express').Router();
let File = require('../../models/File.model');

router.route('/').get(async (req, res) => {
	try {
		const files = await File.find().sort({ createdAt: -1 });
		res.json({data: files});
	} catch (err) {
		res.status(400).json({msg: 'Error: ' + err});
	}
});

router.route('/:id').get((req, res) => {
	File.findById(req.params.id)
		.then(file => {
			if (file) res.json(file);
			else {
				console.error('Error: file not found');
				res.status(400).json('Error: file not found');
			}
		})
		.catch(err => {
			console.error(`Error: ${err}`);
			res.status(400).json(`Error: ${err}`);
		});
});

router.route('/add').post((req, res) => {
	let { name, category, description, type, owner } = req.body;
	
	if (type) {
		// remove '.' at beginning of string
		type = type.toUpperCase().replace(/^\./, '');
	}

	let file = {
		name,
		category,
		description,
		tags: [],
		type,
		owner,
	};

	// if files present
	if (!(req.files === null)) {
		const actualFile = req.files.file;

		if (actualFile != null) {
			actualFile.mv(
				`${__dirname}/../../public/uploads/files/${
					file.name
				}.${file.type.toLowerCase()}`,
				err => {
					if (err) {
						console.error(err);
						//return res.status(500).send(err);
					}
				}
			);
		}
		file.path = `/uploads/files/${file.name}.${file.type.toLowerCase()}`;
	} else res.status(400).json({ msg: 'No file uploaded' });

	const newFile = new File(file);

	newFile
		.save()
		.then(() => res.json(newFile))
		.catch(err => res.status(400).json(`Error ${err}`));
});

router.route('/:id').delete((req, res) => {
	File.findByIdAndDelete(req.params.id)
		.then(() => res.json('File deleted'))
		.catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/update/:id').post((req, res) => {
	console.log(`file update: ${req.params.id}`)
	File.findById(req.params.id)
		.then(file => {
			file.path = req.body.path;
			file.history = [...file.history, req.body.commit];
			file
				.save()
				.then(() => {
					console.log(`file update done. file path: ${file.path}`)
					res.json(file)
				})
				.catch(err => res.status(400).json(`Error: ${err}`));
		})
		.catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/update/history/:id').post((req, res) => {
	File.findById(req.params.id)
		.then(file => {
			file.history = [...file.history, req.body.commit];
			file
				.save()
				.then(() => res.json(file))
				.catch(err => res.status(400).json(`Error: ${err}`));
		})
		.catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
