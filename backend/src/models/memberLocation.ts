import { Document, Schema, model } from 'mongoose';
import { ILocationModel } from './location';

export interface IMemberLocationModel extends Document {
	location: ILocationModel;
	dateStart: Date;
	dateEnd: Date;
}

export const MemberLocationSchema = new Schema({
	location: {
		type: [Schema.Types.ObjectId],
		ref: 'Location',
		default: []
	},
	dateStart: Date,
	dateEnd: Date
});
