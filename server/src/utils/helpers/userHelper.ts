import validator from 'validator';

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
