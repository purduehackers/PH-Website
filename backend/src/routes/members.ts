import * as express from 'express';
// import * as paginate from 'express-paginate';
import { ObjectId } from 'mongodb';
import { isEmail, isMobilePhone, isURL } from 'validator';
import { compareSync } from 'bcrypt';
import { Member } from '../models/member';
import { Event, IEventModel } from '../models/event';
import { Location } from '../models/location';
import { Permission } from '../models/permission';
import { Job } from '../models/job';
import { auth, hasPermissions } from '../middleware/passport';
import {
	successRes,
	errorRes,
	memberMatches,
	uploadToStorage,
	multer,
	addMemberToPermissions
} from '../utils';

export const router = express.Router();

// TODO: Add auth to routes
// TODO: Add permissions to routes

// router.get('/', async (req, res, next) => {
// 	try {
// 		const { limit } = req.query;
// 		// tslint:disable-next-line
// 		const skip = req.skip;
// 		// tslint:disable-next-line:triple-equals
// 		const order = req.query.order == '-1' ? -1 : 1;
// 		let sortBy = req.query.sortBy || 'name';
// 		let contains = false;
// 		Member.schema.eachPath(path => {
// 			if (path.toLowerCase() === sortBy.toLowerCase()) contains = true;
// 		});
// 		if (!contains) sortBy = 'name';

// 		const [results, itemCount] = await Promise.all([
// 			Member.find()
// 				.limit(limit)
// 				.skip(skip)
// 				.sort({ [sortBy]: order })
// 				.populate({
// 					path: 'permissions',
// 					model: Permission
// 				})
// 				.lean()
// 				.exec(),
// 			Member.count({})
// 		]);

// 		const pageCount = Math.ceil(itemCount / req.query.limit);

// 		return successRes(res, {
// 			has_more: paginate.hasNextPages(req)(pageCount),
// 			members: results,
// 			pages: paginate.getArrayPages(req)(5, pageCount, req.query.page)
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		return errorRes(res, 500, error);
// 	}
// });

