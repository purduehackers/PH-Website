import { AES, enc } from 'crypto-js';
import { Document, Schema, model } from 'mongoose';
import CONFIG from '../config';

export interface ICredentialModel extends Document {
	site: string;
	username: string;
	password: string;
	description: string;
}

const schema = new Schema(
	{
		site: {
			type: String,
			required: true
		},
		username: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		description: {
			type: String
		}
	},
	{ timestamps: true }
);

schema.pre('save', function(next) {
	const cred = this as ICredentialModel;
	if (this.isModified('password') || this.isNew) {
		try {
			cred.password = AES.encrypt(cred.password, CONFIG.CREDENTIAL_SECRET, {}).toString();
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	next();
});

// tslint:disable-next-line:only-arrow-functions
schema.post('findOne', function(err, credential: ICredentialModel, next) {
	try {
		credential.password = AES.decrypt(credential.password, CONFIG.CREDENTIAL_SECRET).toString(
			enc.Utf8
		);
		next();
	} catch (error) {
		console.error(error);
		next(error);
	}
});

export const Credential = model<ICredentialModel>('Credential', schema, 'credentials');
