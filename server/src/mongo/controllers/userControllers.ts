import User from '../schema/User';
import bcrypt from 'bcrypt';
import { SALT } from '../../utils/config';

export const checkValidEmail = async (email: string) => {
	const check = await User.find({ email });
	if (!check[0]) {
		return false;
	} else {
		return true;
	}
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
