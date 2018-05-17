import React, { PureComponent } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { hasPermission } from '../../constants';

export default class extends PureComponent {
	render = () => {
		const { component: Component, roles, token, user, ...rest } = this.props; // eslint-disable-line
		return (
			<Route
				{...rest}
				render={props => {
					const allowed = roles ? roles.every(role => hasPermission(user, role)) : true;
					return allowed && token && user ? <Component {...props} /> : <Redirect to="/" />;
				}}
			/>
		);
	};
}
