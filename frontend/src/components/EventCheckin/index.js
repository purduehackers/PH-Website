import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { hasPermission, formatDate, shortName } from '../../constants';
import { sendFlashMessage, clearFlashMessages, fetchEvent } from '../../actions';
import { MembersAttendedTable, CustomRedirect } from '../Common';

// TODO: Add autocomplete to input tags

class EventCheckinPage extends Component {
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
			flash(error.error);
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
				<Helmet>
					<title>{shortName(event.name)}</title>
				</Helmet>
				<div className="section">
					<div className="section-container">
						<h3>
							{shortName(event.name)}
							<Link key={`${event._id}-1`} to={`/event/${event._id}`}>
								<button type="button" className="pull-left btn btn-primary btn-sm marginR">
									<span className="glyphicon glyphicon-chevron-left" aria-hidden="true" />
									Event
								</button>
							</Link>
						</h3>
						<div className="panel panel-default">
							<div id="checkinForm" className="panel-body validate" autoComplete="off">
								<div className="input-group">
									<span className="input-group-addon" id="memberNameTitle">
										Name:{' '}
									</span>
									<input
										type="text"
										id="memberName"
										name="memberName"
										className="form-control membersautocomplete"
										placeholder="Member Name"
										autoComplete="off"
										data-bvalidator="required"
										data-bvalidator-msg="Please enter your full name"
									/>
									<span className="input-group-btn">
										<button
											className="btn btn-primary"
											type="button"
											onClick="checkinMember();"
										>
											Checkin
										</button>
									</span>
								</div>
								<br />
								<div className="input-group">
									<span className="input-group-addon" id="memberEmailTitle">
										Email:{' '}
									</span>
									<input
										type="text"
										id="memberEmail"
										name="memberEmail"
										className="form-control membersautocomplete"
										placeholder="Member Email"
										data-bvalidator="required,email"
										data-bvalidator-msg="An email is required for your account."
									/>
								</div>
								<br />
								<div className="input-group">
									<span className="input-group-addon" id="memberPhoneTitle">
										Cell Phone #:{' '}
									</span>
									<input
										type="text"
										id="memberPhone"
										name="memberPhone"
										className="form-control membersautocomplete"
										placeholder="Cell Phone Number"
										data-bvalidator="minlength[10]"
										data-bvalidator-msg="Please enter a valid cell phone # (with area code)"
									/>
								</div>
								<span className="pull-left" style={{ fontSize: '9px' }}>
									Your phone number is kept private and is only used for notifications.
								</span>
								<br />
								<div className="input-group">
									<span className="input-group-addon" id="memberAttendedTitle">
										Number Events Attended:{' '}
									</span>
									<input
										type="text"
										id="memberAttended"
										className="form-control"
										readOnly
									/>
									<span id="hasRegistered" className="input-group-btn" />
								</div>
								<br />
								<div className="input-group">
									<span className="input-group-addon" id="graduationYearTitle">
										Graduation Year:{' '}
									</span>
									<input
										type="text"
										id="graduationYear"
										className="form-control"
										readOnly
									/>
								</div>
								<br />
								<button
									className="btn btn-primary"
									type="button"
									onClick="checkinMember();"
									style={{ float: 'right' }}
								>
									Checkin
								</button>
							</div>
						</div>
						<div id="checkinAlerts" />
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
	EventCheckinPage
);
