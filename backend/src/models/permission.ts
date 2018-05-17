import {
	prop,
	Typegoose,
	ModelType
} from 'typegoose';

export class Permission extends Typegoose {
	@prop() public name: string;
	@prop() public description: string;
}

export const PermissionModel = new Permission().getModelForClass(Permission, {
	schemaOptions: { timestamps: true }
});
