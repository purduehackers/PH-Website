import React, { PureComponent } from 'react';
import { Route, Redirect } from 'react-router-dom';

export default class extends PureComponent {
	render = () => {
		const { component: Component, token, user, ...rest } = this.props; // eslint-disable-line
		console.log('Protected Route: ', token, user);
		return (
			<Route
				{...rest}
				render={props => (token && user ? <Component {...props} /> : <Redirect to="/login" />)}
			/>
		);
	};
}
