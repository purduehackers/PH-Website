import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
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
							<Link to="/profile" >Profile</Link>
							<Link to="/members" >Members</Link>
							<Link to="/events" >Events</Link>
							<Link to="/calender" >Calender</Link>
							<Link to="/logout" >Logout</Link>
							<Link to="/login" >Login</Link>
							<Link to="/signup" >Join</Link>
						</ul>
					</div>
				</div>
			</nav>
		);
	}
}

export default Navbar;
