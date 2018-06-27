import { IMemberModel, Member } from '../models/member';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

export const successRes = (res: Response, response: any) => res.json({ status: 200, response });

export const errorRes = (res: Response, status: number, error: any) =>
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

export const hasPermission = (user: IMemberModel, name: string) =>
	user.permissions.some(per => per.name === name || per.name === 'admin');

export const isAdmin = (user: IMemberModel) => hasPermission(user, 'admin');

export const memberMatches = (user: IMemberModel, id: ObjectId | string) =>
	user &&
	(hasPermission(user, 'admin') ||
		user._id === id ||
		(typeof user._id.equals === 'function' && user._id.equals(id)));

export const escapeRegEx = str => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

export function to<T, U = any>(
	promise: Promise<T>,
	errorExt?: object
): Promise<[T | null, U | null]> {
	return promise.then<[T, null]>((data: T) => [data, null]).catch<[null, U]>(err => {
		if (errorExt) Object.assign(err, errorExt);

		return [null, err];
	});
}
