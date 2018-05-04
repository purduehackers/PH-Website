import { AUTH_USER_SET, DB_USER_SET } from '../actions';

function sessionReducer(state = {
	token: null,
	user: null,
}, action) {
	switch (action.type) {
	case AUTH_USER_SET: {
		return {
			...state,
			token: action.token,
		};
	}
	case DB_USER_SET: {
		return {
			...state,
			user: {
				...state.user,
				...action.user,
			},
		};
	}
	default: return state;
	}
}

export default sessionReducer;
