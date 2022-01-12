import express from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { SALT } from '../utils/config';
import User from '../mongo/schema/User';
import { checkValidEmail } from '../mongo/controllers/userControllers';
import {
	ErrorEmailAlreadyCaught,
	ErrorInvalidVariable,
	ErrorMissingInfo,
} from '../utils/errorClass';
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
			throw new ErrorMissingInfo();
		}
		if (!validateUserVariables(firstName, lastName, email)) {
			throw new ErrorInvalidVariable();
		}
		if (await checkValidEmail(email)) {
			throw new ErrorEmailAlreadyCaught();
		}
		const hashedPassword = bcrypt.hashSync(password, SALT);
		const newUser = new User({
			firstName,
			lastName,
			email: email.toLowerCase(),
			password: hashedPassword,
		});
		await newUser.save();
		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
});

export default router;

const validateUserVariables = (firstName: string, lastName: string, email: string): boolean => {
	if (validator.isEmail(email) && validator.isAlpha(firstName) && validator.isAlpha(lastName)) {
		return true;
	}
	return false;
};
