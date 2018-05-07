import * as bcrypt from 'bcrypt';
import { prop, Typegoose, ModelType, InstanceType, Ref, pre } from 'typegoose';

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

@pre<User>('save', function(next) {
	if (this.password && this.isModified('password'))
		this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
	next();
})

class User extends Typegoose {	
	@prop({ required: true }) public name: string;
	@prop({ required: true }) public username: string;
	@prop() public privateProfile: boolean;
	@prop({ required: true }) public email: string;
	@prop() public emailPublic: string;
	@prop() public emailEdu: string;
	@prop() public phone: string;
	@prop() public unsubscribed: boolean;
	@prop({ required: true }) public password: string;
	@prop() public setupEmailSent: Date;
	@prop({ enum: MemberType }) public memberStatus: MemberType;
	@prop({ enum: Gender }) public gender: Gender;
	@prop({ required: true }) public graduationYear: number;
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
}


export const UserModel = new User().getModelForClass(User, { schemaOptions: {timestamps: true} });