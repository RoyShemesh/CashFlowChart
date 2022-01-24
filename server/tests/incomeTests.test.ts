import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import UserModel from '../src/mongo/schema/User';
import IncomeModel from '../src/mongo/schema/Income';
import request from 'superagent';
import TypesModel from '../src/mongo/schema/Types';
import { addIncome } from './utils/incomeHelper';
const api = supertest(app);
let token: string;
beforeAll(async () => {
	await UserModel.deleteMany({});
	await IncomeModel.deleteMany({});
	await TypesModel.deleteMany({});
	const newUser = {
		firstName: 'Roy',
		lastName: 'Shemesh',
		password: '123456',
		email: 'lorem@ipsum.com',
	};
	await api.post('/user/createuser').send(newUser).expect(200);
	const res = await api
		.put('/token/login')
		.send({ password: '123456', email: 'lorem@ipsum.com' })
		.expect(200);
	token = `Bearer ${res.body.accessToken}`;
	const newIncomeType = { typeName: 'Babysitter', color: '#e600ff' };
	await api
		.put('/types/addtype/incomeTypes')
		.send(newIncomeType)
		.set({ Authorization: token })
		.expect(200);
}, 15000);

describe('Manipulation one income', () => {
	test('Add income without user token return with status 401', async () => {
		await api.put('/incomes/addincome').expect(401);
	});
	test('Add income with missing info return with status 400', async () => {
		await api
			.put('/incomes/addincome')
			.set({ Authorization: token })
			.send({ type_name: 'Babysitter', totalIncome: 123 })
			.expect(400);
	});
	test('Add income with unknown type_name return with status 404', async () => {
		await api
			.put('/incomes/addincome')
			.set({ Authorization: token })
			.send({
				type_name: 'Car',
				totalIncome: 123,
				date: new Date('2000-7-20'),
				description: 'Selling my Mazda 3',
			})
			.expect(404);
	});
	test('Add income with not only numbers totalIncome return with status 400', async () => {
		await api
			.put('/incomes/addincome')
			.set({ Authorization: token })
			.send({
				type_name: 'Babysitter',
				totalIncome: '12s3',
				date: new Date('2000-7-20'),
				description: "Ron's kids",
			})
			.expect(400);
	});
	test('Add income with appropriate valus return with status 200', async () => {
		await api
			.put('/incomes/addincome')
			.set({ Authorization: token })
			.send({
				type_name: 'Babysitter',
				totalIncome: 123,
				date: new Date('2000-7-20'),
				description: "Ron's kids",
			})
			.expect(200);
	});
});

describe('Delete income', () => {
	let res: request.Response;
	beforeAll(async () => {
		await IncomeModel.deleteMany({});
		res = await addIncome('Babysitter', 123, new Date('2000-7-20'), "Ron's kids", token);
	});
	test('Delete income with no transaction_id return with status 400 ', async () => {
		await api.delete('/incomes').set({ Authorization: token }).expect(400);
	});
	test('Delete income with not matching user and transation_id return with status 403', async () => {
		await api
			.delete('/incomes')
			.set({ Authorization: token })
			.send({ transaction_id: '12s124' })
			.expect(403);
	});
	test('Delete income with matching user and transaction_id return with status 200', async () => {
		const incomesNewArr = await api
			.delete('/incomes')
			.set({ Authorization: token })
			.send({ transaction_id: res.body._id })
			.expect(200);
		expect(incomesNewArr.body).toHaveLength(0);
	});
});

describe('Manipulate all incomes', () => {
	beforeAll(async () => {
		await IncomeModel.deleteMany({});
		await addIncome('Babysitter', 123, new Date('2000-7-20'), "Ron's kids", token);
		await addIncome('Babysitter', 123, new Date('2000-7-22'), "Ron's kids", token);
		await addIncome('Babysitter', 123, new Date('2000-8-22'), "Ron's kids", token);
	});
	test('Get all user incomes by year without getting appropriate month return with status 400', async () => {
		await api
			.get('/incomes/incomesbymonth')
			.set({ Authorization: token })
			.send({ month: 13, year: 2000 })
			.expect(400);
	});
	test('Get all user incomes by month', async () => {
		const res = await api
			.get('/incomes/incomesbymonth')
			.set({ Authorization: token })
			.send({ month: 7, year: 2000 })
			.expect(200);
		expect(res.body.incomeArr).toHaveLength(2);
		expect(res.body.summary).toEqual(
			expect.objectContaining({
				Babysitter: 246,
				totalSum: 246,
			})
		);
	});
	test('Get all user incomes by year without getting appropriate year return with status 400', async () => {
		await api
			.get('/incomes/incomesbyyear')
			.set({ Authorization: token })
			.send({ year: '200s' })
			.expect(400);
	});
	test('Get all user incomes by year', async () => {
		const res = await api
			.get('/incomes/incomesbyyear')
			.set({ Authorization: token })
			.send({ year: 2000 })
			.expect(200);
		expect(res.body.incomeArr).toHaveLength(3);
		expect(res.body.summary).toEqual(
			expect.objectContaining({
				Babysitter: 369,
				totalSum: 369,
			})
		);
	});
});

afterAll(() => {
	mongoose.connection.close();
});

export default api;
