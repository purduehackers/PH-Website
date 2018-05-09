import { AUTH_USER_SET, AUTH_TOKEN_SET } from '../actions';

export default (
	state = {
		token: null,
		user: null
	},
	action
) => {
	switch (action.type) {
		case AUTH_USER_SET: {
			return {
				...state,
				user: {
					...state.user,
					...action.user
				}
			};
		}
		case AUTH_TOKEN_SET: {
			return {
				...state,
				token: action.token
			};
		}
		default:
			return state;
	}
};
