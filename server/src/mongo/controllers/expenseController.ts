import ExpenseSchema from '../schema/Expense';
import validator from 'validator';
import { ErrorInvalidVariable, ErrorTransNotFound } from '../../utils/errorClass';
export const deleteExpense = async (transaction_id: string, user_id: string) => {
	try {
		await ExpenseSchema.findByIdAndDelete(transaction_id);
		const newExpenses = await ExpenseSchema.find({ user_id: user_id });
		return newExpenses;
	} catch (error) {
		throw new ErrorTransNotFound();
	}
};

export const addExpense = async (
	user_id: string,
	description: string,
	type_name: string,
	date: Date,
	totalExpense: string
) => {
	if (!validator.isNumeric(totalExpense)) throw new ErrorInvalidVariable();
	const newDate = new Date(date);
	const newExpense = new ExpenseSchema({
		user_id,
		description,
		type_name,
		date: newDate,
		totalExpense: totalExpense,
	});
	newExpense.save();
	return newExpense;
};
