import dotenv from 'dotenv';
dotenv.config();

export const SALT = Number(process.env.SALT as string);
export const PORT = process.env.PORT || 3000;
export const MONGODB_URI =
	process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
