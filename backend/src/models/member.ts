import * as bcrypt from 'bcrypt';
import { Document, Schema, model } from 'mongoose';
import { Location } from './location';
import { IEventModel } from './event';
import { IPermissionModel } from './permission';

export const memberStatuses = {
	MEMBER: 'Member',
	ALUMNI: 'Alumni',
	INACTIVE: 'Inactive'
};

export const genders = {
	MALE: 'Male',
	FEMALE: 'Female',
	OTHER: 'Other',
	NO: 'No'
};

export interface IMemberModel extends Document {
	name: string;
	email: string;
	graduationYear: number;
	password: string;
	memberStatus: string;
	permissions: IPermissionModel[];
	events: IEventModel[];
	gender: string[];
	unsubscribed: boolean;
	privateProfile: boolean;
	emailPublic: string;
	emailEdu: string;
	phone: string;
	setupEmailSent: Date;
	major: string;
	picture: string;
	description: string;
	facebook: string;
	github: string;
	linkedin: string;
	devpost: string;
	website: string;
	resume: string;
	createdAt: Date;
	updatedAt: Date;
	authenticatedAt: Date;
	rememberToken: string;
	comparePassword(password: string): boolean;
}

const schema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			unique: true,
			required: true
		},
		graduationYear: {
			type: Number,
			required: true
		},
		password: {
			type: String,
			select: false,
			required: true
		},
		memberStatus: {
			type: String,
			enum: [...Object.values(memberStatuses)],
			default: memberStatuses.MEMBER
		},
		gender: {
			type: String,
			enum: [...Object.values(genders)]
		},
		unsubscribed: {
			type: Boolean,
			default: false
		},
		privateProfile: {
			type: Boolean,
			default: false
		},
		emailPublic: {
			type: String
		},
		emailEdu: {
			type: String
		},
		phone: {
			type: String
		},
		major: {
			type: String
		},
		picture: {
			type: String
		},
		description: {
			type: String
		},
		facebook: {
			type: String
		},
		github: {
			type: String
		},
		linkedin: {
			type: String
		},
		devpost: {
			type: String
		},
		website: {
			type: String
		},
		resume: {
			type: String
		},
		authenticatedAt: {
			type: Date
		},
		setupEmailSent: {
			type: Date
		},
		rememberToken: {
			type: String
		},
		permissions: {
			type: [Schema.Types.ObjectId],
			ref: 'Permission',
			default: []
		},
		events: {
			type: [Schema.Types.ObjectId],
			ref: 'Event',
			default: []
		}
	},
	{ timestamps: true }
);

schema.pre('save', async function(next) {
	const member = this as IMemberModel;
	if (member.isModified('password') || member.isNew) {
		try {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(member.password, salt);
			member.password = hash;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
	next();
});

schema.methods.comparePassword = function(password: string) {
	return bcrypt.compareSync(password, this.password);
};

export const Member = model<IMemberModel>('Member', schema, 'members');
