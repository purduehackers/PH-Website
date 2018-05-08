import * as express from 'express';
import * as passport from 'passport';
import { UserModel as User } from '../models/user';
import { auth } from '../middleware/passport';
import { successRes, errorRes } from '../utils';
export const router = express.Router();

/* GET home page. */
router.get('/', auth(), (req, res, next) => {
	const user = new User(req.user);
	return successRes(res, 'API Home Page');
});
