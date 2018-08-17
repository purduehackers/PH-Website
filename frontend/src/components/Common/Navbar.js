import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import routes, { hasPermission } from '../../constants';

const CommonNav = () => (
	<React.Fragment>
		<NavItem href={routes.MEMBERS}>Members</NavItem>
		<NavItem href={routes.EVENTS}>Events</NavItem>
		<NavItem href={routes.CALENDAR}>Calendar</NavItem>
	</React.Fragment>
);

const PHNavbar = ({ auth, id, user }) => (
	<Navbar collapseOnSelect bsStyle="default" style={{ marginBottom: '10px', maxWidth: '100%' }}>
		<Navbar.Header>
			<Navbar.Brand>
				<Link id="nav-brand" to="/">
					<div className="nav-logo" />
					<span className="nav-name">Purdue Hackers</span>
				</Link>
			</Navbar.Brand>
			<Navbar.Toggle />
		</Navbar.Header>
		<Navbar.Collapse>
			<Nav pullRight>
				{auth && id ? (
					<React.Fragment>
						<li role="presentation">
							<Link to={`/member/${id}`}>Profile</Link>
						</li>
						<CommonNav />
						<NavDropdown title="Organizers" id="protected-nav-dropdown">
							<style>{`.privateItem a {padding-top: 5px !important;}`}</style>
							{hasPermission(user, 'permissions') && (
								<MenuItem className="privateItem" href={routes.PERMISSIONS}>
									Permissions
								</MenuItem>
							)}
							{hasPermission(user, 'credentials') && (
								<MenuItem className="privateItem" href={routes.CREDENTIALS}>
									Credentials
								</MenuItem>
							)}
						</NavDropdown>
						<li role="presentation">
							<Link to={routes.LOGOUT}>Logout</Link>
						</li>
					</React.Fragment>
				) : (
					<React.Fragment>
						<CommonNav />
						<NavItem href={routes.LOGIN}>Login</NavItem>
						<NavItem href={routes.SIGNUP}>Join</NavItem>
					</React.Fragment>
				)}
			</Nav>
		</Navbar.Collapse>
	</Navbar>
);

// const CommonNav = () => (
// 	<React.Fragment>
// 		<li>
// 			<Link to="/members">Members</Link>
// 		</li>
// 		<li>
// 			<Link to="/events">Events</Link>
// 		</li>
// 		<li>
// 			<Link to="/calendar">Calendar</Link>
// 		</li>
// 	</React.Fragment>
// );

// const Navbars = ({ auth, id }) => (
// 	<nav className="navbar navbar-default navbar-static-top">
// 		<div className="container">
// 			<div className="navbar-header">
// 				<button
// 					type="button"
// 					className="navbar-toggle collapsed"
// 					data-toggle="collapse"
// 					data-target="#navbar"
// 					aria-expanded="false"
// 					aria-controls="navbar"
// 				>
// 					<span className="sr-only">Toggle navigation</span>
// 					<span className="icon-bar" />
// 					<span className="icon-bar" />
// 					<span className="icon-bar" />
// 				</button>
// 				<Link id="nav-brand" className="navbar-brand" to="/">
// 					<div className="nav-logo" />
// 					<span className="nav-name">Purdue Hackers</span>
// 				</Link>
// 			</div>
// 			<div className="collapse navbar-collapse" id="navbar">
// 				<ul className="nav navbar-nav navbar-right">
// 					{auth && id ? (
// 						<React.Fragment>
// 							<li>
// 								<Link to={`/member/${id}`}>Profile</Link>
// 							</li>

// 							<CommonNav />
// 							<li>
// 								<Link to="/logout">Logout</Link>
// 							</li>
// 						</React.Fragment>
// 					) : (
// 						<React.Fragment>
// 							<CommonNav />
// 							<li>
// 								<Link to="/login">Login</Link>
// 							</li>
// 							<li>
// 								<Link to="/signup">Join</Link>
// 							</li>
// 						</React.Fragment>
// 					)}
// 				</ul>
// 			</div>
// 		</div>
// 	</nav>
// );

// Navbar.propTypes = {
// 	auth: PropTypes.bool,
// 	id: PropTypes.string
// };

// Navbar.defaultProps = {
// 	auth: null,
// 	id: null
// };

PHNavbar.propTypes = {
	auth: PropTypes.bool,
	id: PropTypes.string
};

PHNavbar.defaultProps = {
	auth: null,
	id: null
};

// export default Navbar;
export default PHNavbar;
