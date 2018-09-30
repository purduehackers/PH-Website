import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { signOut, sendFlashMessage } from '../../actions';
import routes from '../../constants';

class Logout extends Component {
	static propTypes = {
		signOut: PropTypes.func.isRequired,
		sendFlashMessage: PropTypes.func.isRequired
	};

	componentWillMount = () => this.props.signOut();

	componentDidMount = () => this.props.sendFlashMessage('You are now signed out', 'green');

	render = () => <Redirect to={routes.HOME} />;
}

export default connect(
	null,
	{ signOut, sendFlashMessage }
)(Logout);
