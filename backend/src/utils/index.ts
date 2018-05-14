import { MemberModel as Member, Permissions } from '../models/member';

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
	const memberBuilder = {
		name,
		email,
		emailPublic: email,
		password,
		graduationYear,
		permissions: [Permissions.NONE]
	};

	if (email.endsWith('.edu')) Object.assign(memberBuilder, { emailEdu: email });

	return new Member(memberBuilder);
};
