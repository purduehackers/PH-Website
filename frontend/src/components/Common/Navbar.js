import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CommonNav = () => (
	<React.Fragment>
		<li>
			<Link to="/members">Members</Link>
		</li>
		<li>
			<Link to="/events">Events</Link>
		</li>
		<li>
			<Link to="/calendar">Calendar</Link>
		</li>
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
							<li>
								<Link to={`/member/${id}`}>Profile</Link>
							</li>

							<CommonNav />
							<li>
								<Link to="/logout">Logout</Link>
							</li>
						</React.Fragment>
					) : (
						<React.Fragment>
							<CommonNav />
							<li>
								<Link to="/login">Login</Link>
							</li>
							<li>
								<Link to="/signup">Join</Link>
							</li>
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
