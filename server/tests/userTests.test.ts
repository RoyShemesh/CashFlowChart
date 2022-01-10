import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import UserModel from '../src/schema/User';
const api = supertest(app);

beforeEach(async () => {
	await UserModel.deleteMany({});
});

describe('Create user', () => {
	beforeEach(async () => {
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
		expect(users[0].password).not.toEqual(123456);
	});
	test('Invalid variables return status 400', async () => {
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

describe('Login user', () => {
	beforeEach(async () => {
		const newUser = {
			firstName: 'Roy',
			lastName: 'Shemesh',
			password: '123456',
			email: 'lorem@ipsum.com',
		};
		await api.post('/user/createuser').send(newUser).expect(200);
	});

	test('Login with correct variables return with status 200', async () => {
		const res = await api
			.put('/user/login')
			.send({ email: 'lorem@ipsum.com', password: '123456' })
			.expect(200);
	});
	test('Login with incorrect variables return with status 404', async () => {
		const res = await api
			.put('/user/login')
			.send({ email: 'lorem@ipsum.com', password: '134' })
			.expect(404);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
