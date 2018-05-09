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
