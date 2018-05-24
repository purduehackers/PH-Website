import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { hasPermission, shortName } from '../../constants';
import { sendFlashMessage, clearFlashMessages, fetchEvent } from '../../actions';
import { MembersAttendedTable, CustomRedirect } from '../Common';

// TODO: Add autocomplete to input tags

class EditEventPage extends Component {
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
			loading: true,
			name: '',
			privateEvent: false,
			time: null,
			hour: '-',
			minute: '-',
			location: '',
			facebook: ''
		};
		console.log('EditEventPage props:', this.props);
	}

	componentDidMount = async () => {
		const { match, flash, clear } = this.props;
		try {
			clear();
			const event = await fetchEvent(match.params.id);
			let time = new Date(event.event_time);
			const hour = time.getHours();
			const minute = time.getMinutes() || '00';
			time.setMinutes(minute - time.getTimezoneOffset());
			time = time.toJSON().slice(0, 10);
			const { name, privateEvent, location, facebook } = event;
			this.setState({
				event,
				hour,
				minute,
				name,
				privateEvent,
				time,
				location,
				facebook,
				loading: false
			});

			console.log('Fetched event:', event);
		} catch (error) {
			console.log('Edit Event Page error:', error);
			flash(error.message || error.error);
		}
	};

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	onSubmit = async e => {
		e.preventDefault();
		console.log('About to change event to:', this.state);
	};

	render() {
		const {
			event,
			loading,
			name,
			privateEvent,
			hour,
			minute,
			time,
			location,
			facebook
		} = this.state;
		const { user } = this.props;
		if (loading) return <span>Loading...</span>;
		if (!loading && !event) return <CustomRedirect msgRed="Event not found" />;
		if (!hasPermission(user, 'events'))
			return <CustomRedirect msgRed="You are not authorized to edit this event" />;
		return (
			<div>
				<Helmet>
					<title>{shortName(name)}</title>
				</Helmet>
				<div className="section">
					<div className="section-container">
						<h3>
							{shortName(name)}
							{hasPermission(user, 'events') && (
								<Link to={`/event/${event._id}`}>
									<button
										type="button"
										className="pull-left btn btn-primary btn-sm marginR"
									>
										<span
											className="glyphicon glyphicon-chevron-left"
											aria-hidden="true"
										/>
										Event
									</button>
								</Link>
							)}
						</h3>
						<div className="panel panel-default">
							<form className="panel-body validate">
								<label htmlFor="privateEvent" className="text-right">
									Private Event ?
									<div className="input-group">
										<span className="input-group-addon" id="eventNameAria">
											Event Name
										</span>
										<input
											type="text"
											id="name"
											placeholder="Event Name"
											value={name}
											className="form-control"
											data-bvalidator="required"
											data-bvalidator-msg="Event requires name."
											aria-describedby="eventNameAria"
											onChange={this.onChange}
										/>

										<span className="input-group-addon" id="privateEventAria">
											<input
												type="checkbox"
												name="privateEvent"
												id="privateEvent"
												value="true"
												checked={!!privateEvent}
												onChange={() =>
													this.setState({ privateEvent: !this.state.privateEvent })
												}
											/>
										</span>
									</div>
								</label>
								<br />

								<div className="form-inline">
									<div className="form-group pull-left">
										<label htmlFor="date">
											Date
											<input
												type="date"
												name="date"
												id="time"
												placeholder="Date"
												value={time}
												className="form-control datepicker"
												data-bvalidator="required,date[yyyy-mm-dd]"
												data-bvalidator-msg="Event requires date/time."
												onChange={this.onChange}
											/>
										</label>
									</div>
									<div className="form-group pull-right">
										<label htmlFor="Time">
											Time
											<select
												name="hour"
												id="hour"
												value={hour}
												className="form-control"
												data-bvalidator="required"
												data-bvalidator-msg="Event requires date/time."
												onChange={this.onChange}
											>
												<option value="">Hour</option>
												{[...Array(24).keys()].map((i, key) => (
													<option value={i} key={key}>
														{i}
													</option>
												))}
											</select>
											<select
												name="minute"
												id="minute"
												value={minute}
												className="form-control"
												data-bvalidator="required"
												data-bvalidator-msg="Event requires date/time."
												onChange={this.onChange}
											>
												<option value="">Minute</option>
												{[0, 15, 30, 45].map((i, key) => (
													<option value={`${i}`.padStart(2, '0')} key={key}>
														{`${i}`.padStart(2, '0')}
													</option>
												))}
											</select>
										</label>
									</div>
								</div>
								<br />
								<label htmlFor="location">
									Location
									<input
										type="text"
										name="location"
										id="location"
										placeholder="Location"
										value={location}
										className="form-control"
										data-bvalidator="required"
										data-bvalidator-msg="Event requires location."
										onChange={this.onChange}
									/>
								</label>
								<br />
								<label htmlFor="facebook">
									Facebook Event URL
									<input
										type="url"
										name="facebook"
										id="facebook"
										placeholder="Facebook Event URL"
										value={facebook}
										className="form-control"
										data-bvalidator="url"
										onChange={this.onChange}
									/>
								</label>
								<br />
								<input
									type="submit"
									value="Update Event"
									className="btn btn-primary"
									onClick={this.onSubmit}
								/>
							</form>
						</div>
						<hr />
						{event.members && event.members.length ? (
							<MembersAttendedTable members={event.members} />
						) : (
							<h3>No Members attended</h3>
						)}
					</div>
					{hasPermission(user, 'events') && (
						<button type="button" className="btn btn-danger btn-sm">
							Delete Event
						</button>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default connect(mapStateToProps, { flash: sendFlashMessage, clear: clearFlashMessages })(
	EditEventPage
);
