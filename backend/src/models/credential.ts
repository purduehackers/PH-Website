import { AES, enc } from 'crypto-js';
import { prop, Typegoose, pre, post } from 'typegoose';

@pre<Credential>('save', function(next) {
	if (this.isModified('password') || this.isNew) {
		try {
			this.password = AES.encrypt(this.password, CONFIG.SECRET).toString();
			next();
		} catch (error) {
			console.error(error);
		}
	} else {
		return next();
	}
})
// tslint:disable-next-line:only-arrow-functions
@post<Credential>('find', function(credentials, next) {
	try {
		credentials.forEach(
			credential =>
				(credential.password = AES.decrypt(credential.password, CONFIG.SECRET).toString(
					enc.Utf8
				))
		);
		next();
	} catch (error) {
		console.error(error);
	}
})
// tslint:disable-next-line:only-arrow-functions
@post<Credential>('findOne', function(credential, next) {
	try {
		credential.password = AES.decrypt(credential.password, CONFIG.SECRET).toString(enc.Utf8);
		next();
	} catch (error) {
		console.error(error);
	}
})
export class Credential extends Typegoose {
	@prop({ required: true })
	public site: string;
	@prop({ required: true })
	public username: string;
	@prop({ required: true })
	public password: string;
	@prop() public description: string;
}

export const CredentialModel = new Credential().getModelForClass(Credential, {
	schemaOptions: { timestamps: true }
});
