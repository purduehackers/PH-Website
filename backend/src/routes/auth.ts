import * as express from 'express';
import { MemberModel as Member } from '../models/member';
import { PermissionModel as Permission } from '../models/permission';
import * as jwt from 'jsonwebtoken';
import * as validator from 'validator';
import { successRes, errorRes, createAccount } from '../utils';
export const router = express.Router();

router.post('/signup', async (req, res, next) => {
	try {
		let { name, email, graduationYear, password, passwordConfirm } = req.body;
		const maxYear = new Date().getFullYear() + 20;
		if (typeof graduationYear === 'string') graduationYear = validator.toInt(graduationYear, 10);
		if (!name) return errorRes(res, 400, 'Member must have a full name');
		if (!email) return errorRes(res, 400, 'Member must have an email');
		if (!validator.isEmail(email)) return errorRes(res, 400, 'Invalid email address');
		if (!graduationYear) return errorRes(res, 400, 'Member must have a graduation year');
		if (graduationYear < 1869 || graduationYear > maxYear)
			return errorRes(res, 400, `Graduation year must be a number between 1869 and ${maxYear}`);
		if (!password || password.length < 5)
			return errorRes(res, 400, 'Password must be more then 5 characters');
		if (!passwordConfirm) return errorRes(res, 400, 'Invalid password confirmation');
		if (passwordConfirm !== password) return errorRes(res, 400, 'Passwords did not match');

		let user = await Member.findOne({ email }).exec();
		if (user)
			return errorRes(
				res,
				400,
				'An account already exists with that email. Please use your Purdue Hackers account password if you have one'
			);

		user = await createAccount(
			name,
			validator.normalizeEmail(email) as string,
			password,
			graduationYear
		);
		await user.save();
		const u = user.toJSON();
		delete u.password;
		const token = jwt.sign(u, CONFIG.SECRET);
		return successRes(res, {
			user: u,
			token
		});
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.post('/login', async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const user = await Member.findOne({ email }, '+password')
			.populate({ path: 'permissions', model: Permission })
			.exec();
		if (!user) return errorRes(res, 401, 'Member not found.');

		// Check if password matches
		if (!user.comparePassword(password)) return errorRes(res, 401, 'Wrong password.');

		const u = user.toJSON();
		delete u.password;

		// If user is found and password is right create a token
		const token = jwt.sign(u, CONFIG.SECRET);

		return successRes(res, {
			user: u,
			token
		});
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});
