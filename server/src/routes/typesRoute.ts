import express from 'express';
import TypesModel from '../mongo/schema/Types';
import {
	ErrorInvalidVariable,
	ErrorMissingInfo,
	ErrorVariablesAlreadyExist,
} from '../utils/errorClass';
import { addType, existType } from '../mongo/controllers/typeController';
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
router.put('/addtype/:kind', async (req, res, next) => {
	try {
		const kind = req.params.kind;
		const { color, typeName } = req.body;
		if (color === undefined || typeName === undefined) throw new ErrorMissingInfo();
		if (await existType(kind, req.body.user, typeName)) throw new ErrorVariablesAlreadyExist();
		const types = await addType(req.body.user, kind, { color, typeName });
		res.send(types);
	} catch (error) {
		next(error);
	}
});

export default router;
