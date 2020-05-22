const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('./user-model');
const secrets = require('../config/secrets.js');

// REGISTER USER
// router.post('/register', (req, res) => {
// 	let user = req.body;
// 	const hash = bcrypt.hashSync(user.password, 4);
// 	user.password = hash;
// 	Users.add(user)
// 		.then((saved) => {
// 			res.status(201).json(saved);
// 		})
// 		.catch((err) => {
// 			res.status(500).json(err);
// 		});
// });

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

	Users.findBy({ username })
		.first()
		.then((user) => {
			if (user && bcrypt.compareSync(password, user.password)) {
				const token = generateToken(user);

				res.status(200).json({
					message: `Welcome ${user.username}! You are logged in`,
					token: token,
				});
			} else {
				res.status(401).json({ message: 'Invalid Credentials' });
			}
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});

//create token function
function createToken(user) {
	const payload = {
		userid: user.id,
		username: user.username,
	};
	const secret = secrets.jwtSecret;
	const options = { expiresIn: '1h' };

	const token = jwt.sign(payload, secrets.jwtSecret, options);

	return token;
}

module.exports = router;
