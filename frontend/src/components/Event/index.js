import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { hasPermission, formatDate } from '../../constants';
import { sendFlashMessage, clearFlashMessages, fetchEvent } from '../../actions';
import { MembersAttendedTable, CustomRedirect } from '../Common';

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
			notFound: false
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
			event ? this.setState({ event }) : this.setState({ notFound: true });
		} catch (error) {
			this.setState({ notFound: true });
			flash(error.error);
		}
	};

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	render() {
		const { event, notFound } = this.state;
		const { user } = this.props;
		if (notFound) return <CustomRedirect msgRed="Event not found" />;
		if (!event) return <span>Loading...</span>;
		// if (event.privateEvent && )
		return (
			<div>
				<Helmet>
					<title>{event.name.substr(0, 30)}</title>
				</Helmet>
				<div className="section">
					<div className="section-container">
						<h3>{event.name.substr(0, 30)}</h3>
						<div className="panel panel-default text-left">
							<div className="panel-body">
								<div id="profile_intro_text">
									<div id="profile_name">{event.name}</div>
									<div id="profile_email">Location: {event.location}</div>
									<div id="profile_major">{formatDate(event.event_time)}</div>
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
						{hasPermission(user, 'events') && (
							<button type="button" className="btn btn-danger btn-sm">
								Delete Event
							</button>
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

export default connect(mapStateToProps, { flash: sendFlashMessage, clear: clearFlashMessages })(
	EventPage
);
