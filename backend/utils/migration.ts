import * as mongoose from 'mongoose';
import * as GoogleCloudStorage from '@google-cloud/storage';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname } from 'path';
import CONFIG from '../config';
import { Member, IMemberModel } from '../models/member';
import { homedir } from 'os';

const { NODE_ENV, DB, MONGO_USER, MONGO_PASSWORD } = CONFIG;

const storage = GoogleCloudStorage({
	projectId: 'purduehackers-212319',
	keyFilename: '../../purduehackers.json'
});

export const bucket = storage.bucket('purduehackers');

// (async () => {
// 	if (NODE_ENV !== 'production') await mongoose.connect(DB);
// 	else await mongoose.connect(DB, { user: MONGO_USER, pass: MONGO_PASSWORD });

// 	const locations = await Location.find()
// 		.populate('members')
// 		.exec();

// 	const members = await Member.find().exec();
// 	// for (const member of members) {
// 	// 	member.locations = [] as any;
// 	// 	await member.save();
// 	// }
// 	for (const location of locations) {
// 		for (const locationMember of location.members) {
// 			const re = await Member.findByIdAndUpdate(
// 				locationMember.member._id,
// 				{
// 					$push: {
// 						locations: {
// 							location,
// 							dateStart: locationMember.dateStart,
// 							dateEnd: locationMember.dateEnd
// 						}
// 					}
// 				}
// 			);
// 			console.log(re);
// 		}
// 	}

// const members = await Member.find().exec();
// for (const member of members) {
// 	if (!member.locations.length) continue;
// 	for (const memberLocation of member.locations) {
// 		const location = await Location.findById(
// 			memberLocation.location._id
// 		)
// 			.populate('members.member')
// 			.exec();
// 		const contains = location.members.some(
// 			pair =>
// 				member._id.equals(pair.member._id) &&
// 				memberLocation.dateStart.getTime() ===
// 					pair.dateStart.getTime()
// 		);

// 		if (!contains) {
// 			const end = Date.parse(memberLocation.dateEnd.toString());
// 			location.members.push({
// 				member,
// 				dateStart: memberLocation.dateStart,
// 				dateEnd: isNaN(end) ? null : memberLocation.dateEnd
// 			});
// 			await location.save();
// 		}
// 	}

// member.locations = [] as any;
// await member.save();
// }

// const member = await Member.findOne().exec();
// console.log(member.locations);

// })();

// (async () => {
// 	await mongoose.connect(DB);
// 	// const events = await Event.find({ privateEvent: { $ne: false } })
// 	// 	.sort({ eventTime: 1 })
// 	// 	.lean()
// 	// 	.exec();

// 	const events = await Event.find().exec();
// 	for (const event of events) {
// 		// if (event.privateEvent) event.privateEvent = true;
// 		// else event.privateEvent = false;
// 		// await event.save();
// 		console.log(event.name, 'is private:', Boolean(event.privateEvent));
// 		const re = await Event.findByIdAndUpdate(event._id, {
// 			$set: { privateEvent: Boolean(event.privateEvent) }
// 		}).exec();
// 		console.log(re);
// 	}

// 	// console.log(events.filter(event => event.privateEvent));
// 	// console.log(events);
// 	await mongoose.disconnect();
// })();

export const uploadToStorage = async (
	file,
	folder: string,
	user: IMemberModel
) => {
	if (!file) return 'No image file';
	else if (
		folder === 'pictures' &&
		!/\.(jpg|jpeg|png|gif)$/i.test(file.originalname)
	)
		return `File: ${file.originalname} is an invalid image type`;
	else if (folder === 'resumes' && !/\.pdf$/i.test(file.originalname))
		return `File: ${file.originalname} is an invalid resume type`;

	const fileName = `${folder}/${user.email.replace('@', '_')}`;
	const fileUpload = bucket.file(fileName);

	return new Promise<string>((resolve, reject) => {
		const blobStream = fileUpload.createWriteStream({
			metadata: {
				contentType: file.mimetype,
				cacheControl: 'no-cache, max-age=0'
			}
		});

		blobStream.on('error', error => {
			console.error(error);
			reject('Something is wrong! Unable to upload at the moment.');
		});

		blobStream.on('finish', () => {
			// The public URL can be used to directly access the file via HTTP.
			resolve(`https://storage.googleapis.com/purduehackers/${fileName}`);
		});

		blobStream.end(file.buffer);
	});
};

(async () => {
	await mongoose.connect(DB, { useNewUrlParser: true });
	console.log('Connected to mongo:', DB);
	const picturesPath = join(homedir(), 'uploads', 'pictures');
	const resumePath = join(homedir(), 'uploads', 'resumes');
	const folderPath = picturesPath;
	const files = readdirSync(folderPath);
	for (let i = 0; i < files.length; i++) {
		const fileName = files[i];
		const filePath = join(folderPath, fileName);
		const file = readFileSync(filePath);
		const id = parseInt(fileName.split('_')[0]);
		const member = await Member.findOne({ id }).exec();
		if (!member) {
			console.error('No member for:', id, '\tFilename:', fileName);
			continue;
		}
		console.log(member.name);
		console.log(fileName);
		const uploaded = await uploadToStorage(
			{
				// mimetype: 'application/pdf',
				mimetype: `image/${extname(fileName)}`.toLowerCase(),
				originalname: fileName,
				buffer: file
			},
			'pictures',
			member
		);
		console.log('Uploaded:', uploaded);
		member.picture = uploaded;
		await member.save();
		console.log(
			'New Picture:',
			(await Member.findOne({ id }).exec()).picture
		);
		// console.log('Result:', result);
	}
	// const test = await Member.findOne({ name: /Test/ }).exec();
	// console.log('Resume:', test.resume);
	// console.log('Picture:', test.picture);
	await mongoose.disconnect();
})();

// (async () => {
// 	await mongoose.connect(DB, { useNewUrlParser: true });
// 	console.log('Connected to mongo:', DB);
// 	const resumePath = '/Users/ashwin/uploads/resumes';
// 	const fileName = '138_5824ad.pdf';
// 	const member = await Member.findOne({ name: /Nath/ }).exec();
// 	console.log(member.name);
// 	console.log(fileName);
// 	const uploaded = await uploadToStorage(
// 		{
// 			mimetype: 'application/pdf',
// 			// mimetype: 'image/jpg',
// 			originalname: fileName,
// 			buffer: readFileSync(join(resumePath, fileName))
// 		},
// 		'resumes',
// 		member
// 	);
// 	console.log('Uploaded:', uploaded);
// 	member.resume = uploaded;
// 	await member.save();
// 	console.log(
// 		'New Resume:',
// 		(await Member.findOne({ name: /Nath/ }).exec()).resume
// 	);
// 	await mongoose.disconnect();
// })();
