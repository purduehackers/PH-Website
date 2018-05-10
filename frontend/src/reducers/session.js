import { AUTH_USER_SET, AUTH_TOKEN_SET } from '../actions';

export default (
	state = {
		token: localStorage.getItem('token') || null,
		user: JSON.parse(localStorage.getItem('user')) || null
	},
	action
) => {
	switch (action.type) {
		case AUTH_USER_SET: {
			if (action.user) {
				localStorage.setItem('user', JSON.stringify(action.user));
				return {
					...state,
					user: {
						...state.user,
						...action.user
					}
				};
			}

			localStorage.removeItem('user');
			return {
				...state,
				user: null
			};
		}
		case AUTH_TOKEN_SET: {
			action.token
				? localStorage.setItem('token', action.token)
				: localStorage.removeItem('token');
			return {
				...state,
				token: action.token
			};
		}
		default:
			return state;
	}
};
