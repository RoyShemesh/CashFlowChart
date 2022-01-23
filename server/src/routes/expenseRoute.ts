import express from 'express';
import ExpenseSchema from '../mongo/schema/Expense';
import {
	ErrorForbiddenRequest,
	ErrorInvalidVariable,
	ErrorMissingInfo,
	ErrorUnknownParam,
} from '../utils/errorClass';
import {
	addExpense,
	checkUserExpense,
	deleteExpense,
	getExpensesByMonth,
	getExpensesByYear,
} from '../mongo/controllers/expenseController';
import { checkValidMonth, checkValidYear } from '../utils/helpers/generalTools';
import { existType } from '../mongo/controllers/typeController';
const router = express.Router();

router.get('allexpense', async (req, res, next) => {
	try {
		const expenses = await ExpenseSchema.find({ user_id: req.body.user });
		res.send(expenses);
	} catch (error) {
		next(error);
	}
});

router.delete('/', async (req, res, next) => {
	try {
		const { transaction_id, user } = req.body;
		if (!transaction_id) throw new ErrorMissingInfo();
		if (!(await checkUserExpense(transaction_id, user))) throw new ErrorForbiddenRequest();
		const newExpenses = await deleteExpense(transaction_id, user);
		res.send(newExpenses);
	} catch (error) {
		next(error);
	}
});

router.put('/addexpense', async (req, res, next) => {
	try {
		const { user, description, type_name, date, totalExpense } = req.body;
		if (!description || !type_name || !date || !totalExpense) throw new ErrorMissingInfo();
		if (!(await existType('expenseTypes', user, type_name))) throw new ErrorUnknownParam();
		const newExpense = await addExpense(user, description, type_name, date, totalExpense);
		res.send(newExpense);
	} catch (error) {
		next(error);
	}
});

router.get('/expensesbymonth', async (req, res, next) => {
	try {
		const { user, year, month } = req.body;
		if (year === undefined || month === undefined) throw new ErrorMissingInfo();
		if (!checkValidMonth(month.toString()) || !checkValidYear(year.toString()))
			throw new ErrorInvalidVariable();
		const data = await getExpensesByMonth(month, year, user);
		res.send(data);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

router.get('/expensesbyyear', async (req, res, next) => {
	try {
		const { user, year } = req.body;
		if (year === undefined) throw new ErrorMissingInfo();
		if (!checkValidYear(year.toString())) throw new ErrorInvalidVariable();
		const data = await getExpensesByYear(year, user);
		res.send(data);
	} catch (error) {
		console.log(error);

		next(error);
	}
});
export default router;
