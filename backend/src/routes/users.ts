import * as express from 'express';
import { UserModel as User } from '../models/user';

export const router = express.Router();

router.get('/', async (req, res, next) => {
	const users = await User.find().exec();
	console.log(users);
	res.send('users');
});

router.post('/', async (req, res, next) => {
	const user = new User({
		name: 'Test Testerson',
		username: 'test123',
		email: 'test@test.com',
		graduationYear: 2020,
		password: 'boi'
	});
	await user.save();
	const u = await User.findOne({ name : 'Test Testerson' }).lean().exec();
	console.log(u);
	res.send(u);
});