import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { prop, Typegoose, ModelType, InstanceType, Ref, pre, instanceMethod } from 'typegoose';

enum MemberType {
	MEMBER,
	ALUMNI,
	INACTIVE
}

enum Gender {
	MALE,
	FEMALE,
	OTHER,
	NO
}

@pre<User>('save', async function(next) {
	if (this.isModified('password') || this.isNew) {
		try {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(this.password, salt);
			this.password = hash;
		} catch (error) {
			console.error(error);
		}
	} else {
		return next();
	}
})
class User extends Typegoose {
	@prop({ required: true })
	public name: string;
	@prop({ required: true })
	public username: string;
	@prop() public privateProfile: boolean;
	@prop({ required: true })
	public email: string;
	@prop() public emailPublic: string;
	@prop() public emailEdu: string;
	@prop() public phone: string;
	@prop() public unsubscribed: boolean;
	@prop({ required: true })
	public password: string;
	@prop() public setupEmailSent: Date;
	@prop({ enum: MemberType })
	public memberStatus: MemberType;
	@prop({ enum: Gender })
	public gender: Gender;
	@prop({ required: true })
	public graduationYear: number;
	@prop() public major: string;
	@prop() public picture: string;
	@prop() public description: string;
	@prop() public facebook: string;
	@prop() public github: string;
	@prop() public linkedin: string;
	@prop() public devpost: string;
	@prop() public website: string;
	@prop() public resume: string;
	@prop() public createdAt: Date;
	@prop() public updatedAt: Date;
	@prop() public authenticatedAt: Date;
	@prop() public rememberToken: string;
	@prop() public linktoresume: string;

	@instanceMethod
	comparePassword(this: InstanceType<User>, password: string) {
		return bcrypt.compareSync(password, this.password);
	}
}

export const UserModel = new User().getModelForClass(User, { schemaOptions: { timestamps: true } });
