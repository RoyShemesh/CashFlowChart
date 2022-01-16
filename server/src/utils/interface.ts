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
	incomeTypes: [{ typeName: string; color: string }];
	expenseTypes: [{ typeName: string; color: string }];
}
