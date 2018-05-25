import { Document, Schema, model } from 'mongoose';

export interface IEventModel extends Document {
	name: string;
	category: string;
	location: string;
	facebook: string;
	eventTime: Date;
	privateEvent: boolean;
}

const schema = new Schema(
	{
		name: {
			type: String
		},
		category: {
			type: String
		},
		location: {
			type: String
		},
		facebook: {
			type: String
		},
		eventTime: {
			type: Date
		},
		privateEvent: {
			type: Boolean
		}
	},
	{ timestamps: true }
);

export const Event = model<IEventModel>('Event', schema, 'events');
