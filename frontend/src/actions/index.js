import axios from 'axios';

// Helper functions
export const getToken = () => localStorage.getItem('token');
export const getCurrentUser = () => JSON.parse(localStorage.getItem('user'));

// Actions
export const AUTH_USER_SET = 'AUTH_USER_SET';
export const AUTH_TOKEN_SET = 'AUTH_TOKEN_SET';

// Dispatchers
const makeDispatcher = (type, ...argNames) => (...args) => {
	const action = { type };
	argNames.forEach((arg, index) => {
		action[argNames[index]] = args[index];
	});
	return action;
};

const setUser = makeDispatcher(AUTH_USER_SET, 'user');
const setToken = makeDispatcher(AUTH_TOKEN_SET, 'token');

// Creators
export const signUp = newUser => async dispatch => {
	try {
		const {
			data: { response }
		} = await axios.post('/api/auth/signup', newUser);
		dispatch(setToken(response.token));
		dispatch(setUser(response.user));
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const signIn = (email, password) => async dispatch => {
	try {
		const {
			data: { response }
		} = await axios.post('/api/auth/login', {
			email,
			password
		});
		dispatch(setToken(response.token));
		dispatch(setUser(response.user));
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const signOut = () => dispatch => {
	console.log('Signing out');
	dispatch(setToken(null));
	dispatch(setUser(null));
	console.log('Signed out');
};

export const localStorageChanged = e => dispatch => {
	console.log('Local storage changed event:', e);
	dispatch(setToken(getToken()));
	dispatch(setUser(getCurrentUser()));
};
