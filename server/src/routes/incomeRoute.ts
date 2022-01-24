import express from 'express';
import {
	ErrorForbiddenRequest,
	ErrorInvalidVariable,
	ErrorMissingInfo,
	ErrorUnknownParam,
} from '../utils/errorClass';
import {
	addIncome,
	checkUserIncome,
	deleteIncome,
	getIncomesByMonth,
	getIncomesByYear,
} from '../mongo/controllers/incomeController';
import { checkValidMonth, checkValidYear } from '../utils/helpers/generalTools';
import { existType } from '../mongo/controllers/typeController';
import { summaryIncomes } from '../utils/helpers/summaryHelper';
const router = express.Router();

router.put('/addincome', async (req, res, next) => {
	try {
		const { user, description, type_name, date, totalIncome } = req.body;
		if (!description || !type_name || !date || !totalIncome) throw new ErrorMissingInfo();
		if (!(await existType('incomeTypes', user, type_name))) throw new ErrorUnknownParam();
		const newExpense = await addIncome(user, description, type_name, date, totalIncome);
		res.send(newExpense);
	} catch (error) {
		next(error);
	}
});

router.delete('/', async (req, res, next) => {
	try {
		const { transaction_id, user } = req.body;
		if (!transaction_id) throw new ErrorMissingInfo();
		if (!(await checkUserIncome(transaction_id, user))) throw new ErrorForbiddenRequest();
		const newIncomes = await deleteIncome(transaction_id, user);
		res.send(newIncomes);
	} catch (error) {
		next(error);
	}
});

router.get('/incomesbymonth', async (req, res, next) => {
	try {
		const { user, year, month } = req.body;
		if (year === undefined || month === undefined) throw new ErrorMissingInfo();
		if (!checkValidMonth(month.toString()) || !checkValidYear(year.toString()))
			throw new ErrorInvalidVariable();
		const data = await getIncomesByMonth(month, year, user);
		const expenses = { incomeArr: data, summary: await summaryIncomes(data) };
		res.send(expenses);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

router.get('/incomesbyyear', async (req, res, next) => {
	try {
		const { user, year } = req.body;
		if (year === undefined) throw new ErrorMissingInfo();
		if (!checkValidYear(year.toString())) throw new ErrorInvalidVariable();
		const data = await getIncomesByYear(year, user);
		const expenses = { incomeArr: data, summary: await summaryIncomes(data) };
		res.send(expenses);
	} catch (error) {
		next(error);
	}
});
export default router;
