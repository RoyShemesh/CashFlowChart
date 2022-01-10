import Mongoose, { ConnectOptions } from 'mongoose';
import { PORT, MONGODB_URI } from './utils/config';
import app from './app';

// Mongoose.connect(MONGODB_URI as string)
// 	.then(() => {
// 		console.log('connected to monogodb');
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
// })
// .catch(() => {
// 	console.log('error occured connecting to MONGODB');
// });
