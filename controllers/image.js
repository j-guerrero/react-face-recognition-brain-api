
const Clarifai = require('clarifai');

// apiKey can be defined as ENV_VARIABLE in Heroku
const app = new Clarifai.App({
 apiKey: '919b7214df03445b89c5baefb21954b9'
});

// App functions found in Clarafai DOCS (https://sdk.clarifai.com/js/latest/Model.html#predict)
const handleApiCall = (req,res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('Unable to work with API'));
}

// Increment image entry counter after successful API call
const handleImage = (db) => (req,res) => {
	const { id } = req.body;

	db('users').where('id', '=', id)
  	.increment('entries', 1)
  	.returning('entries')
  	.then(entries =>{
  		res.json(entries[0]);
  	})
  	.catch(err=> res.status(400).json('Unable to get entries'));
}

module.exports = {
	handleImage,
	handleApiCall
}