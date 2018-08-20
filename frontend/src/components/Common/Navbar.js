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

const OrganizerDropdown = ({ user }) => (
	<NavDropdown title="Organizers" id="protected-nav-dropdown">
		<style>{'.privateItem a {padding-top: 5px !important;}'}</style>
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
						{(hasPermission(user, 'permissions') || hasPermission(user, 'credentials')) && (
							<OrganizerDropdown user={user} />
						)}
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

PHNavbar.propTypes = {
	auth: PropTypes.bool,
	id: PropTypes.string,
	user: PropTypes.object
};

PHNavbar.defaultProps = {
	auth: null,
	id: null,
	user: null
};

OrganizerDropdown.propTypes = { user: PropTypes.object };

OrganizerDropdown.defaultProps = { user: null };

// export default Navbar;
export default PHNavbar;
