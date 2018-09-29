import * as express from 'express';
// import * as paginate from 'express-paginate';
import { isEmail } from 'validator';
import { ObjectId } from 'mongodb';
import { Event } from '../models/event';
import { Member, IMemberModel } from '../models/member';
import { auth, hasPermissions } from '../middleware/passport';
import {
	successRes,
	errorRes,
	sendAccountCreatedEmail,
	hasPermission
} from '../utils';
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

		const conditions = hasPermission(req.user, 'events')
			? {}
			: { privateEvent: { $ne: true } };

		const results = await Event.find(
			conditions,
			'_id name createdAt eventTime location members'
		)
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

router.post('/', auth(), hasPermissions(['events']), async (req, res) => {
	try {
		const { name, privateEvent, eventTime, location, facebook } = req.body;
		if (!name) return errorRes(res, 400, 'Event must have a name');
		if (!eventTime) return errorRes(res, 400, 'Event must have a time');
		if (!location) return errorRes(res, 400, 'Event must have a name');
		const time = Date.parse(eventTime);
		if (isNaN(time)) return errorRes(res, 400, 'Invalid event time');
		if (
			facebook &&
			!facebook.match('((http|https)://)?(www[.])?facebook.com.*')
		)
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

router.get('/:id', async (req, res) => {
	try {
		if (!ObjectId.isValid(req.params.id))
			return errorRes(res, 400, 'Invalid event ID');
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

// TODO: Change to put request
router.post('/:id', async (req, res, next) => {
	try {
		if (!ObjectId.isValid(req.params.id))
			return errorRes(res, 400, 'Invalid event ID');
		const { name, privateEvent, eventTime, location, facebook } = req.body;
		const eventBuilder = { privateEvent };
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
		if (!ObjectId.isValid(req.params.id))
			return errorRes(res, 400, 'Invalid event ID');
		const event = await Event.findById(req.params.id).exec();
		if (!event) return errorRes(res, 400, 'Event does not exist');
		await event.remove();
		return successRes(res, event.toJSON());
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.post('/:id/checkin', async (req, res, next) => {
	try {
		const { name, email, memberID } = req.body;
		if (!ObjectId.isValid(req.params.id))
			return errorRes(res, 400, 'Invalid event ID');
		const event = await Event.findById(req.params.id)
			.populate({
				path: 'members',
				model: Member
			})
			.exec();
		if (!event) return errorRes(res, 400, 'Event does not exist');
		let member: IMemberModel = null;

		// Search by memberID
		if (memberID) {
			const m = await Member.findById(memberID).exec();
			if (m && m.email === email) member = m;
		}

		// No ID, so search by name and email
		if (!member) {
			if (!name) return errorRes(res, 400, 'Invalid name');
			if (!isEmail(email)) return errorRes(res, 400, 'Invalid email');
			const m = await Member.findOne({
				name,
				email
			}).exec();
			member = m;
		}

		// New Member
		if (!member) {
			if (await Member.findOne({ email }).exec())
				return errorRes(
					res,
					400,
					'A member with a different name is associated with this email'
				);
			member = new Member({
				name,
				email
			});

			await member.save();
			// TODO: Send welcome email when member is created
			await sendAccountCreatedEmail(member, event, req);
		}
		// Existing Member, If account not setup, send creation email
		else {
			if (member.graduationYear === 0) {
				await sendAccountCreatedEmail(member, event, req);
				// TODO: Send welcome email when member is created
				// Mail::send('emails.accountCreated', ['member'=>$member, 'event'=>$event], function ($message) use ($member) {
				// 	$message->from('purduehackers@gmail.com', 'Purdue Hackers');
				// 	$message->to($member->email);
				// 	$message->subject('Welcome '.$member->name.' to Purdue Hackers!');
				// });
				// sendAccountCreatedEmail(member, event.name, event.eventTime)
				// $this->emailAccountCreated($member, $event);
			}
		}

		// Check if Repeat
		if (event.members.some(m => m._id.equals(member._id)))
			return errorRes(res, 400, 'Member already checked in');

		event.members.push(member);
		member.events.push(event);
		await Promise.all([event.save(), member.save()]);

		return successRes(res, event);
	} catch (error) {
		console.error('Error:', error);
		return errorRes(res, 500, error);
	}
});

// TODO: Checkout member based on their name and email
router.delete('/:id/checkin/:memberID', async (req, res, next) => {
	try {
		const { id, memberID } = req.params;
		if (!ObjectId.isValid(id))
			return errorRes(res, 400, 'Invalid event ID');
		if (!ObjectId.isValid(memberID))
			return errorRes(res, 400, 'Invalid member ID');
		const [event, member] = await Promise.all([
			Event.findById(id).exec(),
			Member.findById(memberID).exec()
		]);
		if (!event) return errorRes(res, 400, 'Event does not exist');
		if (!member) return errorRes(res, 400, 'Member does not exist');

		// Check if not already checked in
		if (!event.members.some(m => m._id.equals(member._id)))
			return errorRes(res, 400, 'Member is not checked in to this event');

		// Remove member and event fom each other
		event.members = event.members.filter(m => !m._id.equals(member._id));
		member.events = member.events.filter(e => !e._id.equals(event._id));
		await Promise.all([event.save(), member.save()]);

		return successRes(res, event);
	} catch (error) {
		console.error('Error:', error);
		return errorRes(res, 500, error);
	}
});
