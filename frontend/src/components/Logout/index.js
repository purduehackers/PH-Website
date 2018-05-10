import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { signOut } from '../../actions';
import routes from '../../constants';

class Logout extends Component {
	static propTypes = {
		signOut: PropTypes.func
	};

	static defaultProps = {
		signOut: null
	};

	componentWillMount = () => this.props.signOut();

	render = () => <Redirect to={routes.HOME} />;
}

export default connect(null, { signOut })(Logout);
