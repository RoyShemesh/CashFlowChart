import { ExpenseFromDb, IncomeFromDb, Summary } from '../interface';

export const summaryExpenses = (expensesArr: ExpenseFromDb[]) => {
	const summary: Summary = { totalSum: 0 };
	expensesArr.forEach((expense) => {
		summary.totalSum += expense.totalExpense;
		summary[expense.type_name] === undefined
			? (summary[expense.type_name] = expense.totalExpense)
			: (summary[expense.type_name] += expense.totalExpense);
	});
	return summary;
};
export const summaryIncomes = (incomesArr: IncomeFromDb[]) => {
	const summary: Summary = { totalSum: 0 };
	incomesArr.forEach((income) => {
		summary.totalSum += income.totalIncome;
		summary[income.type_name] === undefined
			? (summary[income.type_name] = income.totalIncome)
			: (summary[income.type_name] += income.totalIncome);
	});
	return summary;
};
