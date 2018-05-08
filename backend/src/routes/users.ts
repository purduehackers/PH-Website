import * as express from 'express';
import { UserModel as User } from '../models/user';
import * as jwt from 'jsonwebtoken';
import { successRes, errorRes } from '../utils';
export const router = express.Router();

router.get('/', async (req, res, next) => {
	const users = await User.find().exec();
	console.log(users);
	res.send('users');
});

router.post('/signup', async (req, res, next) => {
	const { name, username, email, graduationYear, password } = req.body;
	if (!name) return errorRes(res, 400, 'User must have a full name');
	if (!username) return errorRes(res, 400, 'User must have a username');
	if (!email) return errorRes(res, 400, 'User must have an email');
	if (!graduationYear) return errorRes(res, 400, 'User must have a graduation year');
	if (!password) return errorRes(res, 400, 'User must have a password');

	const user = new User({
		name,
		username,
		email,
		graduationYear,
		password
	});
	await user.save();
	const token = jwt.sign(user.toJSON(), CONFIG.SECRET);
	return successRes(res, {
		user,
		token
	});
});

router.post('/login', async (req, res, next) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username }).exec();
		if (!user) return errorRes(res, 401, 'Authentication failed. User not found.');

		// Check if password matches
		const isMatch = user.comparePassword(password);
		if (!isMatch) return errorRes(res, 401, 'Authentication failed. Wrong password.');

		// If user is found and password is right create a token
		const token = jwt.sign(user.toJSON(), CONFIG.SECRET);
		return successRes(res, {
			user,
			token
		});
	} catch (error) {
		console.error(error);
		return errorRes(res, 400, error);
	}
});
