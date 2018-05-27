import { Document, Schema, model } from 'mongoose';

export interface ILocationModel extends Document {
	loc: any;
	name: string;
	city: string;
}

const schema = new Schema(
	{
		loc: {
			type: { type: String },
			coordinates: { type: [], index: '2dsphere' }
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

// schema.index({ loc: '2dsphere' });

export const Location = model<ILocationModel>('Location', schema, 'locations');
