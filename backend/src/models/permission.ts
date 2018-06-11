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
		},
		members: [
			{
				member: Schema.Types.ObjectId,
				recordedBy: Schema.Types.ObjectId,
				dateAdded: Date
			}
		]
	},
	{ timestamps: true }
);

export const Permission = model<IPermissionModel>('Permission', schema, 'permissions');
