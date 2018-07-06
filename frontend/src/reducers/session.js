import { AUTH_USER_SET, AUTH_TOKEN_SET, AUTH_REMEMBER_ME_SET } from '../actions';
import { getStorage, setStorage } from '../constants';

export default (
	state = {
		token: getStorage().getItem('token') || null,
		user: JSON.parse(getStorage().getItem('user')) || null,
		rememberMe: false
	},
	action
) => {
	switch (action.type) {
		case AUTH_USER_SET: {
			if (action.user) {
				getStorage().setItem('user', JSON.stringify(action.user));
				return {
					...state,
					user: {
						...state.user,
						...action.user
					}
				};
			}

			getStorage().removeItem('user');
			return {
				...state,
				user: null
			};
		}
		case AUTH_TOKEN_SET: {
			action.token
				? getStorage().setItem('token', action.token)
				: getStorage().removeItem('token');
			return {
				...state,
				token: action.token
			};
		}
		case AUTH_REMEMBER_ME_SET: {
			if (action.rememberMe) {
				const token = getStorage().getItem('token');
				const user = getStorage().getItem('user');
				getStorage().removeItem('token');
				getStorage().removeItem('user');
				setStorage(localStorage);
				token && getStorage().setItem('token', token);
				user && getStorage().setItem('user', user);
			} else {
				const token = getStorage().getItem('token');
				const user = getStorage().getItem('user');
				getStorage().removeItem('token');
				getStorage().removeItem('user');
				setStorage(sessionStorage);
				token && getStorage().setItem('token', token);
				user && getStorage().setItem('user', user);
			}
			return {
				...state,
				rememberMe: action.rememberMe
			};
		}

		default:
			return state;
	}
};
