import express from 'express';
import { createTypes } from '../mongo/controllers/typeController';
import { checkValidEmail, createUser } from '../mongo/controllers/userControllers';
import {
	ErrorEmailAlreadyCaught,
	ErrorInvalidVariable,
	ErrorMissingInfo,
} from '../utils/errorClass';
import { validateUserVariables } from '../utils/helpers/userHelper';

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
		const userId = await createUser(firstName, lastName, email, password);
		const Types = await createTypes(userId);
		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
});

export default router;
