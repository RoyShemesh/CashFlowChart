import { EachType } from '../../utils/interface';
import TypesModel from '../schema/Types';
import { ErrorUnknownParam } from '../../utils/errorClass';
/**
 * Add type
 * @param {string} user_id  as string
 * @param {string} kind  as string - Expense or Income
 * @param {EachType} newType - {EachType type}
 * @returns return all array of types
 */
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

/**
 * Check if type does exist
 * @param {string} kind Expense or Income
 * @param {string} user_id
 * @param {string} typeName
 * @returns the type if it does exist
 */
export const existType = async (kind: string, user_id: string, typeName: string) => {
	if (kind === 'incomeTypes' || kind === 'expenseTypes') {
		const types = await TypesModel.find({ user_id });
		const type = types[0][kind].find((type) => type.typeName === typeName);
		return type;
	} else {
		throw new ErrorUnknownParam();
	}
};
/**
 * Get user all types by kind
 * @param {string} user_id
 * @param {string} kind  Expense or Income
 * @returns all types
 */
export const userAllTypesByKind = async (user_id: string, kind: string) => {
	if (kind === 'incomeTypes' || kind === 'expenseTypes') {
		const types = await TypesModel.find({ user_id });
		return types[0][kind];
	} else {
		throw new ErrorUnknownParam();
	}
};
/**
 * Create deafault types
 * @param {string} user_id as string
 * @returns new types
 */
export const createTypes = async (user_id: string) => {
	const userTypes = new TypesModel({
		user_id,
		incomeTypes: [],
		expenseTypes: [
			{ typeName: 'Cosmetic', color: '#ffff00' },
			{ typeName: 'Car care', color: '#ff0400' },
		],
	});
	await userTypes.save();
	return userTypes;
};
