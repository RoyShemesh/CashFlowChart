import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import UserModel from '../src/mongo/schema/User';
const api = supertest(app);

beforeAll(async () => {
	await UserModel.deleteMany({});
});

describe('Login user', () => {
	beforeAll(async () => {
		const newUser = {
			firstName: 'Roy',
			lastName: 'Shemesh',
			password: '123456',
			email: 'lorem@ipsum.com',
		};
		await api.post('/user/createuser').send(newUser).expect(200);
	});
	test('Login with correct variables return with status and token', async () => {
		await api
			.put('/login')
			.send({ email: 'lorem@ipsum.com', password: '123456' })
			.expect((res) => {
				// console.log(res);
			});
	});
	test('Login with incorrect variables return with status 401', async () => {
		const res = await api
			.put('/login')
			.send({ email: 'lorem@ipsum.com', password: '134' })
			.expect(401);
	});
	test('Login with missing variables return status 400', async () => {
		await api.put('/login').send({ email: 'lorem@ipsum.com' }).expect(400);
	});
});
afterAll(() => {
	mongoose.connection.close();
});
