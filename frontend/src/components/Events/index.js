import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import EventTable from '../Common/EventTable';
import routes from '../../constants';
import { fetchEvents } from '../../actions';

// TODO: Implement pagination
// TODO: Implement permissions

class EventsPage extends Component {
	static propTypes = {
		history: PropTypes.shape({
			push: PropTypes.func
		})
	};

	static defaultProps = {
		history: null
	};

	constructor(props) {
		super(props);
		this.state = {
			events: []
		};
	}

	componentDidMount = async () => {
		const { events } = await fetchEvents({});
		console.log('EventsPage fetched events:', events);
		this.setState({ events });
	};

	render() {
		const { events } = this.state;
		return (
			<div className="section">
				<div className="section-container">
					<h3>
						Events
						<Link to={routes.HACKATHONS} className="pull-left">
							<button type="button" className="btn btn-info btn-sm marginR">
								Upcoming Hackathons
							</button>
						</Link>
						<a href="https://goo.gl/forms/hAhYgXes2zQeftbR2" className="pull-right">
							<button type="button" className="btn btn-primary btn-sm">
								Submit Event Suggestion
							</button>
						</a>
						<Link to={routes.ANVIL_WIFI} className="pull-left">
							<button type="button" className="btn btn-info btn-sm">
								Anvil Wifi
							</button>
						</Link>
						<Link to={routes.CREATE_EVENT} className="pull-right">
							<button type="button" className="btn btn-primary btn-sm marginR">
								+ Add Event
							</button>
						</Link>
					</h3>
					<EventTable events={events} push={this.props.history.push} />
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default connect(mapStateToProps, {})(EventsPage);
