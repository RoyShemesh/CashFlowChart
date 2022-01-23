import api from '../incomeTests.test';

export const addIncome = async (
	type_name: string,
	totalIncome: number,
	date: Date,
	description: string,
	token: string
) => {
	const res = await api
		.put('/incomes/addincome')
		.set({ Authorization: token })
		.send({
			type_name,
			totalIncome,
			date,
			description,
		})
		.expect(200);
	return res;
};
