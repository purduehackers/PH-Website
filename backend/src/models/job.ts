import { Document, Schema, model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ILocationModel, Location } from './location';
import { IMemberModel, Member } from './member';

export interface IJobModel extends Document {
	location: ILocationModel;
	member: IMemberModel;
	start: Date;
	end: Date;
}

const schema = new Schema(
	{
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
	},
	{ timestamps: true }
);

export const Job = model<IJobModel>('Job', schema, 'jobs');
