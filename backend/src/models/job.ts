import { Document, Schema, model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LocationModel, Location } from './location';
import { MemberModel, Member } from './member';

export interface IJobModel extends Document {
	location: Location;
	member: Member;
	start: Date;
	end: Date;
}

const schema = new Schema({
	location: {
		type: Schema.Types.ObjectId,
		ref: 'Location',
		required: true
	},
	member: {
		type: Schema.Types.ObjectId,
		ref: 'Member',
		required: true
	},
	start: {
		type: Date,
		required: true
	},
	end: {
		type: Date
	}
});

export const Job = model<IJobModel>('Job', schema, 'jobs');
