import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import UserModel from '../src/mongo/schema/User';
const api = supertest(app);

beforeAll(async () => {
	await UserModel.deleteMany({});
});

describe('Create user', () => {
	beforeAll(async () => {
		const newUser = {
			firstName: 'Roy',
			lastName: 'Shemesh',
			password: '123456',
			email: 'lorem@ipsum.com',
		};
		await api.post('/user/createuser').send(newUser).expect(200);
	});

	test('Valid variables create a user', async () => {
		const users = await UserModel.find({});
		expect(users).toHaveLength(1);
	});
	test('Password saved in db is hashed', async () => {
		const users = await UserModel.find({ firstName: 'Roy' });
		expect(users[0].password).not.toEqual('123456');
	});
	test('Already caught email return status 409', async () => {
		const newUser = {
			firstName: 'Roy',
			lastName: 'Shemesh',
			password: '123456',
			email: 'lorem@ipsum.com',
		};
		await api.post('/user/createuser').send(newUser).expect(409);
	});
	test('Missing variables return status 400', async () => {
		const newUser = {
			lastName: 'Shemesh',
			password: '123456',
			email: 'lorem@ipsum.com',
		};
		await api.post('/user/createuser').send(newUser).expect(400);
		const users = await UserModel.find({});
		expect(users).toHaveLength(1);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
