import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { hasPermission } from '../../constants';
import { CustomRedirect } from '../Common';

const ProtectedRoute = ({ component: Component, roles, token, user, msg, type, ...rest }) => (
	<Route
		{...rest}
		render={props => {
			console.log('Permission:', hasPermission(user, 'credentials'));
			const allowed = roles ? roles.some(role => hasPermission(user, role)) : true;
			return allowed && token && user ? (
				<Component {...props} type={type} />
			) : (
				<CustomRedirect to="/" msgRed={msg} />
			);
		}}
	/>
);

ProtectedRoute.propTypes = {
	component: PropTypes.any.isRequired,
	roles: PropTypes.array,
	token: PropTypes.string,
	user: PropTypes.object,
	msg: PropTypes.string,
	type: PropTypes.string
};

ProtectedRoute.defaultProps = {
	roles: null,
	token: null,
	user: null,
	msg: 'Permission Denied',
	type: ''
};

export default ProtectedRoute;
