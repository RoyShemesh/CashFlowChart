import express from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { REFRESH_TOKEN_SECRET, SALT } from '../utils/config';
import UserSchema from '../mongo/schema/User';
import { User, UserFromDb } from '../utils/interface';
import { changeTok, login, logout } from '../utils/authToken';
import jwt, { JwtPayload } from 'jsonwebtoken';
const router = express.Router();

router.put('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) throw { status: 400, msg: 'Missing login variables' };
		const user: UserFromDb[] = await UserSchema.find({ email: email.toLowerCase() });
		if (user[0] === undefined || !(await bcrypt.compare(password, user[0].password)))
			throw { status: 401, msg: 'Username or password are incorrect' };
		const { accessToken, refreshToken } = login({
			id: user[0]._id.toString(),
			firstName: user[0].firstName,
			lastName: user[0].lastName,
		});
		res.json({ accessToken, refreshToken });
	} catch (error) {
		next(error);
	}
});
router.put('/newToken', (req, res) => {
	const refreshToken = req.body.token;
	if (refreshToken === undefined) {
		return res.status(401).send('Refresh Token Required');
	}
	jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any) => {
		if (err) return res.status(403).send('Invalid Refresh Token');
		const accessToken = changeTok(refreshToken);
		if (accessToken === 403) {
			return res.status(403).send('Invalid Refresh Token');
		}
		res.json({ accessToken });
	});
});

router.put('/logout', (req, res) => {
	const refreshToken = req.body.token;
	if (refreshToken === undefined) {
		return res.status(400).send('Refresh Token Required');
	}
	jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any) => {
		if (err) return res.status(400).send('Invalid Refresh Token');
		const result = logout(refreshToken);
		if (result) return res.send('User Logged Out Successfully');
		res.sendStatus(400);
	});
});

export default router;
