const jwt = require('jsonwebtoken');
const redis = require('redis');

// 'REDIS_URL' provided by Heroku platform where hosted
const redisClient = redis.createClient(process.env.REDIS_URL);

const handleSignin = (db,bcrypt,req,res) => {

	const { email,password } = req.body;
	if(!email || !password){
		return Promise.reject('Incorrect form-submission');
	}

	return db.select('email','hash').from('login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if(isValid){
				return db.select('*').from('users')
				.where('email', '=', email)
				.then(user => user[0])
				.catch( err => Promise.reject('Unable to get user'))
			} else {
				Promise.reject('wrong credentials')
			}
		})
		.catch(err => Promise.reject('wrong credentials'))
}

// Checks JWT token against REDIS DB
const getAuthTokenId = (req,res) => {
	const { authorization } = req.headers;
	return redisClient.get(authorization, (err,reply) => {
		if (err || !reply){
			return res.status(400).json('Unauthorized');
		} else {
			return res.json({id: reply})
		}
	})
}

const signToken = (email) => {
	const jwtPayload = { email };
	return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days'});
}

const setToken = (tokenKey, idValue) => {
	return Promise.resolve(redisClient.set(tokenKey, idValue))
}

// Creates new JWT token if successful login & no current token
const createSessions = (user) => {
	const { email, id } = user;
	const token = signToken(email);
	return setToken(token,id)
		.then(() => {
			return { success: 'true', userId: id, token }
		})
		.catch(console.log)
}

// Required for requests after login that affect specific user profiles
// If there is a token, check against REDIS DB
// Otherwise, create new session token if valid login
const signInAuthentication = (db, bcrypt) => (req,res) => {
	const { authorization } = req.headers;
	return authorization ? getAuthTokenId(req,res) : 
		handleSignin(db,bcrypt,req,res)
			.then(data => {
				return data.id && data.email ? createSessions(data) : Promise.reject(data);
			})
			.then(session => res.json(session))
			.catch(err => res.status(400).json(err));
}

module.exports = {
	signInAuthentication,
	redisClient
}