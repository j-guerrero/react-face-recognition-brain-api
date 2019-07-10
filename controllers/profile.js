const handleProfileGet = (db) => (req,res) => {
	const { id } = req.params;

	db.select('*').from('users').where({id})
	.then(user => {
		if(user.length){
			res.json(user[0]);
		}else{
			res.status(400).json("Not Found");
		}
	})
	.catch(err => res.status(400).json('Error retrieving user'))
}

const handleProfileUpdate = (db) => (req,res) => {

	const { id } = req.params;
	const { name, age, pet } = req.body.formInput;

	db('users')
		.where({ id })
		.update({ name })
		.then(resp => {
			if (resp) {
				res.json("success")
			} else {
				res.status(400).json('Unable to update')
			}
		})
		.catch(err => res.status(400).json('Error updating user'))

}

module.exports = {
	handleProfileGet,
	handleProfileUpdate
}