class ErrorBucket extends Error {
	type: string;
	status: number;
	constructor() {
		super();
		this.name = this.constructor.name;
		if (this instanceof ErrorMissingInfo) {
			this.type = 'Missing info';
			this.status = 400;
		} else if (this instanceof ErrorInvalidVariable) {
			this.type = 'Invalid varibales';
			this.status = 400;
		} else if (this instanceof ErrorTransNotFound) {
			this.type = 'Transaction not found';
			this.status = 404;
		} else if (this instanceof ErrorEmailAlreadyCaught) {
			this.type = 'Email already caught';
			this.status = 409;
		} else if (this instanceof ErrorVariablesAlreadyExist) {
			this.type = 'Variable already exist';
			this.status = 409;
		} else if (this instanceof ErrorIncorrectVariables) {
			this.type = 'Username or password are incorrect';
			this.status = 401;
		} else if (this instanceof ErrorInvalidAccessToken) {
			this.type = 'Invalid Access Token';
			this.status = 403;
		} else if (this instanceof ErrorForbiddenRequest) {
			this.type = 'Values does not match';
			this.status = 403;
		} else if (this instanceof ErrorAccessTokenRequired) {
			this.type = 'Access Token Required';
			this.status = 401;
		} else if (this instanceof ErrorUnknownParam) {
			this.type = 'Unknown param was received';
			this.status = 404;
		} else {
			this.type = 'Internal server error';
			this.status = 500;
		}
		this.message = this.type;
	}
}
export class ErrorMissingInfo extends ErrorBucket {}
export class ErrorInvalidVariable extends ErrorBucket {}
export class ErrorEmailAlreadyCaught extends ErrorBucket {}
export class ErrorIncorrectVariables extends ErrorBucket {}
export class ErrorInvalidAccessToken extends ErrorBucket {}
export class ErrorAccessTokenRequired extends ErrorBucket {}
export class ErrorUnknownParam extends ErrorBucket {}
export class ErrorVariablesAlreadyExist extends ErrorBucket {}
export class ErrorTransNotFound extends ErrorBucket {}
export class ErrorForbiddenRequest extends ErrorBucket {}
