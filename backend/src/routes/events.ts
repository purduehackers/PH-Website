import * as express from 'express';
import * as paginate from 'express-paginate';
import * as passport from 'passport';
import { EventModel as Event } from '../models/event';
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
		Event.schema.eachPath(path => {
			if (path.toLowerCase() === sortBy.toLowerCase()) contains = true;
		});
		if (!contains) sortBy = 'name';

		const [results, itemCount] = await Promise.all([
			Event.find()
				.limit(limit)
				.skip(skip)
				.sort({ [sortBy]: order })
				.lean()
				.exec(),
			Event.count({})
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
		const user = await Event.findById(req.params.id).exec();
		return successRes(res, user);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});
