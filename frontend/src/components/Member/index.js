import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import routes, { memberMatches } from '../../constants';
import {
	fetchMember,
	fetchMemberEvents,
	fetchMemberLocations,
	sendFlashMessage
} from '../../actions';
import { SocialMediaPanel, EventsAttendedTable, ProfilePanel, CustomRedirect } from '../Common';

class MemberPage extends Component {
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
		user: PropTypes.shape({
			permissions: PropTypes.array
		}).isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			member: null,
			events: [],
			locations: [],
			memberMatched: memberMatches(this.props.user, this.props.match.params.id),
			notFound: false
		};
		console.log('MemberPage props:', this.props);
	}

	componentDidMount = () => {
		const {
			match: {
				params: { id }
			},
			flash
		} = this.props;
		fetchMember(id)
			.then(member => {
				console.log('MemberPage fetched member:', member);
				member ? this.setState({ member }) : this.setState({ notFound: true });
			})
			.catch(() => this.setState({ notFound: true }));

		fetchMemberEvents(id)
			.then(events => {
				console.log('MemberPage fetched events:', events);
				this.setState({ events });
			})
			.catch(err => flash(err.error));
		fetchMemberLocations(id)
			.then(locations => {
				console.log('MemberPage fetched locations:', locations);
				this.setState({ locations });
			})
			.catch(err => flash(err.error));
	};

	onEventClick = id => () => this.props.history.push(`/event/${id}`);

	render() {
		const { member, events, locations, memberMatched, notFound } = this.state;
		if (notFound) return <CustomRedirect msgRed="Error. Member not found" />;
		if (!member) return null;
		return (
			<div>
				<Helmet>
					<title>{member.name} -- Purdue Hackers</title>
				</Helmet>
				<div className="section">
					<div className="section-container">
						<h3>
							Member - {member.name}
							{memberMatched && (
								<React.Fragment>
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
								</React.Fragment>
							)}
						</h3>

						<ProfilePanel
							member={member}
							events={events ? events.length : 0}
							locations={locations ? locations.length : 0}
						/>

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
											<tr key={i} onClick={`/location/${location.location._id}`}>
												<td>{location.location.name}</td>
												<td>{location.location.city}</td>
												<td>{location.dateStart}</td>
												<td>
													{location.dateEnd ? location.dateEnd : 'Current'}
													{memberMatched && (
														<a href="" className="btn btn-sm btn-danger pull-right">
															Remove
														</a>
													)}
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

									{memberMatched && (
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
									)}
								</tbody>
							</table>
						</div>

						<hr />

						<h3>Events Attended</h3>
						<EventsAttendedTable events={events} push={this.props.history.push} />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default connect(mapStateToProps, { flash: sendFlashMessage })(MemberPage);
