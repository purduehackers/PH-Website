import * as express from 'express';
import { ObjectId } from 'mongodb';
import { Location } from '../models/location';
import { successRes, errorRes, to, hasPermission } from '../utils';
import { auth, hasPermissions } from '../middleware/passport';
import { Member } from '../models/member';
export const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const locations = await Location.find()
			.populate({
				path: 'members'
			})
			.exec();

		return successRes(res, locations);
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.get('/:id', async (req, res) => {
	try {
		if (!ObjectId.isValid(req.params.id))
			return errorRes(res, 400, 'Invalid location ID');
		const location = await Location.findById(req.params.id)
			.populate({
				path: 'members.member'
			})
			.exec();
		return successRes(res, location);
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.post('/:id', auth(), hasPermissions(['admin']), async (req, res) => {
	try {
		if (!ObjectId.isValid(req.params.id))
			return errorRes(res, 400, 'Invalid location ID');
		const { name, city } = req.body;
		if (!name) return errorRes(res, 400, 'Must provide a name');
		if (!city) return errorRes(res, 400, 'Must provide a city');
		const location = await Location.findById(req.params.id)
			.populate({
				path: 'members.member'
			})
			.exec();
		if (!location) return errorRes(res, 400, 'Location does not exist');
		location.name = name;
		location.city = city;
		await location.save();
		console.log(location);
		return successRes(res, location);
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});
