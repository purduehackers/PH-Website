const dateToString = date =>
	new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		weekday: 'short'
	});

export const formatDate = date => {
	if (!date) return 'Current';
	const str = dateToString(date);
	return str !== 'Invalid Date' ? str : 'Current';
};

export const err = e =>
	!e
		? 'Whoops, something went wrong!'
		: e.message && typeof e.message === 'string'
			? e.message
			: e.error && typeof e.error === 'string'
				? e.error
				: 'Whoops, something went wrong!';

export const hasPermission = (user, name) =>
	user &&
	(Object.keys(user).length !== 0 && user.constructor === Object) &&
	user.permissions.some(per => per.name === name || per.name === 'admin');

export const isAdmin = user => hasPermission(user, 'admin');

export const memberMatches = (user, id) =>
	user && (hasPermission(user, 'admin') || user._id === id);

export const shortName = name => name.substr(0, 32);

const storage = () => (localStorage.getItem('token') ? localStorage : sessionStorage);
let _storage = storage();
export const getStorage = () => _storage;
export const setStorage = store => {
	_storage = store;
};

export default {
	HOME: '/',
	LOGIN: '/login',
	LOGOUT: '/logout',
	SIGNUP: '/signup',
	RESET_PASSWORD: '/reset',
	FORGOT_PASSWORD: '/forgot',
	EDIT_PROFILE: '/member/:id/edit',
	EVENTS: '/events',
	EVENT: '/event/:id',
	CREATE_EVENT: '/events/create',
	EDIT_EVENT: '/event/:id/edit',
	CHECKIN_EVENT: '/event/:id/checkin',
	MEMBERS: '/members',
	MEMBER: '/member/:id',
	CALENDAR: '/calendar',
	REPORTS: '/reports',
	PERMISSIONS: '/permissions',
	PERMISSION: '/permission/:id',
	CREDENTIALS: '/credentials',
	LOCATIONS: '/locations',
	LOCATIONS_MAP: '/locations/map',
	LOCATION: '/location/:id',
	HACKATHONS: '/hackathons',
	PROJECTS: '/projects',
	DEV: '/dev',
	ANVIL_WIFI: '/anvil-wifi'
};
