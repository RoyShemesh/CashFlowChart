import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import UserModel from '../src/mongo/schema/User';
import request from 'superagent';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../src/utils/config';
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
	describe('Login manipulation', () => {
		let res: request.Response, refreshToken: string, userG: any;
		beforeAll(async () => {
			res = await api
				.put('/token/login')
				.send({ email: 'lorem@ipsum.com', password: '123456' })
				.expect(200);
			console.log(res);
			refreshToken = JSON.parse(res.text).refreshToken;
		});
		test('Login with correct variables return with status 200 and token', async () => {
			expect(res.body).toEqual(
				expect.objectContaining({
					accessToken: expect.any(String),
					refreshToken: expect.any(String),
				})
			);
			const err = await jwt.verify(
				res.body.accessToken,
				ACCESS_TOKEN_SECRET,
				(err: any, user: any) => {
					userG = user;
					return err;
				}
			);
			expect((err as any) instanceof JsonWebTokenError).toBeFalsy();
		});
		test('Change token return with new one', async () => {
			const changeRes = await api.put('/token/newToken').send({ token: refreshToken }).expect(200);
			expect(changeRes.body).toEqual(
				expect.objectContaining({
					accessToken: expect.any(String),
				})
			);
			const user: any = await jwt.verify(
				changeRes.body.accessToken,
				ACCESS_TOKEN_SECRET,
				(err: any, user: any) => {
					return user;
				}
			);
			console.log(user.user);
			console.log(userG.user);

			expect(user.user).toEqual(userG.user);
		});
		test('Logout with refresh token return with status 200', async () => {
			await api.put('/token/logout').send({ token: refreshToken }).expect(200);
		});
		test('Change token after logout return with status 403', async () => {
			const changeRes = await api.put('/token/newToken').send({ token: refreshToken }).expect(403);
		});
	});
	test('Login with incorrect variables return with status 401', async () => {
		const res = await api
			.put('/token/login')
			.send({ email: 'lorem@ipsum.com', password: '134' })
			.expect(401);
	});
	test('Login with missing variables return status 400', async () => {
		await api.put('/token/login').send({ email: 'lorem@ipsum.com' }).expect(400);
	});
});
afterAll(() => {
	mongoose.connection.close();
});
