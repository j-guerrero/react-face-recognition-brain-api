const express = require('express');
const knex = require('knex');				// SQL queries

// ## -- Middleware -- ## 
const bcrypt = require('bcrypt-nodejs');	// hash encryption for passwords
const cors = require('cors');				// Cross-origin resource sharing 
const bodyParser = require('body-parser');
const morgan = require('morgan');			// logger for HTTP Requests

// ## -- Controllers -- ##
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');
const auth = require('./controllers/authorization.js')

// Postgrest 'DATABASE_URL' provided when running on Heroku platform
const db = knex({
  client: 'pg',

  connection: process.env.DATABASE_URL
  
});


// ## -- Main Server Run -- ##
const app = express();

// ## -- Middleware -- ##
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));


// ## -- Fetch Requests -- ##
// Fetches require authenthication checks post-login
app.get('/', (req,res) => { res.send('Server Online') })

app.post('/signin', signin.signInAuthentication(db,bcrypt));

app.post('/register', register.handleRegister(db,bcrypt));

app.get('/profile/:id', auth.requireAuth, profile.handleProfileGet(db));

app.post('/profile/:id', auth.requireAuth, profile.handleProfileUpdate(db));

app.put('/image', auth.requireAuth, image.handleImage(db));

app.post('/imageurl', auth.requireAuth, image.handleApiCall);


// Default port is 3000; must define as env_varible @ Nodemon start if other
app.listen(process.env.PORT || 3000, ()=>{

	let port;

	if(process.env.PORT == null){port = 3000;
	}else{port = process.env.PORT;}

	console.log(`App running on PORT ${port}`);
})