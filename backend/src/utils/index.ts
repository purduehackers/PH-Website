import { IMemberModel, Member } from '../models/member';
import { userInfo } from 'os';

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

export const hasPermission = (user, name) =>
	user.permissions.some(per => per.name === name || per.name === 'admin');

export const isAdmin = user => hasPermission(user, 'admin');

export const memberMatches = (user: IMemberModel, id) =>
	user &&
	(hasPermission(user, 'admin') ||
		user._id === id ||
		(typeof user._id.equals === 'function' && user._id.equals(id)));
