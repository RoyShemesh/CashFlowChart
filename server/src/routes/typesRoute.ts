import express from 'express';
import TypesModel from '../mongo/schema/Types';
import { ErrorInvalidVariable } from '../utils/errorClass';

const router = express.Router();

router.get('/alltypes', async (req, res, next) => {
	try {
		const types = await TypesModel.find({ user_id: req.body.user });
		if (types === undefined) throw new ErrorInvalidVariable();
		res.send(types);
	} catch (error) {
		next(error);
	}
});

export default router;
