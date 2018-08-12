import * as express from 'express';
import { Member } from '../models/member';
import { Location } from '../models/location';
import { successRes, errorRes, escapeRegEx } from '../utils';
export const router = express.Router();

router.get('/members', async (req, res) => {
	try {
		const { term, field } = req.query;
		if (!term) return errorRes(res, 400, 'Must have a search term');
		if (!field) return errorRes(res, 400, 'Must have a search field');
		let contains = false;
		Member.schema.eachPath(path => {
			if (path === field) contains = true;
		});
		if (!contains) return errorRes(res, 400, 'Invalid member field');
		const regex = new RegExp(escapeRegEx(term), 'i');
		const members = await Member.find({
			[field]: { $regex: regex, $options: 'i' }
		})
			.sort('-1')
			.limit(5)
			.exec();
		return successRes(res, members);
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.get('/locations', async (req, res) => {
	try {
		const { term, field } = req.query;
		if (!term) return errorRes(res, 400, 'Must have a search term');
		if (!field) return errorRes(res, 400, 'Must have a search field');
		if (field !== 'name' && field !== 'city')
			return errorRes(res, 400, 'Location fields can only be either "name" or "city"');
		const regex = new RegExp(escapeRegEx(term));
		const locations = await Location.find({
			[field]: { $regex: regex, $options: 'i' }
		})
			.sort('-1')
			.limit(5)
			.exec();
		return successRes(res, locations);
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});
