export const formatDate = date =>
	new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		weekday: 'short'
	});

export const hasPermission = (user, name) =>
	user && user.permissions.some(per => per.name === name || per.name === 'admin');

export const isAdmin = user => hasPermission(user, 'admin');

export const memberMatches = (user, id) =>
	user && (hasPermission(user, 'admin') || user._id === id);

export const shortName = name => name.substr(0, 32);

export default {
	HOME: '/',
	LOGIN: '/login',
	LOGOUT: '/logout',
	SIGNUP: '/signup',
	PROFILE: '/profile',
	EVENTS: '/events',
	EVENT: '/event/:id',
	CREATE_EVENT: '/events/create',
	EDIT_EVENT: '/event/:id/edit',
	MEMBERS: '/members',
	MEMBER: '/member/:id',
	CALENDAR: '/calendar',
	REPORTS: '/reports',
	PERMISSIONS: '/permissions',
	PERMISSION: '/permission/:id',
	CREDENTIALS: '/credentials',
	LOCATIONS: '/locations',
	HACKATHONS: '/hackathons',
	PROJECTS: '/projects',
	DEV: '/dev',
	ANVIL_WIFI: '/anvil-wifi'
};
