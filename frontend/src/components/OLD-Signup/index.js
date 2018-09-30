import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import validator from 'validator';
import { signUp, sendFlashMessage } from '../../actions';

class SignupPage extends Component {
	static propTypes = {
		user: PropTypes.object,
		signUp: PropTypes.func,
		history: PropTypes.shape({
			push: PropTypes.func
		}).isRequired,
		flash: PropTypes.func.isRequired
	};

	static defaultProps = {
		user: null,
		signUp: null
	};

	constructor(props) {
		super(props);
		const { user } = this.props;
		this.state = {
			name: user ? user.name : '',
			email: user ? user.email : '',
			password: '',
			passwordConfirm: '',
			graduationYear: user ? user.graduationYear : new Date().getFullYear() + 4
		};
		console.log('Signup page props', this.props);
	}

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	onSubmit = async e => {
		e.preventDefault();
		const { email, password, passwordConfirm } = this.state;
		const { flash } = this.props;
		try {
			const graduationYear = parseInt(this.state.graduationYear, 10);
			if (!email || !validator.isEmail(email)) return flash('Please enter your email');
			if (!password) return flash('Please enter your password');
			if (password.length < 5) return flash('Password must be at least 5 characters');
			if (!passwordConfirm) return flash('Please confirm your password');
			if (
				!graduationYear ||
				graduationYear < 1869 ||
				graduationYear > new Date().getFullYear() + 20
			)
				return flash('Please enter a valid graduation year');
			if (password !== passwordConfirm) return flash('Passwords do not match');

			console.log('About to sign up:', this.state);
			const resp = await this.props.signUp(this.state);
			console.log('Signup returned response:', resp);
			this.props.history.push('/');
			return flash(`Welcome ${resp.user.name}!`, 'green');
		} catch (err) {
			console.error('SignUp Page error:', err);
			return flash(err.error);
		}
	};

	render() {
		return (
			<div className="section">
				<div className="section-container">
					<h3>Join Purdue Hackers</h3>
					<div className="panel panel-default">
						<form className="panel-body" onSubmit={this.onSubmit}>
							<label htmlFor="name">
								Full Name
								<input
									type="text"
									id="name"
									placeholder="Full Name"
									value={this.state.name}
									className="form-control"
									onChange={this.onChange}
									pattern="([a-zA-Z]+ )+[a-zA-Z]+"
									title="Please enter first and last name"
									required
								/>
							</label>
							<br />
							<label htmlFor="email">
								Email
								<input
									type="email"
									id="email"
									placeholder="Email"
									value={this.state.email}
									className="form-control"
									onChange={this.onChange}
									required
								/>
							</label>
							<br />
							<label htmlFor="password">
								Password
								<input
									type="password"
									id="password"
									placeholder="Password"
									className="form-control"
									value={this.state.password}
									onChange={this.onChange}
									pattern=".{5,}"
									title="Password must be at least 5 characters"
									required
								/>
							</label>
							<br />
							<label htmlFor="passwordConfirm">
								Confirm Password
								<input
									type="password"
									id="passwordConfirm"
									placeholder="Confirm Password"
									className="form-control"
									value={this.state.passwordConfirm}
									onChange={this.onChange}
									pattern=".{5,30}"
									title="Password must be at least 5 characters"
									required
								/>
							</label>
							<br />
							<label htmlFor="graduationYear">
								(Expected) Year of Graduation
								<input
									type="number"
									id="graduationYear"
									placeholder="Graduation Year"
									className="form-control"
									value={this.state.graduationYear}
									onChange={this.onChange}
									min="1869"
									max={new Date().getFullYear() + 20}
									required
								/>
							</label>
							<br />
							<input type="submit" value="Join" className="btn btn-primary" />
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

export default connect(
	mapStateToProps,
	{ signUp, flash: sendFlashMessage }
)(SignupPage);
