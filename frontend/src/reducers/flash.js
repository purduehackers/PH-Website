import { FLASH_GREEN_SET, FLASH_RED_SET } from '../actions';

export default (
	state = {
		msgGreen: '',
		msgRed: ''
	},
	action
) => {
	switch (action.type) {
		case FLASH_GREEN_SET: {
			return {
				...state,
				msgGreen: action.msgGreen
			};
		}
		case FLASH_RED_SET: {
			return {
				...state,
				msgRed: action.msgRed
			};
		}
		default:
			return state;
	}
};
