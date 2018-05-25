import { Document, Schema, model } from 'mongoose';

export interface ILocationModel extends Document {
	loc: any;
	name: string;
	city: string;
}

const schema = new Schema(
	{
		loc: {
			type: {type: String, default: 'Point'},
			coordinates: [Number]
		},
		name: {
			type: String
		},
		city: {
			type: String
		}
	},
	{ timestamps: true }
);

schema.index({ loc: '2dsphere' });

export const Location = model<ILocationModel>('Location', schema, 'locations');
