import express, { Request } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRouter from './routes/userRoute';
import tokenRouter from './routes/tokenRoute';
import typesRouter from './routes/typesRoute';
import errorHandler from './middleware/errorHandler';
import tokenMiddleware from './middleware/tokenMiddleware';
import Mongoose from 'mongoose';
import { MONGODB_URI } from './utils/config';
const app = express();
app.use(express.json());
app.use(cors());
morgan.token('body', (req: Request) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

Mongoose.connect(MONGODB_URI as string)
	.then(() => {
		console.log('connected to monogodb');
	})
	.catch(() => {
		console.log('error occured connecting to MONGODB');
	});

app.post('/', (req, res) => {
	res.send('hello');
});
app.use('/user', userRouter);
app.use('/token', tokenRouter);
app.use('/types', tokenMiddleware, typesRouter);
app.use(errorHandler);

export default app;
