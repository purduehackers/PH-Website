import React, { PureComponent } from 'react';
import { Route, Redirect } from 'react-router-dom';

export default class extends PureComponent {
	render = () => {
		const { component: Component, ...rest } = this.props; // eslint-disable-line
		return (
			<Route
				{...rest}
				render={props =>
					rest.token && rest.user ? <Component {...props} /> : <Redirect to="/" />
				}
			/>
		);
	};
}
