import { EachType } from '../../utils/interface';
import TypesModel from '../schema/Types';
import { ErrorUnknownParam } from '../../utils/errorClass';

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

export const existType = async (kind: string, user_id: string, typeName: string) => {
	if (kind === 'incomeTypes' || kind === 'expenseTypes') {
		const types = await TypesModel.find({ user_id });
		const type = types[0][kind].find((type) => type.typeName === typeName);
		return type;
	} else {
		throw new ErrorUnknownParam();
	}
};

export const userAllTypesByKind = async (user_id: string, kind: string) => {
	if (kind === 'incomeTypes' || kind === 'expenseTypes') {
		const types = await TypesModel.find({ user_id });
		return types[0][kind];
	} else {
		throw new ErrorUnknownParam();
	}
};
