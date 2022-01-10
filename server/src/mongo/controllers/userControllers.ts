import User from '../schema/User';
export const checkValidEmail = async (email: string) => {
	const check = await User.find({ email });
	if (!check[0]) {
		return false;
	} else {
		return true;
	}
};
