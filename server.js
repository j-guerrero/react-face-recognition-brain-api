const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');

const db = knex({
  client: 'pg',

  connection: process.env.POSTGRES_URI

  // connection: {
  //   connectionString : process.env.DATABASE_URL,
  //   ssl: true,
  // }
  
});

// db.select('*').from('users').then(data => {
// 	console.log(data);
// });


const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req,res) => { res.send('Server Online') })

app.post('/signin', signin.handleSignin(db,bcrypt));

app.post('/register', register.handleRegister(db,bcrypt));

app.get('/profile/:id', profile.handleProfileGet(db));

app.put('/image', image.handleImage(db));

app.post('/imageurl', image.handleApiCall);

app.listen(process.env.PORT || 3000, ()=>{

	let port;

	if(process.env.PORT == null){port = 3000;
	}else{port = process.env.PORT;}

	console.log(`App running on PORT ${port}`);
})