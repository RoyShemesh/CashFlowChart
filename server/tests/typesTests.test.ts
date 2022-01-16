import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../src/app';
import TypesModel from '../src/mongo/schema/Types';
import UserModel from '../src/mongo/schema/User';
import { Types } from '../src/utils/interface';
const api = supertest(app);
beforeAll(async () => {
	await UserModel.deleteMany({});
	const newUser = {
		firstName: 'Roy',
		lastName: 'Shemesh',
		password: '123456',
		email: 'lorem@ipsum.com',
	};
	await api.post('/user/createuser').send(newUser).expect(200);
}, 15000);

describe('Create user tests', () => {
	test('New user initialized with expense and incomes types', async () => {
		const user = await UserModel.findOne({ firstName: 'Roy' });
		const types = await TypesModel.findOne({ user_id: user?.id });
		expect(types?.incomeTypes).toMatchObject([]);
		expect(types?.expenseTypes).toMatchObject([
			{ typeName: 'Cosmetic', color: '#ffff00' },
			{ typeName: 'Car care', color: '#ff0400' },
		]);
	});
});

describe('/types Route', () => {
	let token: string;
	beforeAll(async () => {
		const res = await api
			.put('/token/login')
			.send({ password: '123456', email: 'lorem@ipsum.com' })
			.expect(200);
		token = `Bearer ${res.body.accessToken}`;
	}, 10000);
	test('Each request must be with valid auth key', async () => {
		const token =
			'Bearer eyJhbGciOiJIUzI1NiJ9.NjFkZGM1Y2Y2OWM0ZjM5NWY4ZDAwYjIz.hcRpy1QpZKxFw2M2HOKEJsve4e3BOv8HZR0LISxZdBU';
		await api.get('/types/alltypes').expect(401);
		await api.get('/types/alltypes').set({ Authorization: token }).expect(403);
	});
	test('Get all types', async () => {
		const alltypes = await api.get('/types/alltypes').set({ Authorization: token }).expect(200);
		expect(Object.keys(alltypes.body[0])).toEqual(
			expect.arrayContaining(['__v', '_id', 'expenseTypes', 'incomeTypes', 'user_id'])
		);
	});
	test('Add income and expense type to user', async () => {
		const newExpenseType = { typeName: 'Friends', color: '#ff0400' };
		const newIncomeType = { typeName: 'Babysitter', color: '#e600ff' };
		await api
			.put('/types/addexpensetype')
			.send(newExpenseType)
			.set({ Authorization: token })
			.expect(200);
		const res = await api
			.put('/types/addincometype')
			.send(newIncomeType)
			.set({ Authorization: token })
			.expect(200);
		expect(res.body[0].incomeTypes).toMatchObject({ typeName: 'Babysitter', color: '#e600ff' });
	});
});

afterAll(() => {
	mongoose.connection.close();
});
