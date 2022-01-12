import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../utils/config';
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

export const tokenValidation: RequestHandler = (req, res, next) => {
	const refreshToken = req.body.token;
	if (refreshToken === undefined) {
		return res.status(400).send('Refresh Token Required');
	}
	jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any) => {
		if (err) return res.status(400).send('Invalid Refresh Token');
		req.body.refreshToken = refreshToken;
		next();
	});
};
