import validator from 'validator';

export const checkValidYear = (year: string) => {
	if (!validator.isNumeric(year) || year.length !== 4) return false;
	return true;
};

export const checkValidMonth = (month: string) => {
	if (!validator.isNumeric(month) || Number(month) > 12 || Number(month) < 1) return false;
	return true;
};
