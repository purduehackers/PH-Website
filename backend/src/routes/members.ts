import * as express from 'express';
// import * as paginate from 'express-paginate';
import { ObjectId } from 'mongodb';
import * as Multer from 'multer';
import { isEmail, normalizeEmail, isMobilePhone, isURL } from 'validator';
import { compareSync } from 'bcrypt';
import { Member } from '../models/member';
import { IEventModel, Event } from '../models/event';
import { Location } from '../models/location';
import { Permission } from '../models/permission';
import { Job } from '../models/job';
import { auth } from '../middleware/passport';
import { successRes, errorRes, memberMatches, uploadToStorage, multer } from '../utils';

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

router.get('/', async (req, res, next) => {
	try {
		// tslint:disable-next-line:triple-equals
		const order = req.query.order == '1' ? 1 : -1;
		let sortBy = req.query.sortBy || 'createdAt';
		let contains = false;
		Member.schema.eachPath(path => {
			if (path.toLowerCase() === sortBy.toLowerCase()) contains = true;
		});
		if (!contains) sortBy = 'createdAt';

		const results = await Member.find({
			privateProfile: { $ne: 1 },
			graduationYear: { $gt: 0 }
		})

			.populate({
				path: 'permissions',
				model: Permission
			})
			.sort({ [sortBy]: order })
			.limit(100)
			.lean()
			.exec();

		return successRes(res, { members: results });
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		if (!ObjectId.isValid(req.params.id)) return errorRes(res, 400, 'Invalid member ID');
		const user = await Member.findById(new ObjectId(req.params.id))
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

router.put('/:id', auth(), multer.any(), async (req, res, next) => {
	try {
		if (!ObjectId.isValid(req.params.id)) return errorRes(res, 400, 'Invalid member ID');
		if (!memberMatches(req.user as any, req.params.id))
			return errorRes(res, 401, 'You are unauthorized to edit this profile');
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
		if (!name) return errorRes(res, 400, 'Please provide your first and last name');
		if (!email) return errorRes(res, 400, 'Please provide your email');
		if (!isEmail(email)) return errorRes(res, 400, 'Invalid email');
		if (!password) return errorRes(res, 400, 'A password is required');
		if (!passwordConfirm) return errorRes(res, 400, 'Please confirm your password');
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
		if (password !== passwordConfirm) return errorRes(res, 400, 'Passwords does not match');
		if (facebook && !/(facebook|fb)/.test(facebook))
			return errorRes(res, 400, 'Invalid Facebook URL');
		if (github && !/github/.test(github)) return errorRes(res, 400, 'Invalid GitHub URL');
		if (linkedin && !/linkedin/.test(linkedin)) return errorRes(res, 400, 'Invalid LinkedIn URL');
		if (devpost && !/devpost/.test(devpost)) return errorRes(res, 400, 'Invalid Devpost URL');
		if (website && !isURL(website)) return errorRes(res, 400, 'Invalid website URL');
		const member = await Member.findById(req.params.id, '+password').exec();
		if (!member) return errorRes(res, 400, 'Member not found');
		if (!compareSync(password, member.password)) return errorRes(res, 401, 'Incorrect password');

		const picture = files.find(file => file.fieldname === 'picture');
		const resume = files.find(file => file.fieldname === 'resume');
		if (picture) member.picture = await uploadToStorage(picture, 'pictures', member);
		if (resume) member.resume = await uploadToStorage(resume, 'resumes', member);
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
		// console.log('GFS:', gfs);
		return successRes(res, m);
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error.message);
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
		const publicEvents = events ? events.filter((event: IEventModel) => !event.privateEvent) : [];
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

router.get('/:id/jobs', async (req, res, next) => {
	try {
		const jobs = await Job.find({ member: req.params.id })
			.populate('location')
			.exec();
		return successRes(res, jobs);
	} catch (error) {
		console.log(error);
		return errorRes(res, 500, error);
	}
});
