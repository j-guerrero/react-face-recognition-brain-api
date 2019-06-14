const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id:'123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 5,
			joined : new Date()
		},

		{
			id:'124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined : new Date()
		}
	],

	// login: [
	// 	{
	// 		id: '987',
	// 		hash: '',
	// 		email: 'john@gmail.com'
	// 	}
	// ]
}

app.get('/', (req,res)=>{
	res.send(database.users);
})

app.post('/signin', (req,res) =>{

	// bcrypt.compare("apples", '$2a$10$Dn7ONDRTBUI2EDB14/DFf.hWh8uXyVxgOzC18XOPvytjBBN5lj676', function(err, res) {
 //    	console.log('first guess', res);
	// });

	// bcrypt.compare("veggies", '$2a$10$Dn7ONDRTBUI2EDB14/DFf.hWh8uXyVxgOzC18XOPvytjBBN5lj676', function(err, res) {
 //    	console.log('second guess', res);
	// });

	if(req.body.email === database.users[0].email &&
	req.body.password === database.users[0].password){
		res.json(database.users[0]);
	}else{
		res.status(400).json('Error Logging In')
	}
})

app.post('/register', (req,res)=>{
	const { email, name, password } = req.body;

	// bcrypt.hash(password, null, null, function(err, hash) {
 //    	console.log(hash);
	// });

	database.users.push({
		id:'125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined : new Date()
	})

	res.json
	res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req,res)=>{
	const { id } = req.params;
	let found = false;

	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			return res.json(user);
		}
	})

	if(!found){
		res.status(404).json('User Not Found');
	}
})

app.put('/image', (req,res)=> {

	const { id } = req.body;
	let found = false;

	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if(!found){
		res.status(404).json('User Not Found');
	}
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3001, ()=>{
	console.log('App is running on port 3001.');
})