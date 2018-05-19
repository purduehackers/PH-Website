import { Member } from './member';
import {
	prop,
	Typegoose,
	ModelType,
	InstanceType,
	Ref,
	arrayProp
} from 'typegoose';

export class Event extends Typegoose {
	@prop() public privateEvent: boolean;
	@prop() public requiresApplication: boolean;
	@prop() public requiresRegistration: boolean;
	@prop() public name: string;
	@prop() public category: string;
	@prop() public location: string;
	@prop() public facebook: string;
	@prop() public startsAt: Date;
	@arrayProp({ itemsRef: Member })
	public members: Array<Ref<Member>>;
}

export const EventModel = new Event().getModelForClass(Event, {
	schemaOptions: { timestamps: true }
});
