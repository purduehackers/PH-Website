import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import fontawesome from '@fortawesome/fontawesome';
import { faFacebook, faGithub, faTwitter } from '@fortawesome/fontawesome-free-brands';
import { faEnvelope, faCalendar, faCoffee, faHeart } from '@fortawesome/fontawesome-free-solid';
import routes from '../../constants';
import { ProtectedRoute, NotFound, Footer, FlashMessage, Navigation } from '../Common';
import Home from '../Home';
import Members from '../Members';
import Member from '../Member';
import EditProfile from '../EditProfile';
import Events from '../Events';
import Event from '../Event';
import EditCreateEvent from '../Edit-CreateEvent';
import EventCheckin from '../EventCheckin';
import Credentials from '../Credentials';
import Permissions from '../Permissions';
import Permission from '../Permission';
import Locations from '../Locations';
import LocationsMap from '../LocationsMap';
import Location from '../Location';
import Calendar from '../Calendar';
import AnvilWifi from '../AnvilWifi';
import Dev from '../Dev';
import Login from '../Login';
import Logout from '../Logout';
import SignUp from '../Signup';
import ForgotPassword from '../ForgotPassword';
import ResetPassword from '../ResetPassword';
import { storageChanged, clearFlashMessages, fetchProfile } from '../../actions';

fontawesome.library.add(faFacebook, faGithub, faTwitter, faEnvelope, faCalendar, faCoffee, faHeart);

class App extends Component {
	static propTypes = {
		token: PropTypes.string,
		user: PropTypes.object,
		history: PropTypes.shape({
			listen: PropTypes.func
		}).isRequired,
		fetchProfile: PropTypes.func.isRequired,
		clearFlashMessages: PropTypes.func.isRequired,
		storageChanged: PropTypes.func.isRequired
	};

	static defaultProps = {
		token: null,
		user: null
	};

	constructor(props) {
		super(props);
		window.addEventListener('storage', this.props.storageChanged);
		this.props.history.listen(() => this.props.clearFlashMessages());
		console.log('App props:', this.props);
	}

	componentWillMount = async () => {
		try {
			const response = await this.props.fetchProfile();
			console.log('Sign in response:', response);
		} catch (error) {
			console.error('Sign in error:', error);
		}
	};

	render() {
		const { token, user } = this.props;
		return (
			<React.Fragment>
				<Navigation auth={!!token} id={user ? user._id : null} user={user} />
				<div className="pageWrap">
					<FlashMessage />
					<Switch>
						<Route exact path={routes.HOME} component={Home} />
						<Route exact path={routes.LOGIN} component={Login} />
						<Route exact path={routes.LOGOUT} component={Logout} />
						<Route exact path={routes.SIGNUP} component={SignUp} />
						<Route exact path={routes.FORGOT_PASSWORD} component={ForgotPassword} />
						<Route exact path={routes.RESET_PASSWORD} component={ResetPassword} />
						<Route exact path={routes.LOCATIONS} component={Locations} />
						<Route exact path={routes.LOCATIONS_MAP} component={LocationsMap} />
						<Route exact path={routes.LOCATION} component={Location} />
						<Route exact path={routes.CALENDAR} component={Calendar} />
						<Route exact path={routes.DEV} component={Dev} />
						<Route exact path={routes.MEMBERS} component={Members} />
						<Route exact path={routes.MEMBER} component={Member} />
						<Route exact path={routes.EVENTS} component={Events} />
						<Route exact path={routes.EVENT} component={Event} />
						<ProtectedRoute
							token={token}
							user={user}
							exact
							path={routes.EDIT_PROFILE}
							component={EditProfile}
						/>
						<ProtectedRoute
							token={token}
							user={user}
							exact
							path={routes.CREATE_EVENT}
							type="create"
							component={EditCreateEvent}
						/>
						<ProtectedRoute
							token={token}
							user={user}
							exact
							path={routes.EDIT_EVENT}
							type="edit"
							component={EditCreateEvent}
						/>
						<ProtectedRoute
							token={token}
							user={user}
							exact
							path={routes.CHECKIN_EVENT}
							roles={['events']}
							component={EventCheckin}
						/>
						<ProtectedRoute
							token={token}
							user={user}
							exact
							path={routes.CREDENTIALS}
							roles={['credentials']}
							component={Credentials}
						/>
						<ProtectedRoute
							token={token}
							user={user}
							exact
							path={routes.PERMISSIONS}
							roles={['permissions']}
							component={Permissions}
						/>
						<ProtectedRoute
							token={token}
							user={user}
							exact
							path={routes.PERMISSION}
							roles={['permissions']}
							component={Permission}
						/>
						<ProtectedRoute
							token={token}
							user={user}
							exact
							path={routes.ANVIL_WIFI}
							component={AnvilWifi}
						/>
						<Route component={NotFound} />
					</Switch>
				</div>
				<Footer />
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default withRouter(
	connect(
		mapStateToProps,
		{ storageChanged, clearFlashMessages, fetchProfile }
	)(App)
);
