import * as express from 'express';
import { ObjectId } from 'mongodb';
import { LocationModel as Location } from '../models/location';
import { MemberModel as Member } from '../models/member';
import { Job } from '../models/job';
import { auth, permissions } from '../middleware/passport';
import { successRes, errorRes, memberMatches } from '../utils';
import { Permission, PermissionModel } from '../models/permission';
export const router = express.Router();

router.get('/', auth(), async (req, res, next) => {
	try {
		const jobs = await Job.find().exec();
		return successRes(res, jobs);
	} catch (error) {
		console.error(error.message);
		return errorRes(res, 500, error.message);
	}
});

router.post('/', auth(), async (req, res, next) => {
	try {
		const { name, city, start, end, memberID } = req.body;
		if (!name) return errorRes(res, 400, 'Job must have a name');
		if (!city) return errorRes(res, 400, 'Job must have a city');
		if (!start) return errorRes(res, 400, 'Job must have a start date');
		if (isNaN(Date.parse(start))) return errorRes(res, 400, 'Invalid start date');
		if (end && isNaN(Date.parse(end))) return errorRes(res, 400, 'Invalid end date');
		if (!ObjectId.isValid(memberID)) return errorRes(res, 400, 'Invalid member id');

		let [location, member] = await Promise.all([
			Location.findOne({ name, city }).exec(),
			Member.findById(memberID)
				.populate({
					path: 'permissions',
					model: PermissionModel
				})
				.exec()
		]);
		if (!member) return errorRes(res, 400, 'Member does not exist');
		if (!memberMatches(member, req.params.id)) return errorRes(res, 401, 'Unauthorized');

		if (!location) {
			location = new Location({
				name,
				city
			});
			await location.save();
		}
		const job = new Job({
			location: location._id,
			member: member._id,
			start: new Date(start),
			end: end ? new Date(end) : null
		});
		member.locations.push(location._id);
		await Promise.all([job.save(), member.save()]);
		const ret = await job.populate('location').execPopulate();
		return successRes(res, job.toJSON());
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.get('/:id', auth(), async (req, res, next) => {
	try {
		const job = await Job.findById(req.params.id).exec();
		return successRes(res, job);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.delete('/:id', auth(), async (req, res, next) => {
	try {
		const job = await Job.findById(req.params.id)
			.populate('location')
			.populate({
				path: 'member',
				populate: {
					path: 'permissions',
					model: PermissionModel
				}
			})
			.exec();
		if (!job) return errorRes(res, 400, 'Job not found');
		if (!memberMatches(job.member, req.params.id)) return errorRes(res, 401, 'Unauthorized');
		const jo = await job.remove();

		// Remove if there are no more jobs that reference location of job that was just deleted
		const jobs = await Job.find()
			.populate('location')
			.exec();
		const locations = jobs
			.filter(
				j => j.location.name === job.location.name && j.location.city === job.location.city
			)
			.map(j => j.location);

		// No other job is in the same location as the one just deleted, so delete the location
		if (!locations.length) await Location.findByIdAndRemove((job.location as any)._id).exec();

		return successRes(res, job);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});