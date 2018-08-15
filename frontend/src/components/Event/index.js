import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { hasPermission, formatDate, shortName, err } from '../../constants';
import { sendFlashMessage, clearFlashMessages, fetchEvent } from '../../actions';
import { MembersAttendedTable, CustomRedirect, Header } from '../Common';

// TODO: Add autocomplete to input tags

class EventPage extends Component {
	static propTypes = {
		match: PropTypes.shape({
			params: PropTypes.shape({
				id: PropTypes.string
			})
		}).isRequired,
		flash: PropTypes.func.isRequired,
		clear: PropTypes.func.isRequired,
		user: PropTypes.object
	};

	static defaultProps = {
		user: null
	};

	constructor(props) {
		super(props);
		this.state = {
			event: null,
			loading: true
		};
		console.log('EventPage props:', this.props);
	}

	componentDidMount = async () => {
		const {
			match: {
				params: { id }
			},
			flash,
			clear
		} = this.props;
		try {
			clear();
			const event = await fetchEvent(id);
			this.setState({ event, loading: false });
		} catch (error) {
			this.setState({ loading: false });
			flash(err(error));
		}
	};

	componentWillReceiveProps = async nextProps => {
		const {
			match: {
				params: { id }
			},
			flash,
			clear
		} = nextProps;
		try {
			clear();
			const event = await fetchEvent(id);
			this.setState({ event, loading: false });
		} catch (error) {
			this.setState({ loading: false });
			flash(err(error));
		}
	};

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	render() {
		const { event, loading } = this.state;
		const { user } = this.props;
		if (loading) return <span>Loading...</span>;
		if (!loading && !event) return <CustomRedirect msgRed="Event not found" />;
		if (event.privateEvent && !hasPermission(user, 'events'))
			return <CustomRedirect msgRed="You are not authorized to view this event" />;
		return (
			<div>
				<Header message={shortName(event.name)} />
				<div className="section">
					<div className="section-container">
						<h3>
							{shortName(event.name)}
							<Link key={`${event._id}-1`} to="/events">
								<button type="button" className="pull-left btn btn-primary btn-sm marginR">
									<span className="glyphicon glyphicon-chevron-left" aria-hidden="true" />
									Events
								</button>
							</Link>
							{hasPermission(user, 'events') && [
								<Link key={`${event._id}-2`} to={`/event/${event._id}/edit`}>
									<button
										type="button"
										className="pull-right marginR btn btn-primary btn-sm"
									>
										Edit Event
									</button>
								</Link>,
								<Link key={`${event._id}-3`} to={`/event/${event._id}/checkin`}>
									<button
										type="button"
										className="pull-right marginR btn btn-primary btn-sm"
									>
										Checkin
									</button>
								</Link>
							]}
						</h3>
						<div className="panel panel-default text-left">
							<div className="panel-body">
								<div id="profile_intro_text">
									<div id="profile_name">{event.name}</div>
									<div id="profile_email">Location: {event.location}</div>
									<div id="profile_major">{formatDate(event.eventTime)}</div>
									{event.facebook && (
										<a href={event.facebook}>
											{event.facebook}
											<br />
										</a>
									)}
								</div>
							</div>
						</div>
						<hr />
						{event.members && event.members.length ? (
							<MembersAttendedTable members={event.members} />
						) : (
							<h3>No Members attended</h3>
						)}
					</div>
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
	{ flash: sendFlashMessage, clear: clearFlashMessages }
)(EventPage);
