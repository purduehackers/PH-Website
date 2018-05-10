import { UserModel as User } from '../models/user';

export const successRes = (res, response) => res.json({ status: 200, response });

export const errorRes = (res, status, error) =>
	res.status(status).json({
		status,
		error
	});

export const createAccount = async (
	name: string,
	email: string,
	password: string,
	graduationYear: number
) => {
	const userBuilder = {
		name,
		email,
		password,
		graduationYear
	};

	if (email.endsWith('.edu')) Object.assign(userBuilder, { emailEdu: email });
	Object.assign(userBuilder, {
		
	})

	return new User(userBuilder);
};
