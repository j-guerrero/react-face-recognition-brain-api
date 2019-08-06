const handleRegister = (db,bcrypt) => (req,res) => {
	const { email, name, password } = req.body;
	
	// Empty/missing forms
	if(!email || !name || !password){
		return res.status(400).json('Incorrect form-submission');
	}

	const hash = bcrypt.hashSync(password);

	// Insert new email and hashed-password into login table + add info to users table of Heroku Postgres
	db.transaction( trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback) // if promise isn't returned on commit, end transaction
	})
	.catch(err => res.status(400).json('Unable To Register'))
}

module.exports = {
	handleRegister
}