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
