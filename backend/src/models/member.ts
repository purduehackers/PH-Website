import * as bcrypt from 'bcrypt';
import {
	prop,
	Typegoose,
	ModelType,
	InstanceType,
	Ref,
	pre,
	instanceMethod,
	arrayProp
} from 'typegoose';

export enum MemberType {
	MEMBER,
	ALUMNI,
	INACTIVE
}

export enum Gender {
	MALE,
	FEMALE,
	OTHER,
	NO
}

export const Permissions = {
	ADMIN: 'admin',
	ADMINPERMISSIONS: 'adminpermissions',
	PERMISSIONS: 'permissions',
	EVENTS: 'events',
	CREDENTIALS: 'credentials',
	MEMBERS: 'members'
};

@pre<Member>('save', async function(next) {
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
export class Member extends Typegoose {
	@prop({ required: true })
	public name: string;
	@prop({ required: true, index: true })
	public email: string;
	@prop({ required: true })
	public graduationYear: number;
	@prop({ required: true, select: false })
	public password: string;
	@prop({ enum: MemberType, default: MemberType.MEMBER })
	public memberStatus: MemberType;
	@arrayProp({ items: String })
	public permissions: string[];
	@prop({ enum: Gender })
	public gender: Gender;
	@prop({ default: false })
	public unsubscribed: boolean;
	@prop({ default: false })
	public privateProfile: boolean;
	@prop() public emailPublic: string;
	@prop() public emailEdu: string;
	@prop() public phone: string;
	@prop() public setupEmailSent: Date;
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
	public comparePassword(this: InstanceType<Member>, password: string) {
		return bcrypt.compareSync(password, this.password);
	}
}

export const MemberModel = new Member().getModelForClass(Member, {
	schemaOptions: { timestamps: true }
});
