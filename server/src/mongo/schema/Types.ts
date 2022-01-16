import { model, Schema } from 'mongoose';
import { Types } from '../../utils/interface';

const typesSchema = new Schema<Types>({
	user_id: { type: String, required: true },
	expenseTypes: { type: [{ typeName: String, color: String }], required: true },
	incomeTypes: { type: [{ typeName: String, color: String }], required: true },
});

const TypesModel = model<Types>('Types', typesSchema);

export default TypesModel;
