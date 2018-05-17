import {
	prop,
	Typegoose,
	ModelType,
	arrayProp
} from 'typegoose';

export class Location extends Typegoose {
	@arrayProp({items: Number, index: true}) public loc: number[];
	@prop() public name: string;
	@prop() public city: string;
	@prop() public loc_lat: number;
	@prop() public loc_lng: number;
}

export const LocationModel = new Location().getModelForClass(Location, {
	schemaOptions: { timestamps: true }
});
