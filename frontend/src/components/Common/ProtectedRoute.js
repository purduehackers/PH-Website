import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { hasPermission } from '../../constants';
import { CustomRedirect } from '../Common';

const ProtectedRoute = ({ component: Component, roles, token, user, msg, ...rest }) => (
	<Route
		{...rest}
		render={props => {
			const allowed = roles ? roles.every(role => hasPermission(user, role)) : true;
			return allowed && token && user ? (
				<Component {...props} />
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
	msg: PropTypes.string
};

ProtectedRoute.defaultProps = {
	roles: null,
	token: null,
	user: null,
	msg: 'Permission Denied'
};

export default ProtectedRoute;
