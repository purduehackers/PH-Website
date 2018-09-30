import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmail } from 'validator';
import { sendFlashMessage, clearFlashMessages, forgotPassword } from '../../actions';
import { err } from '../../constants';
import { Header } from '../Common';

class ForgotPasswordPage extends Component {
	static propTypes = {
		flash: PropTypes.func.isRequired,
		clear: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = { email: '' };
	}

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	onSubmit = async e => {
		e.preventDefault();
		const { email } = this.state;
		const { flash, clear } = this.props;
		try {
			clear();
			if (!email || !isEmail(email)) return flash('Please provide a valid email');
			flash('Please wait...', 'green');
			const response = await forgotPassword(email);
			console.log('Response:', response);
			return flash(response, 'green');
		} catch (error) {
			clear();
			console.error('EditProfile Page error:', error);
			return flash(err(error));
		}
	};

	render() {
		const { email } = this.state;
		return (
			<div className="section">
				<div className="section-container">
					<Header message="Forgot Password" />
					<h3>Forgot Your Password</h3>
					<div className="panel panel-default">
						<form className="panel-body validate" onSubmit={this.onSubmit}>
							<div className="input-group">
								<span className="input-group-addon" id="email">
									Email:
								</span>
								<input
									type="email"
									id="email"
									className="form-control"
									placeholder="Email"
									value={email}
									onChange={this.onChange}
								/>
								<span className="input-group-btn">
									<input
										className="btn btn-primary"
										type="submit"
										value="Reset Password"
									/>
								</span>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({ ...state.sessionState });

export default connect(
	mapStateToProps,
	{
		flash: sendFlashMessage,
		clear: clearFlashMessages
	}
)(ForgotPasswordPage);
