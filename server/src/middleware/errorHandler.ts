import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	res.status(err.status).json({ message: err.message });
};
export default errorHandler;
