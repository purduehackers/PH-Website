import * as mongoose from 'mongoose';
import CONFIG from '../config';
import { Location } from '../models/location';
import { Member } from '../models/member';

const { NODE_ENV, DB, MONGO_USER, MONGO_PASSWORD } = CONFIG;

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

(async () => {
	if (NODE_ENV !== 'production') await mongoose.connect(DB);
	else await mongoose.connect(DB, { user: MONGO_USER, pass: MONGO_PASSWORD });

	const member = await Member.findOne({ name: /Jeff/ }).exec();
	const location = await Location.findOne({ name: /Obj/ }).exec();
	console.log(member);
	console.log(location);
	member.update({
		$push: {
			locations: {

			}
		}
	})
	await mongoose.disconnect();
})();
