import ExpenseSchema from '../schema/Expense';
import validator from 'validator';
import { ErrorInvalidVariable, ErrorTransNotFound } from '../../utils/errorClass';
import { ExpenseFromDb } from '../../utils/interface';
/**
 * Delete one expense
 * @param {string} transaction_id  expenseId
 * @param {string} user_id  userId
 * @returns Array of new expenses
 */
export const deleteExpense = async (transaction_id: string, user_id: string) => {
	try {
		await ExpenseSchema.findByIdAndDelete(transaction_id);
		const newExpenses = await ExpenseSchema.find({ user_id: user_id });
		return newExpenses;
	} catch (error) {
		throw new ErrorTransNotFound();
	}
};
/**
 * Check if user does have the expense
 * @param {string} transaction_id  expenseId
 * @param {string} user_id  userId
 * @returns true if he does or false otherwise
 */

export const checkUserExpense = async (transaction_id: string, user_id: string) => {
	try {
		const data = await ExpenseSchema.find({ user_id, _id: transaction_id });
		if (data[0] === undefined) throw '';
		return true;
	} catch (error) {
		return false;
	}
};
/**
 * Add expense to user
 * @param {string} user_id
 * @param {string} description
 * @param {string}
 * @param {Date} date as Date
 * @param {string} totalExpense
 * @returns new expense
 */
export const addExpense = async (
	user_id: string,
	description: string,
	type_name: string,
	date: Date,
	totalExpense: string
) => {
	if (!validator.isNumeric(totalExpense.toString())) throw new ErrorInvalidVariable();
	const newDate = new Date(date);
	const newExpense = new ExpenseSchema({
		user_id,
		description,
		type_name,
		date: newDate,
		totalExpense: totalExpense,
	});
	await newExpense.save();
	return newExpense;
};
/**
 * Get all expenses by month
 * @param {string} month
 * @param {string} year
 * @param {string} user_id  UserId
 * @returns  {ExpenseFromDb[]} Array of expenses
 */
export const getExpensesByMonth = async (month: string, year: string, user_id: string) => {
	const endDate = { endYear: Number(year), endMonth: Number(month) + 1 };
	if (month === '12') {
		endDate.endYear = Number(year) + 1;
		endDate.endMonth = 1;
	}
	const data: ExpenseFromDb[] = await ExpenseSchema.find({
		user_id,
		date: {
			$gte: `${year}-${month}-1`,
			$lte: `${endDate.endYear}-${endDate.endMonth}-1`,
		},
	});
	return data;
};
/**
 * Get all expenses by year
 * @param {string} year
 * @param {string} user_id  userId
 * @returns  {ExpenseFromDb[]} Array of expenses
 */
export const getExpensesByYear = async (year: string, user_id: string) => {
	const data: ExpenseFromDb[] = await ExpenseSchema.find({
		user_id,
		date: {
			$gte: `${year}-1-1`,
			$lte: `${year + 1}-1-1`,
		},
	});
	return data;
};