router.get('/', async (req, res) => {
	try {
		// tslint:disable-next-line:triple-equals
		const order = req.query.order == '1' ? 1 : -1;
		let sortBy = req.query.sortBy || 'createdAt';
		let contains = false;
		Member.schema.eachPath(path => {
			if (path.toLowerCase() === sortBy.toLowerCase()) contains = true;
		});
		if (!contains) sortBy = 'createdAt';

		const results = await Member.find(
			{
				privateProfile: { $ne: 1 },
				graduationYear: { $gt: 0 }
			},
			'_id name graduationYear createdAt'
		)

			.populate({
				path: 'permissions',
				model: Permission
			})
			.sort({ [sortBy]: order })
			// .limit(100)
			.lean()
			.exec();

		return successRes(res, { members: results });
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.get('/:id', async (req, res) => {
	try {
		if (!ObjectId.isValid(req.params.id))
			return errorRes(res, 400, 'Invalid member ID');
		const member = await Member.findById(req.params.id)
			.populate({
				path: 'permissions',
				model: Permission
			})
			.lean()
			.exec();
		if (!member) return errorRes(res, 400, 'Member does not exist');
		return successRes(res, member);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.put('/:id', auth(), multer.any(), async (req, res) => {
	try {
		if (!ObjectId.isValid(req.params.id))
			return errorRes(res, 400, 'Invalid member ID');
		if (!memberMatches(req.user, req.params.id))
			return errorRes(
				res,
				401,
				'You are unauthorized to edit this profile'
			);

		const files: Express.Multer.File[] = req.files
			? (req.files as Express.Multer.File[])
			: new Array<Express.Multer.File>();
		const {
			name,
			email,
			password,
			passwordConfirm,
			graduationYear,
			privateProfile,
			unsubscribed,
			phone,
			major,
			facebook,
			gender,
			github,
			linkedin,
			website,
			description,
			devpost,
			resumeLink
		} = req.body;
		if (!name)
			return errorRes(
				res,
				400,
				'Please provide your first and last name'
			);
		if (!email) return errorRes(res, 400, 'Please provide your email');
		if (!isEmail(email)) return errorRes(res, 400, 'Invalid email');
		if (!password) return errorRes(res, 400, 'A password is required');
		if (!passwordConfirm)
			return errorRes(res, 400, 'Please confirm your password');
		if (!graduationYear || !parseInt(graduationYear, 10))
			return errorRes(res, 400, 'Please provide a valid graduation year');
		if (
			gender &&
			gender !== 'Male' &&
			gender !== 'Female' &&
			gender !== 'Other' &&
			gender !== 'No'
		)
			return errorRes(res, 400, 'Please provide a valid gender');
		if (
			major &&
			major !== 'Computer Science' &&
			major !== 'Computer Graphics Technology' &&
			major !== 'Computer Information Technology' &&
			major !== 'Electrical Computer Engineering' &&
			major !== 'Electrical Engineering' &&
			major !== 'First Year Engineering' &&
			major !== 'Math' &&
			major !== 'Mechanical Engineering' &&
			major !== 'Other'
		)
			return errorRes(res, 400, 'Please provide a valid major');
		if (phone && !isMobilePhone(phone, ['en-US'] as any))
			return errorRes(res, 400, 'Invalid phone number: ' + phone);
		if (password !== passwordConfirm)
			return errorRes(res, 400, 'Passwords does not match');
		if (facebook && !/(facebook|fb)/.test(facebook))
			return errorRes(res, 400, 'Invalid Facebook URL');
		if (github && !/github/.test(github))
			return errorRes(res, 400, 'Invalid GitHub URL');
		if (linkedin && !/linkedin/.test(linkedin))
			return errorRes(res, 400, 'Invalid LinkedIn URL');
		if (devpost && !/devpost/.test(devpost))
			return errorRes(res, 400, 'Invalid Devpost URL');
		if (website && !isURL(website))
			return errorRes(res, 400, 'Invalid website URL');
		const member = await Member.findById(req.params.id, '+password').exec();
		if (!member) return errorRes(res, 400, 'Member not found');
		if (!compareSync(password, member.password))
			return errorRes(res, 401, 'Incorrect password');

		const picture = files.find(file => file.fieldname === 'picture');
		const resume = files.find(file => file.fieldname === 'resume');
		if (picture)
			member.picture = await uploadToStorage(picture, 'pictures', member);
		if (resume)
			member.resume = await uploadToStorage(resume, 'resumes', member);
		member.name = name;
		member.email = email;
		member.password = password;
		member.graduationYear = parseInt(graduationYear, 10);
		member.privateProfile = privateProfile;
		member.unsubscribed = unsubscribed;
		member.phone = phone;
		member.major = major;
		member.facebook = facebook;
		member.gender = gender;
		member.github = github;
		member.linkedin = linkedin;
		member.website = website;
		member.description = description;
		member.devpost = devpost;
		member.resumeLink = resumeLink;

		await member.save();
		const m = member.toJSON();
		delete m.password;
		return successRes(res, m);
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error.message);
	}
});

router.post(
	'/organizer',
	auth(),
	hasPermissions(['permissions']),
	async (req, res) => {
		try {
			const { email } = req.body;
			if (!email)
				return errorRes(res, 400, 'Please enter member name or email');
			const permissions = await Permission.find()
				.where('organizer')
				.ne(0)
				.exec();

			const member = await Member.findOne({
				$or: [{ name: email }, { email }]
			}).exec();

			if (!member) return errorRes(res, 400, 'Member not found');

			const [m, p] = await addMemberToPermissions(
				member,
				permissions,
				req.user
			);

			return successRes(res, { member: m, permissions: p });
		} catch (error) {
			console.error(error);
			return errorRes(res, 500, error);
		}
	}
);

router.delete('/:id', auth(), hasPermissions(['admin']), async (req, res) => {
	try {
		if (!ObjectId.isValid(req.params.id))
			return errorRes(res, 400, 'Invalid member ID');

		const [member, jobs] = await Promise.all([
			Member.findById(req.params.id, '_id')
				.populate([
					{
						path: 'permissions',
						model: 'Permission',
						select: 'members.member'
					},
					{
						path: 'events',
						model: 'Event',
						select: '_id'
					},
					{
						path: 'locations.location',
						model: 'Location',
						select: '_id',
						populate: {
							path: 'members.member',
							model: 'Member',
							select: '_id'
						}
					}
				])
				.exec(),
			Job.find()
				.populate([
					{ path: 'member', select: '_id' },
					{ path: 'location', select: '_id' }
				])
				.exec()
		]);

		if (!member) return errorRes(res, 400, 'Member does not exist');

		for (const event of member.events) {
			await Promise.all([
				event.update({ $pull: { members: member._id } }),
				member.update({ $pull: { events: event._id } })
			]);
		}

		for (const permission of member.permissions) {
			permission.members = permission.members.filter(
				permissionMember => !member._id.equals(permissionMember.member)
			);
			await permission.save();
		}

		for (const { location } of member.locations) {
			location.members = location.members.filter(
				locationMember => !locationMember.member._id.equals(member._id)
			);
			location.members.length
				? await location.save()
				: await location.remove();
		}

		await Promise.all(
			jobs
				.filter(job => job.member._id.equals(member._id))
				.map(job => job.remove())
		);

		await member.remove();

		return successRes(res, member);
	} catch (error) {
		console.error('Error:', error);
		return errorRes(res, 500, error);
	}
});

router.get('/:id/events', async (req, res) => {
	try {
		if (!ObjectId.isValid(req.params.id))
			return errorRes(res, 400, 'Invalid member ID');
		const member = await Member.findById(req.params.id)
			.populate({
				path: 'events',
				model: Event
			})
			.lean()
			.exec();
		if (!member) return successRes(res, []);
		const { events } = member;
		const publicEvents = events
			? events.filter((event: IEventModel) => !event.privateEvent)
			: [];
		return successRes(res, publicEvents);
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.get('/:id/locations', async (req, res) => {
	try {
		if (!ObjectId.isValid(req.params.id))
			return errorRes(res, 400, 'Invalid member ID');
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
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.get('/:id/jobs', async (req, res) => {
	try {
		const jobs = await Job.find({ member: req.params.id })
			.populate('location')
			.exec();
		return successRes(res, jobs);
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});
