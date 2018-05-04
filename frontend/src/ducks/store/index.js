import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createHistory from 'history/createBrowserHistory';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';


export const history = createHistory();
const enhancers = [];
const middleware = [thunk, routerMiddleware(history), logger];

export default createStore(
	rootReducer,
	composeWithDevTools(
		applyMiddleware(...middleware),
		...enhancers,
	),
);
