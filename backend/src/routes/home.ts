import * as express from 'express';
import * as passport from 'passport';
import { successRes } from '../utils';
export const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
	return successRes(res, 'API Home Page');
});
