import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { sendFlashMessage } from '../../actions';

class CustomRedirect extends Component {
	static propTypes = {
		to: PropTypes.string,
		flash: PropTypes.func.isRequired,
		msgGreen: PropTypes.string,
		msgRed: PropTypes.string
	};

	static defaultProps = {
		msgGreen: '',
		msgRed: '',
		to: '/'
	};

	constructor(props) {
		super(props);
		console.log('CustomRedirect props:', props);
	}

	componentDidMount = () => {
		this.props.flash(this.props.msgRed);
		this.props.flash(this.props.msgGreen, 'green');
	};

	render = () => <Redirect to={this.props.to} />;
}

export default connect(
	null,
	{ flash: sendFlashMessage }
)(CustomRedirect);
