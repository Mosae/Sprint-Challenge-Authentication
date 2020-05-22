/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	//verify that users are logged in
	const token = req.headers.authorization;
	if (token) {
		const secret = process.env.JWT_SECRET || 'golfer';
		jwt.verify(token, secret, (error, decodedToken) => {
			if (error) {
				//this means the token is invalid
				res.status(401).json({ you: 'shall not pass!' });
			} else {
				//token is valid
				req.jwt = decodedToken;
				next();
			}
		});
	} else {
		res
			.status(400)
			.json({ message: 'Please provide the authentication information' });
	}
};
