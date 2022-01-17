import { model, Schema } from 'mongoose';
import { Expense } from '../../utils/interface';

const expenseSchema = new Schema<Expense>({
	user_id: { type: String, required: true },
	type_name: { type: String, required: true },
	description: { type: String, required: true },
	date: { type: Date, required: true },
	totalExpense: { type: Number, required: true },
});

const ExpenseModel = model<Expense>('Expense', expenseSchema);

export default ExpenseModel;
