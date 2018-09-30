import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import App from './components/App';
import 'sanitize.css/sanitize.css';
import './index.css';

if (process.env.NODE_ENV !== 'development') {
	console.log = () => {};
	console.warn = () => {};
	console.error = () => {};
}

render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<App />
		</ConnectedRouter>
	</Provider>,
	document.getElementById('root')
);
