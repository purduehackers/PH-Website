import * as express from 'express';
import * as paginate from 'express-paginate';
import * as passport from 'passport';
import { ObjectId } from 'mongodb';
import { IEventModel, Event } from '../models/event';
import { auth } from '../middleware/passport';
import { successRes, errorRes } from '../utils';
export const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		let { order, sortBy } = req.query;
		// tslint:disable-next-line:triple-equals
		order = order == '1' ? 1 : -1;
		if (!Event.schema.path(sortBy)) sortBy = 'event_time';
		let contains = false;
		const exists = Event.schema.path(sortBy);
		console.log('Path:', sortBy, 'exists:', exists);
		Event.schema.eachPath(path => {
			if (path.toLowerCase() === sortBy.toLowerCase()) contains = true;
		});
		if (!contains) sortBy = 'event_time';

		const results = await Event.find({ privateProfile: { $ne: 1 } })
			.sort({ [sortBy]: order })
			// .limit(50)
			.lean()
			.exec();

		return successRes(res, {
			events: results
		});
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		if (!ObjectId.isValid(req.params.id)) return errorRes(res, 400, 'Invalid event ID');
		const user = await Event.findById(req.params.id)
			.populate('members')
			.exec();
		return successRes(res, user);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});
