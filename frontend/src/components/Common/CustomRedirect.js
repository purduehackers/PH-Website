import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class CustomRedirect extends Component {
	static propTypes = {
		to: PropTypes.string.isRequired,
		msg: PropTypes.string
	};

	static defaultProps = {
		msg: ''
	};

	render = () => <Redirect to={this.props.to} />;
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default connect(mapStateToProps)(CustomRedirect);
