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
import About from '../About';
import Login from '../Login';
import NotFound from '../404';

fontawesome.library.add(faFacebook, faGithub, faTwitter, faEnvelope, faCalendar, faCoffee, faHeart);

class App extends Component {
	static propTypes = {
		token: PropTypes.string,
		user: PropTypes.object // eslint-disable-line
	};

	static defaultProps = {
		token: '',
		user: null
	};

	constructor(props) {
		super(props);
		console.log('App props:', this.props);
	}

	render() {
		const { token, user } = this.props;
		return (
			<div>
				<Navigation auth={!!this.props.token} />
				<div className="pageWrap">
					<Switch>
						<Route exact path={routes.HOME} component={Home} />
						<Route exact path={routes.ABOUT} component={About} />
						<Route exact path={routes.LOGIN} component={Login} />
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

export default withRouter(connect(mapStateToProps)(App));
