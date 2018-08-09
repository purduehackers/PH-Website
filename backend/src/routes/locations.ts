import * as express from 'express';
import { ObjectId } from 'mongodb';
import { IPermissionModel, Permission } from '../models/permission';
import { Location } from '../models/location';
import { Member } from '../models/member';
import { successRes, errorRes, to } from '../utils';
export const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const locations = await Location.find()
			// .populate({
			// 	path: 'members',
			// 	model: Member
			// })
			.exec();
		return successRes(res, locations);
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.get('/:id', async (req, res) => {
	try {
		if (!ObjectId.isValid(req.params.id)) return errorRes(res, 400, 'Invalid location ID');
		const location = await Location.findById(req.params.id)
			.populate({
				path: 'members',
				model: Member
			})
			.exec();
		return successRes(res, location);
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});
