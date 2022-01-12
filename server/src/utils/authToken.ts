import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../utils/config';
import { TokenContent } from './interface';
let refreshTokens: string[] = [];

export const login = (user: TokenContent) => {
	const accessToken = generateAccessToken(user);
	const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);
	refreshTokens.push(refreshToken);
	return { accessToken, refreshToken };
};

export const logout = (refTok: string) => {
	try {
		refreshTokens = refreshTokens.filter((token) => token !== refTok);
		return true;
	} catch (error) {
		return false;
	}
};

export const changeTok = (refToken: string) => {
	if (refToken == null) return 401;
	if (!refreshTokens.includes(refToken)) return 403;
	return jwt.verify(refToken, REFRESH_TOKEN_SECRET, (err, user) => {
		if (err || user === undefined) return 403;
		console.log(user);
		const accessToken = generateAccessToken({
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
		});
		return accessToken;
	});
};

function generateAccessToken(user: TokenContent) {
	return jwt.sign({ user }, ACCESS_TOKEN_SECRET, {
		expiresIn: '60s',
	});
}
