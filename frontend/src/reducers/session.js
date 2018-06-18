import { AUTH_USER_SET, AUTH_TOKEN_SET } from '../actions';

export default (
	state = {
		token: sessionStorage.getItem('token') || null,
		user: JSON.parse(sessionStorage.getItem('user')) || null
	},
	action
) => {
	switch (action.type) {
		case AUTH_USER_SET: {
			if (action.user) {
				sessionStorage.setItem('user', JSON.stringify(action.user));
				return {
					...state,
					user: {
						...state.user,
						...action.user
					}
				};
			}

			sessionStorage.removeItem('user');
			return {
				...state,
				user: null
			};
		}
		case AUTH_TOKEN_SET: {
			action.token
				? sessionStorage.setItem('token', action.token)
				: sessionStorage.removeItem('token');
			return {
				...state,
				token: action.token
			};
		}
		default:
			return state;
	}
};
