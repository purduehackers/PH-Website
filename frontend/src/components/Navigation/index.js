import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// eslint-disable-next-line
const AuthNav = ({ id }) => (
	<React.Fragment>
		<Link to={`/member/${id}`}>Profile</Link>
		<Link to="/members">Members</Link>
		<Link to="/events">Events</Link>
		<Link to="/calendar">Calendar</Link>
		<Link to="/logout">Logout</Link>
	</React.Fragment>
);

const NonAuthNav = () => (
	<React.Fragment>
		<Link to="/members">Members</Link>
		<Link to="/events">Events</Link>
		<Link to="/calendar">Calendar</Link>
		<Link to="/login">Login</Link>
		<Link to="/signup">Join</Link>
	</React.Fragment>
);

class Navbar extends Component {
	static propTypes = {
		auth: PropTypes.bool,
		id: PropTypes.string
	};

	static defaultProps = {
		auth: null,
		id: null
	};

	render() {
		const { auth, id } = this.props;
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
							{auth && id ? <AuthNav id={this.props.id} /> : <NonAuthNav />}
						</ul>
					</div>
				</div>
			</nav>
		);
	}
}

export default Navbar;
