import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import UserModel from '../src/mongo/schema/User';
import ExpenseModel from '../src/mongo/schema/Expense';
import request from 'superagent';
import { addExpense } from './utils/expenseHelper';
const api = supertest(app);
let token: string;
beforeAll(async () => {
	await UserModel.deleteMany({});
	await ExpenseModel.deleteMany({});
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
}, 15000);

describe('Manipulation one expense', () => {
	test('Add expense without user token return with status 401', async () => {
		await api.put('/expenses/addexpense').expect(401);
	});
	test('Add expense with missing info return with status 400', async () => {
		await api
			.put('/expenses/addexpense')
			.set({ Authorization: token })
			.send({ type_name: 'Car care', totalExpense: 123 })
			.expect(400);
	});
	test('Add expense with unknown type_name return with status 404', async () => {
		await api
			.put('/expenses/addexpense')
			.set({ Authorization: token })
			.send({
				type_name: 'Car',
				totalExpense: 123,
				date: new Date('2000-7-20'),
				description: 'Fuel',
			})
			.expect(404);
	});
	test('Add expense with not only numbers totalExpense return with status 400', async () => {
		await api
			.put('/expenses/addexpense')
			.set({ Authorization: token })
			.send({
				type_name: 'Car care',
				totalExpense: '12s3',
				date: new Date('2000-7-20'),
				description: 'Fuel',
			})
			.expect(400);
	});
	test('Add expense with appropriate valus return with status 200', async () => {
		await api
			.put('/expenses/addexpense')
			.set({ Authorization: token })
			.send({
				type_name: 'Car care',
				totalExpense: 123,
				date: new Date('2000-7-20'),
				description: 'Fuel',
			})
			.expect(200);
	});
});

describe('Delete expense', () => {
	let res: request.Response;
	beforeAll(async () => {
		await ExpenseModel.deleteMany({});
		res = await addExpense('Car care', 123, new Date('2000-7-20'), 'Fuel', token);
	});
	test('Delete expense with no transaction_id return with status 400 ', async () => {
		await api.delete('/expenses').set({ Authorization: token }).expect(400);
	});
	test('Delete expense with not matching user and transation_id return with status 403', async () => {
		await api
			.delete('/expenses')
			.set({ Authorization: token })
			.send({ transaction_id: '12s124' })
			.expect(403);
	});
	test('Delete expense with matching user and transaction_id return with status 400', async () => {
		const expensesNewArr = await api
			.delete('/expenses')
			.set({ Authorization: token })
			.send({ transaction_id: res.body._id })
			.expect(200);
		expect(expensesNewArr.body).toHaveLength(0);
	});
});

describe('Manipulate all expenses', () => {
	beforeAll(async () => {
		await ExpenseModel.deleteMany({});
		await addExpense('Car care', 123, new Date('2000-7-20'), 'Fuel', token);
		await addExpense('Car care', 123, new Date('2000-7-22'), 'Fuel', token);
		await addExpense('Car care', 123, new Date('2000-8-22'), 'Fuel', token);
	});
	test('Get all user expenses by year without getting appropriate month return with status 400', async () => {
		await api
			.get('/expenses/expensesbymonth')
			.set({ Authorization: token })
			.send({ month: 13, year: 2000 })
			.expect(400);
	});
	test('Get all user expenses by month', async () => {
		const res = await api
			.get('/expenses/expensesbymonth')
			.set({ Authorization: token })
			.send({ month: 7, year: 2000 })
			.expect(200);
		expect(res.body).toHaveLength(2);
	});
	test('Get all user expenses by year without getting appropriate year return with status 400', async () => {
		await api
			.get('/expenses/expensesbyyear')
			.set({ Authorization: token })
			.send({ year: '200s' })
			.expect(400);
	});
	test('Get all user expenses by year', async () => {
		const res = await api
			.get('/expenses/expensesbyyear')
			.set({ Authorization: token })
			.send({ year: 2000 })
			.expect(200);
		expect(res.body).toHaveLength(3);
	});
});

afterAll(() => {
	mongoose.connection.close();
});

export default api;
