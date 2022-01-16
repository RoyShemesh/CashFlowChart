import validator from 'validator';
import bcrypt from 'bcrypt';
import { SALT } from '../config';
import User from '../../mongo/schema/User';
import Types from '../../mongo/schema/Types';

export const validateUserVariables = (
	firstName: string,
	lastName: string,
	email: string
): boolean => {
	if (validator.isEmail(email) && validator.isAlpha(firstName) && validator.isAlpha(lastName)) {
		return true;
	}
	return false;
};
export const createUser = async (
	firstName: string,
	lastName: string,
	email: string,
	password: string
): Promise<string> => {
	const hashedPassword = bcrypt.hashSync(password, SALT);
	const newUser = new User({
		firstName,
		lastName,
		email: email.toLowerCase(),
		password: hashedPassword,
	});
	await newUser.save();
	return newUser.id;
};

export const createTypes = async (user_id: string) => {
	const userTypes = new Types({
		user_id,
		incomeTypes: [],
		expenseTypes: [
			{ typeName: 'Cosmetic', color: '#ffff00' },
			{ typeName: 'Car care', color: '#ff0400' },
		],
	});
	await userTypes.save();
	return userTypes;
};
