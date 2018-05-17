import * as express from 'express';
import * as paginate from 'express-paginate';
import * as passport from 'passport';
import { ObjectId } from 'mongodb';
import { MemberModel as Member } from '../models/member';
import { EventModel as Event } from '../models/event';
import { LocationModel as Location } from '../models/location';
import { PermissionModel as Permission } from '../models/permission';
import { auth } from '../middleware/passport';
import { successRes, errorRes } from '../utils';
export const router = express.Router();

/* GET members list */
router.get('/', async (req, res, next) => {
	try {
		const { limit } = req.query;
		// tslint:disable-next-line
		const skip = req.skip;
		// tslint:disable-next-line:triple-equals
		const order = req.query.order == '-1' ? -1 : 1;
		let sortBy = req.query.sortBy || 'name';
		let contains = false;
		Member.schema.eachPath(path => {
			if (path.toLowerCase() === sortBy.toLowerCase()) contains = true;
		});
		if (!contains) sortBy = 'name';

		const [results, itemCount] = await Promise.all([
			Member.find()
				.limit(limit)
				.skip(skip)
				.sort({ [sortBy]: order })
				.populate({
					path: 'permissions',
					model: Permission
				})
				.lean()
				.exec(),
			Member.count({})
		]);

		const pageCount = Math.ceil(itemCount / req.query.limit);

		return successRes(res, {
			has_more: paginate.hasNextPages(req)(pageCount),
			members: results,
			pages: paginate.getArrayPages(req)(5, pageCount, req.query.page)
		});
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		if (!ObjectId.isValid(req.params.id)) return errorRes(res, 400, 'Invalid member ID');
		const user = await Member.findById(req.params.id)
			.populate({
				path: 'permissions',
				model: Permission
			})
			.lean()
			.exec();
		return successRes(res, user);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.get('/:id/events', async (req, res, next) => {
	try {
		if (!ObjectId.isValid(req.params.id)) return errorRes(res, 400, 'Invalid member ID');
		const member = await Member.findById(req.params.id)
			.populate({
				path: 'events',
				model: Event
			})
			.lean()
			.exec();
		if (!member) return successRes(res, []);
		const { events } = member;
		const publicEvents = events ? events.filter(event => !event.privateEvent) : [];
		return successRes(res, publicEvents);
	} catch (error) {
		console.log(error);
		return errorRes(res, 500, error);
	}
});

router.get('/:id/locations', async (req, res, next) => {
	try {
		if (!ObjectId.isValid(req.params.id)) return errorRes(res, 400, 'Invalid member ID');
		const member = await Member.findById(req.params.id)
			.populate({
				path: 'locations.location',
				model: Location
			})
			.lean()
			.exec();
		if (!member) return successRes(res, []);
		const { locations } = member;
		return successRes(res, locations || []);
	} catch (error) {
		console.log(error);
		return errorRes(res, 500, error);
	}
});
