import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import fontawesome from '@fortawesome/fontawesome';
import { faFacebook, faGithub, faTwitter } from '@fortawesome/fontawesome-free-brands';
import { faEnvelope, faCalendar, faCoffee, faHeart } from '@fortawesome/fontawesome-free-solid';
import routes from '../constants';
import Navigation from '../Navigation';
import Footer from '../Footer';
import Home from '../Home';
import About from '../About';
import NotFound from '../404';

fontawesome.library.add(faFacebook, faGithub, faTwitter, faEnvelope, faCalendar, faCoffee, faHeart);

class App extends Component {
	render() {
		return (
			<div>
				<Navigation />
				<Switch>
					<Route exact path={routes.HOME} component={Home} />
					<Route exact path={routes.ABOUT} component={About} />
					<Route component={NotFound} />
				</Switch>
				<Footer />
			</div>
		);
	}
}

export default App;
