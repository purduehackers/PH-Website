import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {} from '../../actions';

class SignupPage extends Component {
	static propTypes = {
		user: PropTypes.object,
		signUp: PropTypes.func
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
			graduationYear: user ? user.graduationYear : new Date().getFullYear() + 4,
			error: null
		};
		console.log('Signup page props', this.props);
	}

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	onSubmit = async e => {
		e.preventDefault();
		try {
			// const { email, password } = this.state;
			// if (!email) return this.setState({ error: 'Please enter your email' });
			// if (!password) return this.setState({ error: 'Please enter your password' });
			// await this.props.signUp(this.state);
			// return this.props.history.push('/'); // eslint-disable-line
			console.log('About to sign up:', this.state);
			return null;
		} catch (err) {
			return this.setState({ error: err.error });
		}
	};

	render() {
		return (
			<div className="section">
				<div className="section-container">
					{this.state.error ? (
						<p className="warning" style={{ color: 'red' }}>
							{this.state.error}
						</p>
					) : null}
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
							<label htmlFor="confirmPassword">
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
							<label htmlFor="gradYear">
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

export default connect(mapStateToProps, {})(SignupPage);
