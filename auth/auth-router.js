const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('./user-model');
const secrets = require('../config/secrets.js');

router.post('/register', (req, res) => {
	// implement registration
	const { username, password } = req.body;
	if (!username || !password) {
		res.status(400).json({ message: 'username and password required' });
	} else {
		Users.insert({ username, password: bcrypt.hashSync(password, 3) })
			.then((user) => {
				//create token
				const token = createToken(user);

				res.status(201).json({ message: 'Registered!', token });
			})
			.catch((error) => {
				console.log('register:', error);
				res.status(500).json({ message: 'Registration failed' });
			});
	}
});

router.post('/login', (req, res) => {
	let { username, password } = req.body;

	if (!username || !password) {
		res
			.status(403)
			.json({ message: 'Please provide a username and a password' });
	} else {
		Users.findByUsername(username)
			.then((user) => {
				if (user && bcrypt.compareSync(password, user.password)) {
					const token = createToken(user);
					res.status(201).json({ message: 'You are logged in!', token });
				}
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ message: 'unable to login user', err });
			});
	}
});

//create token function
function createToken(user) {
	const payload = {
		userid: user.id,
		username: user.username,
	};
	const options = { expiresIn: '1h' };

	const token = jwt.sign(payload, secrets.jwtSecret, options);

	return token;
}

module.exports = router;
