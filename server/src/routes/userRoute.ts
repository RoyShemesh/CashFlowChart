import express from 'express';
import validator from 'validator';
import User from '../schema/User';
import bcrypt from 'bcrypt';
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
		if (!validateUser(firstName, lastName, email)) {
			throw { msg: 'Enter invalid varibale', status: 400 };
		}
		const hashedPassword = bcrypt.hashSync(password, 8);
		const newUser = new User({ firstName, lastName, email, password: hashedPassword });
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

const validateUser = (firstName: string, lastName: string, email: string): boolean => {
	if (validator.isEmail(email) && validator.isAlpha(firstName) && validator.isAlpha(lastName)) {
		return true;
	}
	return false;
};
