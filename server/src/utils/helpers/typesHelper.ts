import { EachType } from '../interface';
import TypesModel from '../../mongo/schema/Types';
import { ErrorUnknownParam } from '../errorClass';

export const addType = async (user_id: string, kind: string, newType: EachType) => {
	if (kind === 'incomeTypes' || kind === 'expenseTypes') {
		const types = await TypesModel.findOneAndUpdate(
			{ user_id },
			{ $push: { [kind]: newType } },
			{ new: true }
		);
		return types;
	} else {
		throw new ErrorUnknownParam();
	}
};
