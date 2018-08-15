import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { EventTable, Header } from '../Common';
import routes, { hasPermission } from '../../constants';
import { fetchEvents } from '../../actions';

// TODO: Implement pagination
// TODO: Implement permissions

class EventsPage extends Component {
	static propTypes = {
		history: PropTypes.shape({
			push: PropTypes.func
		}).isRequired,
		user: PropTypes.object
	};

	static defaultProps = {
		user: null
	};

	constructor(props) {
		super(props);
		this.state = {
			events: [],
			loading: true,
			allowed: hasPermission(this.props.user, 'events') || false
		};
	}

	componentDidMount = async () => {
		const { events } = await fetchEvents({});
		console.log('EventsPage fetched events:', events);
		this.setState({ events, loading: false });
	};

	render() {
		const { events, loading, allowed } = this.state;
		return (
			<div className="section">
				<div className="section-container">
					<Header message="Events" />
					<h3>
						Events
						{/* <Link to={routes.HACKATHONS} className="pull-left">
							<button type="button" className="btn btn-info btn-sm marginR">
								Upcoming Hackathons
							</button>
						</Link> */}
						<a href="https://goo.gl/forms/hAhYgXes2zQeftbR2" className="pull-right">
							<button type="button" className="btn btn-primary btn-sm marginR ">
								Submit Event Suggestion
							</button>
						</a>
						{allowed && (
							<React.Fragment>
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
							</React.Fragment>
						)}
					</h3>
					{loading ? (
						<span>Loading...</span>
					) : (
						<EventTable events={events} push={this.props.history.push} allowed={allowed} />
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default connect(
	mapStateToProps,
	{}
)(EventsPage);
