import axios from 'axios';

// Helper functions
export const getToken = () => localStorage.getItem('token');
export const getCurrentUser = () => JSON.parse(localStorage.getItem('user'));
const makeDispatcher = (type, ...argNames) => (...args) => {
	const action = { type };
	argNames.forEach((arg, index) => {
		action[argNames[index]] = args[index];
	});
	return action;
};

// Actions
export const AUTH_USER_SET = 'AUTH_USER_SET';
export const AUTH_TOKEN_SET = 'AUTH_TOKEN_SET';

export const FLASH_GREEN_SET = 'FLASH_GREEN_SET';
export const FLASH_RED_SET = 'FLASH_RED_SET';

// Dispatchers
const setUser = makeDispatcher(AUTH_USER_SET, 'user');
const setToken = makeDispatcher(AUTH_TOKEN_SET, 'token');

const setGreenFlash = makeDispatcher(FLASH_GREEN_SET, 'msgGreen');
const setRedFlash = makeDispatcher(FLASH_RED_SET, 'msgRed');

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
		console.error('Signin error', error.response.data);
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

export const sendFlashMessage = (msg, type = 'red') => dispatch => {
	type === 'red' ? dispatch(setRedFlash(msg)) : dispatch(setGreenFlash(msg));
};

export const clearFlashMessages = () => dispatch => {
	dispatch(setGreenFlash(''));
	dispatch(setRedFlash(''));
};

export const fetchMembers = async params => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.get('/api/members', {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const fetchMember = async (id, params) => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.get(`/api/members/${id}`, {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const fetchMemberEvents = async (id, params) => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.get(`/api/members/${id}/events`, {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const fetchMemberJobs = async (id, params) => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.get(`/api/members/${id}/jobs`, {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const fetchEvents = async params => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.get('/api/events', {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const fetchEvent = async (id, params) => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.get(`/api/events/${id}`, {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const createEvent = async event => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.post('/api/events/', event, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const updateEvent = async (id, event) => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.post(`/api/events/${id}`, event, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const deleteEvent = async id => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.delete(`/api/events/${id}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const fetchCredentials = async params => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.get('/api/credentials', {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const addCredential = async credential => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.post('/api/credentials', credential, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const deleteCredential = async id => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.delete(`/api/credentials/${id}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const addJob = async location => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.post('/api/jobs', location, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const deleteJob = async id => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.delete(`/api/jobs/${id}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const localStorageChanged = e => dispatch => {
	console.log('Local storage changed event:', e);
	dispatch(setToken(getToken()));
	dispatch(setUser(getCurrentUser()));
};
