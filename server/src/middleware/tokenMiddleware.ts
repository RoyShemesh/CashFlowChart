import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../utils/config';
const tokenMiddleware: RequestHandler = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader === undefined) {
		return res.status(401).send('Access Token Required');
	}
	const token = authHeader.split(' ')[1];
	jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
		console.log(err);
		if (err) return res.status(403).send('Invalid Access Token');
		req.body.user = user;
		next();
	});
};

export default tokenMiddleware;
