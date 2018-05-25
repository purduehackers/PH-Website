import { Document, Schema, model } from 'mongoose';

export interface IPermissionModel extends Document {
	name: string;
	description: string;
}

const schema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

export const Permission = model<IPermissionModel>('Permission', schema, 'permissions');
