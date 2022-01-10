import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (!err.status) {
		res.status(500).json('Internal server eroor ');
	} else {
		res.status(err.status).json({ msg: err.msg });
	}
};
export default errorHandler;
