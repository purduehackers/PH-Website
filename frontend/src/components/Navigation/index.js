import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const AuthNav = () => (
	<React.Fragment>
		<Link to="/profile">Profile</Link>
		<Link to="/members">Members</Link>
		<Link to="/events">Events</Link>
		<Link to="/calender">Calender</Link>
		<Link to="/logout">Logout</Link>
	</React.Fragment>
);

const NonAuthNav = () => (
	<React.Fragment>
		<Link to="/login">Login</Link>
		<Link to="/signup">Join</Link>
	</React.Fragment>
);

class Navbar extends Component {
	static propTypes = {
		auth: PropTypes.bool.isRequired
	};

	render() {
		return (
			<nav className="navbar navbar-default navbar-fixed-top">
				<div className="nav-container container">
					<div className="navbar-header">
						<Link id="nav-brand" className="navbar-brand" to="/">
							<div className="nav-logo" />
							<span className="nav-name">Purdue Hackers</span>
						</Link>
					</div>
					<div className="collapse navbar-collapse" id="navbar">
						<ul className="nav navbar-nav navbar-right">
							{this.props.auth ? <AuthNav /> : <NonAuthNav />}
						</ul>
					</div>
				</div>
			</nav>
		);
	}
}

export default Navbar;
