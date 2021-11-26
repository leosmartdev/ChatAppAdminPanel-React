const {userSchemaModel} = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.verifyToken =  async (req, res, next) => { 
	let token = null; 

	if(req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer')) {	
		token = req.headers['authorization'].split(' ')[1];
	} else {
		token = req.body.token || req.query.token || req.headers["x-access-token"];
	}

	if (!token) {
		return res.status(403).send("A token is required for authentication");
	}

	try { 
		const decoded = jwt.verify(token, 'secret');
		const user = await userSchemaModel.findById(decoded.user._id);
		if (user.token != token) {		// if token is different from db.
			// to do something
			return res.status(403).send("This token is expired !");
		}
		req.user = user;
		next();
	}
	catch(err) {
		return res.status(500).json({
			success: false,
			message: `Invalid Token: ${err.message}`,
			error: err
		});
	}
}