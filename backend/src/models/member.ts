import * as bcrypt from 'bcrypt';
import { Document, Schema, model } from 'mongoose';
import { IEventModel } from './event';
import { IPermissionModel } from './permission';
import { IJobModel } from './job';
import { ILocationModel } from './location';

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
	locations: {
		location: ILocationModel;
		dateStart: Date;
		dateEnd: Date;
	}[];
	jobs: IJobModel[];
	gender: string;
	unsubscribed: boolean;
	privateProfile: boolean;
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
	resumeLink: string;
	createdAt: Date;
	updatedAt: Date;
	authenticatedAt: Date;
	rememberToken: string;
	resetPasswordToken: string;
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
			default: 0
		},
		password: {
			type: String,
			select: false,
			default: ''
		},
		memberStatus: {
			type: String,
			enum: [...Object.values(memberStatuses)],
			default: memberStatuses.MEMBER
		},
		gender: { type: String },
		unsubscribed: {
			type: Boolean,
			default: false
		},
		privateProfile: {
			type: Boolean,
			default: false
		},
		phone: { type: String },
		major: { type: String },
		picture: { type: String },
		description: { type: String },
		facebook: { type: String },
		github: { type: String },
		linkedin: { type: String },
		devpost: { type: String },
		website: { type: String },
		resume: { type: String },
		resumeLink: { type: String },
		authenticatedAt: { type: String },
		setupEmailSent: { type: String },
		rememberToken: { type: String },
		resetPasswordToken: { type: String },
		permissions: {
			type: [Schema.Types.ObjectId],
			ref: 'Permission',
			default: []
		},
		events: {
			type: [Schema.Types.ObjectId],
			ref: 'Event',
			default: []
		},
		locations: [
			{
				location: {
					type: Schema.Types.ObjectId,
					ref: 'Location'
				},
				dateStart: Date,
				dateEnd: Date
			}
		],
		jobs: {
			type: [Schema.Types.ObjectId],
			ref: 'Job',
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
	const member = this as IMemberModel;
	return bcrypt.compareSync(password, member.password);
};

export const Member = model<IMemberModel>('Member', schema, 'members');
