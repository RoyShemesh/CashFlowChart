import validator from 'validator';
/**
 * Validate year
 * @param {string} year
 * @returns true if everything fine or false otherwise
 */
export const checkValidYear = (year: string) => {
	if (!validator.isNumeric(year) || year.length !== 4) return false;
	return true;
};
/**
 * Validate month
 * @param {string} month
 * @returns true if everything fine or false otherwise
 */

export const checkValidMonth = (month: string) => {
	if (!validator.isNumeric(month) || Number(month) > 12 || Number(month) < 1) return false;
	return true;
};
