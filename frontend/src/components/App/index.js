import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import fontawesome from '@fortawesome/fontawesome';
import { faFacebook, faGithub, faTwitter } from '@fortawesome/fontawesome-free-brands';
import { faEnvelope, faCalendar, faCoffee, faHeart } from '@fortawesome/fontawesome-free-solid';
import PropTypes from 'prop-types';
import routes from '../../constants';
import { ProtectedRoute, NotFound, Footer, FlashMessage, Navigation } from '../Common';
import Home from '../Home';
import Members from '../Members';
import Member from '../Member';
import Events from '../Events';
import Calendar from '../Calendar';
import AnvilWifi from '../AnvilWifi';
import Dev from '../Dev';
import Login from '../Login';
import Logout from '../Logout';
import SignUp from '../Signup';
import { localStorageChanged, clearFlashMessages } from '../../actions';

fontawesome.library.add(faFacebook, faGithub, faTwitter, faEnvelope, faCalendar, faCoffee, faHeart);

class App extends Component {
	static propTypes = {
		token: PropTypes.string,
		user: PropTypes.object,
		history: PropTypes.shape({
			listen: PropTypes.func
		}).isRequired,
		clearFlashMessages: PropTypes.func.isRequired,
		localStorageChanged: PropTypes.func.isRequired
	};

	static defaultProps = {
		token: null,
		user: null
	};

	constructor(props) {
		super(props);
		window.addEventListener('storage', this.props.localStorageChanged);
		this.props.history.listen(() => this.props.clearFlashMessages());
		console.log('App props:', this.props);
	}

	render() {
		const { token, user } = this.props;
		return (
			<div>
				<Navigation auth={!!token} id={user ? user._id : null} />
				<div className="pageWrap">
					<FlashMessage />
					<Switch>
						<Route exact path={routes.HOME} component={Home} />
						<Route exact path={routes.LOGIN} component={Login} />
						<Route exact path={routes.LOGOUT} component={Logout} />
						<Route exact path={routes.SIGNUP} component={SignUp} />
						<Route exact path={routes.CALENDAR} component={Calendar} />
						<Route exact path={routes.DEV} component={Dev} />
						<Route exact path={routes.MEMBERS} component={Members} />
						<Route exact path={routes.MEMBER} component={Member} />
						<Route exact path={routes.EVENTS} component={Events} />
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
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default withRouter(
	connect(mapStateToProps, { localStorageChanged, clearFlashMessages })(App)
);
