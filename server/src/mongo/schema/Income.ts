import { model, Schema } from 'mongoose';
import { Income } from '../../utils/interface';

const incomeSchema = new Schema<Income>({
	user_id: { type: String, required: true },
	type_name: { type: String, required: true },
	description: { type: String, required: true },
	date: { type: Date, required: true },
	totalIncome: { type: Number, required: true },
});

const IncomeModel = model<Income>('Income', incomeSchema);

export default IncomeModel;
