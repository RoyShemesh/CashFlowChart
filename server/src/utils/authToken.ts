import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../utils/config';
import { TokenContent } from './interface';
let refreshTokens: string[] = [];
/**
 * Handle user login, token manipulation
 * @param {TokenContent} user as TokenContent
 * @returns	tokens
 */
export const login = (user: TokenContent) => {
	const accessToken = generateAccessToken(user);
	const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);
	refreshTokens.push(refreshToken);
	return { accessToken, refreshToken };
};

/**
 * Handle user logout, token manipulation
 * @param {string} refTok
 * @returns true if everything fine or false otherwise
 */
export const logout = (refTok: string) => {
	try {
		refreshTokens = refreshTokens.filter((token) => token !== refTok);
		return true;
	} catch (error) {
		return false;
	}
};
/**
 * Handle user changeTok, token manipulation
 * @param {string} refToken
 * @returns new token
 */
export const changeTok = (refToken: string) => {
	if (refToken == null) return 401;
	if (!refreshTokens.includes(refToken)) return 403;
	return jwt.verify(refToken, REFRESH_TOKEN_SECRET, (err, user) => {
		if (err || user === undefined) return 403;
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
		expiresIn: '1h',
	});
}
