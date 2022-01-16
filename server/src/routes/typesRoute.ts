import express from 'express';
import TypesModel from '../mongo/schema/Types';
import { ErrorInvalidVariable, ErrorMissingInfo, ErrorUnknownParam } from '../utils/errorClass';
import { addType } from '../utils/helpers/typesHelper';
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
		const types = await addType(req.body.user, kind, { color, typeName });
		res.send(types);
	} catch (error) {
		next(error);
	}
});

export default router;
