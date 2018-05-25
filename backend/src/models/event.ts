import { Document, Schema, model } from 'mongoose';

export interface IEventModel extends Document {
	name: string;
	location: string;
	facebook: string;
	eventTime: Date;
	privateEvent: boolean;
}

const schema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		location: {
			type: String,
			required: true
		},
		members: {
			type: [Schema.Types.ObjectId],
			ref: 'Member',
			default: []
		},
		facebook: {
			type: String
		},
		eventTime: {
			type: Date,
			required: true
		},
		privateEvent: {
			type: Boolean
		}
	},
	{ timestamps: true }
);

export const Event = model<IEventModel>('Event', schema, 'events');
