export interface User {
	firstName: string;
	lastName: string;
	password: string;
	email: string;
}
export interface UserFromDb extends User {
	_id: string;
}
export type TokenContent = Omit<User, 'email' | 'password'> & { id: string };

export interface Types {
	user_id: string;
	incomeTypes: EachType[];
	expenseTypes: EachType[];
}

export interface TypesFromDb extends Types {
	_id: string;
}

export interface EachType {
	typeName: string;
	color: string;
}

export interface Expense {
	user_id: string;
	description: string;
	type_name: string;
	date: Date;
	totalExpense: number;
}

export interface ExpenseFromDb extends Expense {
	_id: string;
}
