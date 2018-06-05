import * as express from 'express';
// import * as paginate from 'express-paginate';
import * as passport from 'passport';
import { ObjectId } from 'mongodb';
import { IEventModel, Event } from '../models/event';
import { Member } from '../models/member';
import { auth } from '../middleware/passport';
import { successRes, errorRes } from '../utils';
export const router = express.Router();

// TODO: Add auth to routes
// TODO: Add permissions to routes

router.get('/', async (req, res, next) => {
	try {
		let { order, sortBy } = req.query;
		// tslint:disable-next-line:triple-equals
		order = order == '1' ? 1 : -1;
		if (!Event.schema.path(sortBy)) sortBy = 'eventTime';
		let contains = false;
		const exists = Event.schema.path(sortBy);
		Event.schema.eachPath(path => {
			if (path.toLowerCase() === sortBy.toLowerCase()) contains = true;
		});
		if (!contains) sortBy = 'eventTime';

		const results = await Event.find({ privateProfile: { $ne: 1 } })
			.sort({ [sortBy]: order })
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

router.post('/', async (req, res, next) => {
	try {
		const { name, privateEvent, eventTime, location, facebook } = req.body;
		if (!name) return errorRes(res, 400, 'Event must have a name');
		if (!eventTime) return errorRes(res, 400, 'Event must have a time');
		if (!location) return errorRes(res, 400, 'Event must have a name');
		const time = Date.parse(eventTime);
		if (isNaN(time)) return errorRes(res, 400, 'Invalid event time');
		if (facebook && !facebook.match('((http|https)://)?(www[.])?facebook.com.*'))
			return errorRes(res, 400, 'Must specify a url from Facebook');

		const event = new Event({
			name,
			privateEvent: !!privateEvent,
			eventTime: time,
			location,
			facebook
		});

		await event.save();
		return successRes(res, event.toJSON());
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		if (!ObjectId.isValid(req.params.id)) return errorRes(res, 400, 'Invalid event ID');
		const user = await Event.findById(req.params.id)
			.populate({
				path: 'members',
				model: Member
			})
			.exec();
		return successRes(res, user);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.post('/:id', async (req, res, next) => {
	try {
		const { name, privateEvent, eventTime, location, facebook } = req.body;
		const eventBuilder = {};
		if (!name) return errorRes(res, 400, 'Event must have a name');
		else Object.assign(eventBuilder, { name });
		if (!eventTime) return errorRes(res, 400, 'Event must have a time');
		if (!location) return errorRes(res, 400, 'Event must have a name');
		else Object.assign(eventBuilder, { location });
		const time = Date.parse(eventTime);
		if (isNaN(time)) return errorRes(res, 400, 'Invalid event time');
		else Object.assign(eventBuilder, { eventTime: time });
		if (facebook) {
			if (!facebook.match('((http|https)://)?(www[.])?facebook.com.*'))
				return errorRes(res, 400, 'Must specify a url from Facebook');
			else Object.assign(eventBuilder, { facebook });
		}

		const event = await Event.findById(req.params.id)
			.populate({
				path: 'members',
				model: Member
			})
			.exec();
		if (!event) return errorRes(res, 400, 'Event does not exist');

		await event.update(eventBuilder).exec();
		return successRes(res, event.toJSON());
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.delete('/:id', async (req, res, next) => {
	try {
		const event = await Event.findById(req.params.id).exec();
		if (!event) return errorRes(res, 400, 'Event does not exist');
		await event.remove();
		return successRes(res, event.toJSON());
	} catch (error) {
		return errorRes(res, 500, error);
	}
});
