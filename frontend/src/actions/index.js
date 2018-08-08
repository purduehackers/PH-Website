import axios from 'axios';
import { getStorage } from '../constants';

// Helper functions
export const getToken = () => getStorage().getItem('token');
export const getCurrentUser = () => JSON.parse(getStorage().getItem('user'));
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
export const AUTH_REMEMBER_ME_SET = 'AUTH_REMEMBER_ME_SET';

export const FLASH_GREEN_SET = 'FLASH_GREEN_SET';
export const FLASH_RED_SET = 'FLASH_RED_SET';

// Dispatchers
const setUser = makeDispatcher(AUTH_USER_SET, 'user');
const setToken = makeDispatcher(AUTH_TOKEN_SET, 'token');
const setRememberMe = makeDispatcher(AUTH_REMEMBER_ME_SET, 'rememberMe');

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
		throw error.response.data;
	}
};

export const signIn = (email, password, rememberMe) => async dispatch => {
	try {
		const {
			data: { response }
		} = await axios.post('/api/auth/login', {
			email,
			password
		});
		dispatch(setToken(response.token));
		dispatch(setUser(response.user));
		dispatch(setRememberMe(rememberMe));
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const signOut = () => async dispatch => {
	try {
		dispatch(setToken(null));
		dispatch(setUser(null));
		dispatch(setRememberMe(false));
	} catch (error) {
		throw error;
	}
};

export const forgotPassword = async email => {
	try {
		const {
			data: { response }
		} = await axios.post('/api/auth/forgot', { email });
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const resetPassword = async (password, passwordConfirm, token) => {
	try {
		const {
			data: { response }
		} = await axios.post('/api/auth/reset', { password, passwordConfirm, token });
		return response;
	} catch (error) {
		throw error.response.data;
	}
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

export const fetchProfile = params => async dispatch => {
	try {
		const user = getCurrentUser();
		const token = getToken();
		if (!user || (Object.keys(user).length === 0 && user.constructor === Object)) {
			dispatch(setUser(null));
			dispatch(setToken(null));
			return null;
		}
		const {
			data: { response }
		} = await axios.get('/api/auth/me', {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		dispatch(setUser(response.user));
		dispatch(setToken(response.token));
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const updateProfile = (id, member) => async dispatch => {
	try {
		const user = getCurrentUser();
		if (!user || (Object.keys(user).length === 0 && user.constructor === Object)) {
			dispatch(setUser(null));
			dispatch(setToken(null));
			return null;
		}
		const token = getToken();
		const {
			data: { response }
		} = await axios.put(`/api/members/${id}`, member, {
			headers: { Authorization: `Bearer ${token}` }
		});
		if (user._id === id) dispatch(setUser(response));
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

export const checkinEvent = async (id, name, email) => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.post(
			`/api/events/${id}/checkin`,
			{
				name,
				email
			},
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const checkoutEvent = async (id, memberID) => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.delete(`/api/events/${id}/checkin/${memberID}`, {
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

export const fetchPermissions = async params => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.get('/api/permissions', {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const fetchPermission = async (id, params) => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.get(`/api/permissions/${id}`, {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const addPermission = async (permission, params) => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.post('/api/permissions/', permission, {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const deletePermission = async (id, params) => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.delete(`/api/permissions/${id}`, {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const addUserToPermission = async (id, email, params) => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.post(
			`/api/permissions/${id}`,
			{ email },
			{
				params,
				headers: { Authorization: `Bearer ${token}` }
			}
		);
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const removeUserFromPermission = async (id, memberID, params) => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.delete(`/api/permissions/${id}/member/${memberID}`, {
			params,
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

export const autocompleteMembers = async params => {
	try {
		const token = getToken();
		const {
			data: { response }
			// } = await axios.get('/api/autocomplete/members/', {
		} = await axios.get('http://localhost:5000/api/autocomplete/members/', {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const autocompleteLocations = async params => {
	try {
		const token = getToken();
		const {
			data: { response }
		} = await axios.get('/api/autocomplete/locations/', {
			params,
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	} catch (error) {
		throw error.response.data;
	}
};

export const storageChanged = e => dispatch => {
	console.log('Local storage changed event:', e);
	dispatch(setToken(getToken()));
	dispatch(setUser(getCurrentUser()));
};
