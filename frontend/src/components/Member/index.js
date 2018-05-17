import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import routes from '../../constants';
import { fetchMember, fetchMemberEvents, fetchMemberLocations } from '../../actions';
import SocialMediaPanel from '../Common/SocialMediaPanel';

class MemberPage extends Component {
	static propTypes = {
		match: PropTypes.shape({
			params: PropTypes.shape({
				id: PropTypes.string
			})
		}),
		history: PropTypes.shape({
			push: PropTypes.func
		})
	};

	static defaultProps = {
		match: null,
		history: null
	};

	constructor(props) {
		super(props);
		this.state = {
			member: null,
			events: [],
			locations: [],
			profle: this.props.match.params === this.props.user._id,
			permissions: this.props.user.permissions
		};
		console.log('MemberPage props:', this.props);
	}

	componentDidMount = () => {
		const { id } = this.props.match.params;
		fetchMember(id)
			.then(member => {
				console.log('MemberPage fetched member:', member);
				this.setState({ member });
			})
			.catch(error => this.setState({ error }));

		fetchMemberEvents(id)
			.then(events => {
				console.log('MemberPage fetched events:', events);
				this.setState({ events });
			})
			.catch(error => this.setState({ error }));
		fetchMemberLocations(id)
			.then(locations => {
				console.log('MemberPage fetched locations:', locations);
				this.setState({ locations });
			})
			.catch(error => this.setState({ error }));
	};

	onEventClick = id => () => this.props.history.push(`/event/${id}`);

	render() {
		const { member, events, locations } = this.state;
		if (!member) return <div>Loading...</div>;
		return (
			<div>
				<Helmet>
					<title>{member.name} -- Purdue Hackers</title>
				</Helmet>
				<div className="section">
					<div className="section-container">
						<h3>
							Member - {member.name}
							<Link to={`/members/${member._id}`} className="pull-right">
								<button type="button" className="btn btn-primary btn-sm">
									Edit Profile
								</button>
							</Link>
							<Link to={routes.PROJECTS} className="pull-left">
								<button type="button" className="btn btn-primary btn-sm">
									Projects
								</button>
							</Link>
						</h3>

						<div className="panel panel-default text-left">
							<div className="panel-body">
								{member.picture && (
									<img src={member.picture} id="profile_image" alt="Profile Pic" />
								)}
								<div id="profile_intro_text">
									<div id="profile_name">{member.name}</div>
									{member.email_public && (
										<a id="profile_email" href={`mailto:${member.email_public}`}>
											{member.email_public}
										</a>
									)}
									<div id="profile_major">
										{member.major ? member.major : ''} Class of {member.graduation_year}
									</div>
									<div id="profile_badges">
										<div className="profile_badge">
											<div className="profile_badge_title">Events</div>
											{events && events.length}
										</div>
										<div className="profile_badge">
											<div className="profile_badge_title">Projects</div>
											{member.projects ? member.projects.length : 0}
										</div>
										<div className="profile_badge">
											<div className="profile_badge_title">Jobs</div>
											{locations && locations.length}
										</div>
									</div>
								</div>
							</div>
						</div>
						{member.description && (
							<div className="panel panel-default text-left">
								<div className="panel-body">
									{member.description.split('\\\n').map((item, key) => (
										<span key={key}>
											{item}
											<br />
										</span>
									))}
								</div>
							</div>
						)}

						{(member.facebook ||
							member.github ||
							member.linkedin ||
							member.devpost ||
							member.website ||
							member.linktoresume) && <SocialMediaPanel member={member} />}

						<hr />

						<h3>Job History</h3>
						<div className="panel panel-default">
							<table className="table table-bordered table-hover table-clickable panel-body">
								<thead>
									<tr>
										<th>Company</th>
										<th>City</th>
										<th>Start Date</th>
										<th>End Date</th>
									</tr>
								</thead>
								<tbody>
									{locations && locations.length ? (
										locations.map((location, i) => (
											<tr key={i} onClick="">
												<td>{location.location.name}</td>
												<td>{location.location.city}</td>
												<td>{location.dateStart}</td>
												<td>
													{location.dateEnd ? location.dateEnd : 'Current'}
													<a href="" className="btn btn-sm btn-danger pull-right">
														Remove
													</a>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td>No Job History</td>
											<td />
											<td />
											<td />
										</tr>
									)}

									<tr>
										<td>
											<input
												type="text"
												name="locationName"
												id="locationName"
												placeholder="Location Name"
												className="form-control locationsautocomplete"
											/>
										</td>
										<td>
											<input
												type="text"
												name="city"
												id="city"
												placeholder="City"
												className="form-control citiesautocomplete"
											/>
										</td>
										<td>
											<input
												type="text"
												name="date_start"
												id="date_start"
												placeholder="Start Date"
												className="form-control datepicker"
											/>
										</td>
										<td>
											<input
												type="text"
												name="date_end"
												id="date_end"
												placeholder="End Date (Optional)"
												className="form-control datepicker"
											/>
											<br />
											<input
												type="submit"
												value="Add Location Record"
												className="btn btn-primary pull-right"
											/>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<hr />

						<h3>Events Attended</h3>
						<div className="panel panel-default">
							<table className="table table-bordered table-hover table-clickable panel-body">
								<thead>
									<tr>
										<th>Event</th>
										<th>Date</th>
									</tr>
								</thead>
								<tbody>
									{events && events.length ? (
										events.map((event, i) => (
											<tr key={i} onClick={this.onEventClick(event._id)}>
												<td>{event.name}</td>
												<td>{event.event_time}</td>
											</tr>
										))
									) : (
										<tr>
											<td>No Events Attended</td>
											<td />
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default connect(mapStateToProps, {})(MemberPage);
