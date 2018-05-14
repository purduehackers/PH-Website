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

class Event extends Typegoose {
	@prop() public privateEvent: boolean;
	@prop() public requiresApplication: boolean;
	@prop() public requiresRegistration: boolean;
	@prop() public name: string;
	@prop() public category: string;
	@prop() public location: string;
	@prop() public facebook: string;
	@prop() public startsAt: Date;
}

export const EventModel = new Event().getModelForClass(Event, { schemaOptions: { timestamps: true } });
