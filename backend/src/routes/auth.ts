import * as express from 'express';
import { ObjectId } from 'mongodb';
import { isEmail, normalizeEmail, isMobilePhone, isURL } from 'validator';
import * as jwt from 'jsonwebtoken';
import { Member } from '../models/member';
import { Permission } from '../models/permission';
import { auth } from '../middleware/passport';
import { successRes, errorRes, multer, uploadToStorage } from '../utils';

export const router = express.Router();

// router.post('/signup', multer.any(), async (req, res, next) => {
// 	try {
// 		let { name, email, graduationYear, password, passwordConfirm } = req.body;
// 		const maxYear = new Date().getFullYear() + 20;
// 		if (typeof graduationYear === 'string') graduationYear = validator.toInt(graduationYear, 10);
// 		if (!name) return errorRes(res, 400, 'Member must have a full name');
// 		if (!email) return errorRes(res, 400, 'Member must have an email');
// 		if (!validator.isEmail(email)) return errorRes(res, 400, 'Invalid email address');
// 		if (!graduationYear) return errorRes(res, 400, 'Member must have a graduation year');
// 		if (graduationYear < 1869 || graduationYear > maxYear)
// 			return errorRes(res, 400, `Graduation year must be a number between 1869 and ${maxYear}`);
// 		if (!password || password.length < 5)
// 			return errorRes(res, 400, 'Password must be more then 5 characters');
// 		if (!passwordConfirm) return errorRes(res, 400, 'Invalid password confirmation');
// 		if (passwordConfirm !== password) return errorRes(res, 400, 'Passwords did not match');

// 		let user = await Member.findOne({ email }).exec();
// 		if (user)
// 			return errorRes(
// 				res,
// 				400,
// 				'An account already exists with that email. Please use your Purdue Hackers account password if you have one'
// 			);

// 		user = new Member({
// 			name,
// 			email: validator.normalizeEmail(email),
// 			password,
// 			graduationYear
// 		});
// 		await user.save();
// 		const u = user.toJSON();
// 		delete u.password;
// 		const token = jwt.sign(u, CONFIG.SECRET);
// 		return successRes(res, {
// 			user: u,
// 			token
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		return errorRes(res, 500, error);
// 	}
// });

router.post('/signup', multer.any(), async (req, res, next) => {
	try {
		const files: Express.Multer.File[] = req.files
			? (req.files as Express.Multer.File[])
			: new Array<Express.Multer.File>();
		const {
			name,
			email,
			password,
			passwordConfirm,
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
		const maxYear = new Date().getFullYear() + 20;
		const graduationYear = parseInt(req.body.graduationYear, 10);
		if (!name) return errorRes(res, 400, 'Please provide your first and last name');
		if (!email) return errorRes(res, 400, 'Please provide your email');
		if (!isEmail(email)) return errorRes(res, 400, 'Invalid email');
		if (!graduationYear) return errorRes(res, 400, 'Please provide a valid graduation year');
		if (graduationYear < 1869 || graduationYear > maxYear)
			return errorRes(res, 400, `Graduation year must be a number between 1869 and ${maxYear}`);
		if (!password || password.length < 5)
			return errorRes(res, 400, 'A password longer than 5 characters is required');
		if (!passwordConfirm) return errorRes(res, 400, 'Please confirm your password');
		if (passwordConfirm !== password) return errorRes(res, 400, 'Passwords did not match');
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
		if (facebook && !/(facebook|fb)/.test(facebook))
			return errorRes(res, 400, 'Invalid Facebook URL');
		if (github && !/github/.test(github)) return errorRes(res, 400, 'Invalid GitHub URL');
		if (linkedin && !/linkedin/.test(linkedin)) return errorRes(res, 400, 'Invalid LinkedIn URL');
		if (devpost && !/devpost/.test(devpost)) return errorRes(res, 400, 'Invalid Devpost URL');
		if (website && !isURL(website)) return errorRes(res, 400, 'Invalid website URL');

		let user = await Member.findOne({ email }).exec();
		if (user)
			return errorRes(
				res,
				400,
				'An account already exists with that email. Please use your Purdue Hackers account password if you have one'
			);

		const picture = files.find(file => file.fieldname === 'picture');
		const resume = files.find(file => file.fieldname === 'resume');

		user = new Member({
			name,
			email: normalizeEmail(email),
			password,
			graduationYear
		});

		if (picture) user.picture = await uploadToStorage(picture, 'pictures', user);
		if (resume) user.resume = await uploadToStorage(resume, 'resumes', user);
		user.privateProfile = privateProfile;
		user.unsubscribed = unsubscribed;
		user.phone = phone;
		user.major = major;
		user.facebook = facebook;
		user.gender = gender;
		user.github = github;
		user.linkedin = linkedin;
		user.website = website;
		user.description = description;
		user.devpost = devpost;
		user.resumeLink = resumeLink;

		await user.save();
		const u = user.toJSON();
		delete u.password;
		const token = jwt.sign(u, CONFIG.SECRET);
		return successRes(res, {
			user: u,
			token
		});
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}

	try {

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

router.post('/login', async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const user = await Member.findOne({ email }, '+password')
			.populate({ path: 'permissions', model: Permission })
			.exec();
		if (!user) return errorRes(res, 401, 'Member not found.');

		// Check if password matches
		if (!user.comparePassword(password)) return errorRes(res, 401, 'Wrong password.');

		const u = user.toJSON();
		delete u.password;

		// If user is found and password is right create a token
		const token = jwt.sign(
			{
				_id: u._id,
				name: u.name,
				email: u.email,
				graduationYear: u.graduationYear
			},
			CONFIG.SECRET
		);

		return successRes(res, {
			user: u,
			token
		});
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.get('/me', auth(), async (req, res) => {
	try {
		const user = await Member.findById(req.user._id)
			.populate({ path: 'permissions', model: Permission })
			.exec();
		if (!user) return errorRes(res, 401, 'Member not found.');

		// If user is found and password is right create a token
		const token = jwt.sign(
			{
				_id: user._id,
				name: user.name,
				email: user.email,
				graduationYear: user.graduationYear
			},
			CONFIG.SECRET
		);

		return successRes(res, {
			user,
			token
		});
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});
