import express from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { SALT } from '../utils/config';
import UserModel from '../mongo/schema/User';
import { checkValidEmail } from '../mongo/controllers/userControllers';
const router = express.Router();

router.post('/createuser', async (req, res, next) => {
	try {
		const { firstName, lastName, password, email } = req.body;
		if (
			firstName === undefined ||
			lastName === undefined ||
			password === undefined ||
			email === undefined
		) {
			throw { status: 400, msg: 'Missing user info' };
		}
		if (!validateUserVariables(firstName, lastName, email)) {
			throw { msg: 'Enter invalid varibale', status: 400 };
		}
		if (await checkValidEmail(email)) {
			throw { msg: 'Email already caught', status: 409 };
		}
		const hashedPassword = bcrypt.hashSync(password, SALT);
		const newUser = new UserModel({ firstName, lastName, email, password: hashedPassword });
		await newUser.save();
		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
});

router.put('/login', (req, res, next) => {
	try {
		const { email, password } = req.body;
	} catch (error) {}
});
export default router;

const validateUserVariables = (firstName: string, lastName: string, email: string): boolean => {
	if (validator.isEmail(email) && validator.isAlpha(firstName) && validator.isAlpha(lastName)) {
		return true;
	}
	return false;
};
