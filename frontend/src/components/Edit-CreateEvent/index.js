import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { hasPermission, shortName, err } from '../../constants';
import {
	sendFlashMessage,
	clearFlashMessages,
	fetchEvent,
	createEvent,
	updateEvent,
	deleteEvent
} from '../../actions';
import { CustomRedirect, Header } from '../Common';

// TODO: Add autocomplete to input tags

class EditEventPage extends Component {
	static propTypes = {
		match: PropTypes.shape({
			params: PropTypes.shape({
				id: PropTypes.string
			})
		}).isRequired,
		history: PropTypes.shape({
			push: PropTypes.func
		}).isRequired,
		flash: PropTypes.func.isRequired,
		clear: PropTypes.func.isRequired,
		user: PropTypes.object,
		type: PropTypes.string.isRequired
	};

	static defaultProps = {
		user: null
	};

	constructor(props) {
		super(props);
		let date = new Date();
		date.setMinutes(0 - date.getTimezoneOffset());
		date = date.toJSON().slice(0, 10);
		this.state = {
			event: null,
			loading: true,
			name: '',
			privateEvent: false,
			date,
			hour: '',
			minute: '',
			location: '',
			facebook: ''
		};
		console.log('EditEventPage props:', this.props);
	}

	componentDidMount = async () => {
		const { match, flash, clear, type } = this.props;
		if (type !== 'edit') return this.setState({ loading: false });
		try {
			clear();
			const event = await fetchEvent(match.params.id);
			let date = new Date(event.eventTime);
			const hour = date.getHours();
			const minute = date.getMinutes() || '00';
			date.setMinutes(minute - date.getTimezoneOffset());
			date = date.toJSON().slice(0, 10);
			const { name, privateEvent, location, facebook } = event;
			this.setState({
				event,
				hour,
				minute,
				name,
				privateEvent,
				date,
				location,
				facebook,
				loading: false
			});

			return console.log('Fetched event:', event);
		} catch (error) {
			console.log('Edit Event Page error:', error);
			this.setState({ loading: false });
			return flash(err(error));
		}
	};

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	onSubmit = async e => {
		e.preventDefault();
		const { match, flash, clear, history, type } = this.props;
		try {
			clear();
			const { name, privateEvent, hour, minute, date, location, facebook } = this.state;
			if (!name) return flash('Event requires name');
			if (!date) return flash('Event requires date');
			if (!hour || !minute) return flash('Event requires time');
			if (!location) return flash('Event requires location');
			if (facebook && !facebook.match('((http|https)://)?(www[.])?facebook.com.*'))
				return flash('Must specify a url from Facebook');

			const eventTime = new Date(`${date} ${hour}:${minute}`);
			const event = {
				name,
				privateEvent,
				eventTime,
				location,
				facebook
			};
			if (type === 'edit') {
				const newEvent = await updateEvent(match.params.id, event);
				console.log('Updated event:', newEvent);
				this.setState({ event: newEvent });
				return flash('Event successfully updated', 'green');
			}

			const newEvent = await createEvent(event);
			console.log('Created new event:', newEvent);
			history.push('/events');
			return flash('Event created', 'green');
		} catch (error) {
			console.log('Edit Event Page error:', error);
			return flash(err(error));
		}
	};

	onDeleteEvent = async e => {
		e.preventDefault();
		const { match, flash, clear, history } = this.props;
		try {
			clear();
			const event = await deleteEvent(match.params.id);
			console.log('Deleted event:', event);
			history.push('/events');
			return flash('Successfully deleted event', 'green');
		} catch (error) {
			console.log('Edit Event Page error:', error);
			return flash(err(error));
		}
	};

	render() {
		const {
			event,
			loading,
			name,
			privateEvent,
			hour,
			minute,
			date,
			location,
			facebook
		} = this.state;
		const { user, type } = this.props;
		if (loading) return <span>Loading...</span>;
		if (!loading && !event && type === 'edit') return <CustomRedirect msgRed="Event not found" />;
		if (!hasPermission(user, 'events'))
			return <CustomRedirect msgRed="You are not authorized to edit this event" />;
		const canEdit = type === 'edit' && hasPermission(user, 'events');
		return (
			<div>
				<Header message={shortName(name)} />
				<div className="section">
					<div className="section-container">
						<h3>
							{shortName(name)}
							{canEdit && (
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
												id="date"
												placeholder="Date"
												value={date}
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
									value={`${type === 'edit' ? 'Update' : 'Create'} Event`}
									className="btn btn-primary"
									onClick={this.onSubmit}
								/>
							</form>
						</div>
						<hr />
					</div>
					{canEdit && (
						<button
							type="button"
							className="btn btn-danger btn-sm"
							onClick={this.onDeleteEvent}
						>
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

export default connect(
	mapStateToProps,
	{ flash: sendFlashMessage, clear: clearFlashMessages }
)(EditEventPage);
