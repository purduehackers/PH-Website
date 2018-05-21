import * as express from 'express';
import * as paginate from 'express-paginate';
import * as passport from 'passport';
import { ObjectId } from 'mongodb';
import { EventModel as Event } from '../models/event';
import { auth } from '../middleware/passport';
import { successRes, errorRes } from '../utils';
export const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		// tslint:disable-next-line:triple-equals
		const order = req.query.order == '1' ? 1 : -1;
		let sortBy = req.query.sortBy || 'event_time';
		let contains = false;
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
