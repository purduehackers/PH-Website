export const formatDate = date =>
	new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export const hasPermission = (user, name) =>
	user && user.permissions.some(per => per.name === name || per.name === 'admin');

export const isAdmin = user => hasPermission(user, 'admin');

export const memberMatches = (user, id) => hasPermission(user, 'admin') || user._id === id;

export default {
	HOME: '/',
	LOGIN: '/login',
	LOGOUT: '/logout',
	SIGNUP: '/signup',
	PROFILE: '/profile',
	EVENTS: '/events',
	EVENT: '/event:id',
	CREATE_EVENT: '/events/create',
	MEMBERS: '/members',
	MEMBER: '/member/:id',
	CALENDAR: '/calendar',
	REPORTS: '/reports',
	PERMISSIONS: '/permissions',
	CREDENTIALS: '/credentials',
	LOCATIONS: '/locations',
	HACKATHONS: '/hackathons',
	PROJECTS: '/projects',
	DEV: '/dev',
	ANVIL_WIFI: '/anvil-wifi'
};
