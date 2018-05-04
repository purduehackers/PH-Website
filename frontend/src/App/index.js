import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from '../constants';
import Navigation from '../Navigation';
import Home from '../Home';
import About from '../About';
import NotFound from '../404';

const App = () => (
	<div>
		<Navigation />
		<Switch>
			<Route exact path={routes.HOME} component={Home} />
			<Route exact path={routes.ABOUT} component={About} />
			<Route component={NotFound} />
		</Switch>
		<hr />
	</div>
);

export default App;
