import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signIn, sendFlashMessage } from '../../actions';
import PropTypes from 'prop-types';

class LoginPage extends Component {
	static propTypes = {
		sendFlashMessage: PropTypes.func.isRequired,
		history: PropTypes.shape({
			push: PropTypes.func
		}).isRequired,
		user: PropTypes.object.isRequired,
		signIn: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		console.log('Login props:', this.props);
		this.state = {
			email: (this.props.user && this.props.user.email) || '',
			password: ''
		};
	}

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	onSubmit = async e => {
		e.preventDefault();
		try {
			const { email, password } = this.state;
			if (!email) return this.props.sendFlashMessage('Please enter your email');
			if (!password) return this.props.sendFlashMessage('Please enter your password');
			const { user } = await this.props.signIn(email, password);
			console.log('Signed in user:', user);
			this.props.history.push('/');
			return this.props.sendFlashMessage(`Welcome ${user.name}!`, 'green');
		} catch (err) {
			return this.props.sendFlashMessage(err.error);
		}
	};

	render() {
		const { email, password } = this.state;
		return (
			<div className="section">
				<div className="section-container">
					<h3>Login</h3>

					<div className="panel panel-default">
						<form className="panel-body" onSubmit={this.onSubmit}>
							<input
								type="text"
								name="email"
								id="email"
								placeholder="Email"
								value={email}
								onChange={this.onChange}
							/>
							<input
								type="password"
								name="password"
								id="password"
								placeholder="Password"
								value={password}
								onChange={this.onChange}
							/>
							<br />
							<br />
							<input type="submit" value="Sign In" />
							<br />
							<br />
							<input type="checkbox" name="remember" /> Remember Me
							<br />
							<br />
							Forgot your password?{' '}
							<a href="{{ action('AuthController@getForgot') }}">Click Here</a>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default connect(mapStateToProps, { signIn, sendFlashMessage })(LoginPage);
