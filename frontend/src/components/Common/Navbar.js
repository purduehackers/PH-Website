import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CommonNav = () => (
	<React.Fragment>
		<Link to="/members">Members</Link>
		<Link to="/events">Events</Link>
		<Link to="/calendar">Calendar</Link>
	</React.Fragment>
);

const Navbar = ({ auth, id }) => (
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
					{auth && id ? (
						<React.Fragment>
							<Link to={`/member/${id}`}>Profile</Link>
							<CommonNav />
							<Link to="/logout">Logout</Link>
						</React.Fragment>
					) : (
						<React.Fragment>
							<CommonNav />
							<Link to="/login">Login</Link>
							<Link to="/signup">Join</Link>
						</React.Fragment>
					)}
				</ul>
			</div>
		</div>
	</nav>
);

Navbar.propTypes = {
	auth: PropTypes.bool,
	id: PropTypes.string
};

Navbar.defaultProps = {
	auth: null,
	id: null
};

export default Navbar;
