import User from '../schema/User';
import bcrypt from 'bcrypt';
import { SALT } from '../../utils/config';
/**
 * Check if email already caught
 * @param {string} email as string
 * @returns true if email valid
 */
export const checkValidEmail = async (email: string) => {
	const check = await User.find({ email });
	return check[0];
};
/**
 * Create uesr
 * @param {string} firstName as string
 * @param {string} lastName as string
 * @param {string} email as string
 * @param {string} password as string
 * @returns new user ID
 */
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
