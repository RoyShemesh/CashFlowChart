import validator from 'validator';
import { ErrorInvalidVariable, ErrorTransNotFound } from '../../utils/errorClass';
import { IncomeFromDb } from '../../utils/interface';
import IncomeModel from '../schema/Income';

export const addIncome = async (
	user_id: string,
	description: string,
	type_name: string,
	date: Date,
	totalIncome: string
) => {
	if (!validator.isNumeric(totalIncome.toString())) throw new ErrorInvalidVariable();
	const newDate = new Date(date);
	const newIncome = new IncomeModel({
		user_id,
		description,
		type_name,
		date: newDate,
		totalIncome,
	});
	await newIncome.save();
	return newIncome;
};

export const checkUserIncome = async (transaction_id: string, user_id: string) => {
	try {
		const data = await IncomeModel.find({ user_id, _id: transaction_id });
		if (data[0] === undefined) throw '';
		return true;
	} catch (error) {
		return false;
	}
};

export const deleteIncome = async (transaction_id: string, user_id: string) => {
	try {
		await IncomeModel.findByIdAndDelete(transaction_id);
		const newExpenses = await IncomeModel.find({ user_id: user_id });
		return newExpenses;
	} catch (error) {
		throw new ErrorTransNotFound();
	}
};

export const getIncomesByMonth = async (month: string, year: string, user_id: string) => {
	const endDate = { endYear: Number(year), endMonth: Number(month) + 1 };
	if (month === '12') {
		endDate.endYear = Number(year) + 1;
		endDate.endMonth = 1;
	}
	const data: IncomeFromDb[] = await IncomeModel.find({
		user_id,
		date: {
			$gte: `${year}-${month}-1`,
			$lte: `${endDate.endYear}-${endDate.endMonth}-1`,
		},
	});
	return data;
};

export const getIncomesByYear = async (year: string, user_id: string) => {
	const data: IncomeFromDb[] = await IncomeModel.find({
		user_id,
		date: {
			$gte: `${year}-1-1`,
			$lte: `${year + 1}-1-1`,
		},
	});
	return data;
};
