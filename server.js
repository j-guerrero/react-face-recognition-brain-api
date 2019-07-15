const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');
const auth = require('./controllers/authorization.js')

const db = knex({
  client: 'pg',

  connection: process.env.POSTGRES_URI

  // !--- for non-Docker build ---!
  // connection: {
  //   connectionString : process.env.DATABASE_URL,
  //   ssl: true,
  // }
  
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

app.get('/', (req,res) => { res.send('Server Online') })

app.post('/signin', signin.signInAuthentication(db,bcrypt));

app.post('/register', register.handleRegister(db,bcrypt));

app.get('/profile/:id', auth.requireAuth, profile.handleProfileGet(db));

app.post('/profile/:id', auth.requireAuth, profile.handleProfileUpdate(db));

app.put('/image', auth.requireAuth, image.handleImage(db));

app.post('/imageurl', auth.requireAuth, image.handleApiCall);

app.listen(process.env.PORT || 3000, ()=>{

	let port;

	if(process.env.PORT == null){port = 3000;
	}else{port = process.env.PORT;}

	console.log(`App running on PORT ${port}`);
})