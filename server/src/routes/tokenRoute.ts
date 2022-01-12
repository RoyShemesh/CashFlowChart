import express from 'express';
import bcrypt from 'bcrypt';
import UserSchema from '../mongo/schema/User';
import { UserFromDb } from '../utils/interface';
import { changeTok, login, logout } from '../utils/authToken';
import { tokenValidation } from '../middleware/tokenMiddleware';
import { ErrorIncorrectVariables, ErrorMissingInfo } from '../utils/errorClass';
const router = express.Router();

router.put('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) throw new ErrorMissingInfo();
		const user: UserFromDb[] = await UserSchema.find({ email: email.toLowerCase() });
		if (user[0] === undefined || !(await bcrypt.compare(password, user[0].password)))
			throw new ErrorIncorrectVariables();
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
router.put('/newToken', tokenValidation, (req, res) => {
	// const refreshToken = req.body.token;
	// if (refreshToken === undefined) {
	// 	return res.status(401).send('Refresh Token Required');
	// }
	// jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any) => {
	// 	if (err) return res.status(403).send('Invalid Refresh Token');
	// const accessToken = changeTok(refreshToken);
	const accessToken = changeTok(req.body.refreshToken);
	if (accessToken === 403) {
		return res.status(403).send('Invalid Refresh Token');
	}
	res.json({ accessToken });
	// });
});

router.put('/logout', tokenValidation, (req, res) => {
	// const refreshToken = req.body.token;
	// if (refreshToken === undefined) {
	// 	return res.status(400).send('Refresh Token Required');
	// }
	// jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any) => {
	// 	if (err) return res.status(400).send('Invalid Refresh Token');
	// 	const result = logout(refreshToken);
	// 	if (result) return res.send('User Logged Out Successfully');
	// 	res.sendStatus(400);
	const result = logout(req.body.refreshToken);
	if (result) return res.send('User Logged Out Successfully');
	res.sendStatus(400);
	// });
});

export default router;
