import validator from 'validator';
/**
 * Validate user varialbes
 * @param {string} firstName should be string
 * @param {string} lastName should be string
 * @param {string} email should be string
 * @returns return true if everything fine
 */
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
