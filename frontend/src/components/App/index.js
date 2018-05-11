import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import fontawesome from '@fortawesome/fontawesome';
import { faFacebook, faGithub, faTwitter } from '@fortawesome/fontawesome-free-brands';
import { faEnvelope, faCalendar, faCoffee, faHeart } from '@fortawesome/fontawesome-free-solid';
import PropTypes from 'prop-types';
import routes from '../../constants';
import { ProtectedRoute } from '../Common';
import Navigation from '../Navigation';
import Footer from '../Footer';
import Home from '../Home';
import Members from '../Members';
import Login from '../Login';
import Logout from '../Logout';
import SignUp from '../Signup';
import NotFound from '../404';
import { localStorageChanged } from '../../actions';

fontawesome.library.add(faFacebook, faGithub, faTwitter, faEnvelope, faCalendar, faCoffee, faHeart);

class App extends Component {
	static propTypes = {
		token: PropTypes.string,
		user: PropTypes.object, // eslint-disable-line
		localStorageChanged: PropTypes.func
	};

	static defaultProps = {
		token: '',
		user: null,
		localStorageChanged: null
	};

	constructor(props) {
		super(props);
		window.addEventListener('storage', this.props.localStorageChanged);
		console.log('App props:', this.props);
	}

	render() {
		const { token, user } = this.props;
		return (
			<div>
				<Navigation auth={!!token} />
				<div className="pageWrap">
					<Switch>
						<Route exact path={routes.HOME} component={Home} />
						<Route exact path={routes.LOGIN} component={Login} />
						<Route exact path={routes.LOGOUT} component={Logout} />
						<Route exact path={routes.SIGNUP} component={SignUp} />
						<ProtectedRoute
							token={token}
							user={user}
							exact
							path={routes.MEMBERS}
							component={Members}
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

export default withRouter(connect(mapStateToProps, { localStorageChanged })(App));
