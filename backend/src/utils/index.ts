import { MemberModel as Member } from '../models/member';

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
		graduationYear
	};

	if (email.endsWith('.edu')) Object.assign(memberBuilder, { emailEdu: email });

	return new Member(memberBuilder);
};

export const getPermission = (user, name) => user.permissions.some(per => per.name === name);

export const isAdmin = user => getPermission(user, 'admin');

export const memberMatches = (user, id) => getPermission(user, 'admin') || user._id === id;
