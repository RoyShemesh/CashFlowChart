import api from '../expensesTests.test';

export const addExpense = async (
	type_name: string,
	totalExpense: number,
	date: Date,
	description: string,
	token: string
) => {
	const res = await api
		.put('/expenses/addexpense')
		.set({ Authorization: token })
		.send({
			type_name,
			totalExpense,
			date,
			description,
		})
		.expect(200);
	return res;
};
