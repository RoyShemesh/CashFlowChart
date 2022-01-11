import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../utils/config';
let refreshTokens: string[] = [];

export const login = (userId: string) => {
	const accessToken = generateAccessToken(userId);
	const refreshToken = jwt.sign(userId, REFRESH_TOKEN_SECRET);
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
		const accessToken = generateAccessToken(user.userId);
		return accessToken;
	});
};

function generateAccessToken(userId: string) {
	return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
		expiresIn: '60s',
	});
}
