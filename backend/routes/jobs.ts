import * as express from 'express';
import { ObjectId } from 'mongodb';
import axios from 'axios';
import { ILocationModel, Location } from '../models/location';
import { Member } from '../models/member';
import { Job } from '../models/job';
import { auth, hasPermissions } from '../middleware/passport';
import { successRes, errorRes, memberMatches } from '../utils';
import { IPermissionModel, Permission } from '../models/permission';
export const router = express.Router();

// TODO: Deprecate jobs route and merge with locations

router.get('/', async (req, res, next) => {
	try {
		const jobs = await Job.find()
			.populate(['member', 'location'])
			.exec();
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
		if (isNaN(Date.parse(start)))
			return errorRes(res, 400, 'Invalid start date');
		if (end && isNaN(Date.parse(end)))
			return errorRes(res, 400, 'Invalid end date');
		if (!ObjectId.isValid(memberID))
			return errorRes(res, 400, 'Invalid member id');

		let [location, member] = await Promise.all([
			Location.findOne({ name, city }).exec(),
			Member.findById(memberID)
				.populate({
					path: 'permissions',
					model: Permission
				})
				.exec()
		]);
		if (!member) return errorRes(res, 400, 'Member does not exist');
		if (!memberMatches(member, req.user._id))
			return errorRes(res, 401, 'Unauthorized');

		if (!location) {
			location = new Location({
				name,
				city
			});
			const { data } = await axios.get(
				'https://maps.googleapis.com/maps/api/geocode/json',
				{
					params: {
						address: `${name}, ${city}`
					}
				}
			);
			if (data.results.length) {
				location.lat = data.results[0].geometry.location.lat;
				location.lng = data.results[0].geometry.location.lng;
			}
		}

		const contains = location.members.some(m =>
			member._id.equals(m.member._id)
		);
		if (!contains)
			location.members.push({
				member,
				dateStart: new Date(start),
				dateEnd: end ? new Date(end) : null
			});

		await location.save();
		const job = new Job({
			location,
			member,
			start: new Date(start),
			end: end ? new Date(end) : null
		});
		await Promise.all([job.save(), member.save()]);
		const ret = await job.populate('location').execPopulate();
		return successRes(res, job.toJSON());
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.get('/:id', async (req, res, next) => {
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
					model: Permission
				}
			})
			.exec();
		if (!job) return errorRes(res, 400, 'Job not found');

		if (!memberMatches(job.member, req.user._id))
			return errorRes(res, 401, 'Unauthorized');
		const jo = await job.remove();

		// Remove if there are no more jobs that reference location of job that was just deleted
		const jobs = await Job.find()
			.populate('location')
			.exec();
			
		const locations = jobs
			.filter(
				j =>
					j.location.name === job.location.name &&
					j.location.city === job.location.city
			)
			.map(j => j.location);

		// No other job is in the same location as the one just deleted, so delete the location
		if (!locations.length)
			await Location.findByIdAndRemove((job.location as any)._id).exec();

		return successRes(res, job);
	} catch (error) {
		console.error('Error:', error);
		return errorRes(res, 500, error);
	}
});
