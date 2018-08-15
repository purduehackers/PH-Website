import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { memberMatches, formatDate, err } from '../../constants';
import {
	fetchMember,
	fetchMemberEvents,
	fetchMemberJobs,
	addJob,
	deleteJob,
	sendFlashMessage,
	clearFlashMessages
} from '../../actions';
import {
	SocialMediaPanel,
	EventsAttendedTable,
	ProfilePanel,
	CustomRedirect,
	Header
} from '../Common';

// TODO: Add autocomplete to input tags

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
		clear: PropTypes.func.isRequired,
		user: PropTypes.shape({
			permissions: PropTypes.array
		})
	};

	static defaultProps = { user: null };

	constructor(props) {
		super(props);
		this.state = {
			member: null,
			events: [],
			jobs: [],
			memberMatched: memberMatches(this.props.user, this.props.match.params.id),
			notFound: false,
			name: '',
			city: '',
			start: '',
			end: ''
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
			.catch(error => flash(err(error)));
		fetchMemberJobs(id)
			.then(jobs => {
				console.log('MemberPage fetched jobs:', jobs);
				this.setState({ jobs });
			})
			.catch(error => flash(err(error)));
	};

	componentWillReceiveProps = nextProps => {
		const {
			match: {
				params: { id }
			},
			flash
		} = nextProps;
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
			.catch(error => flash(err(error)));
		fetchMemberJobs(id)
			.then(jobs => {
				console.log('MemberPage fetched jobs:', jobs);
				this.setState({ jobs });
			})
			.catch(error => flash(err(error)));
	};

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	onEventClick = id => () => this.props.history.push(`/event/${id}`);

	onJobClick = id => () => this.props.history.push(`/location/${id}`);

	onAddJob = async e => {
		e.preventDefault();
		const { name, city, start, end } = this.state;
		const {
			flash,
			clear,
			match: {
				params: { id }
			}
		} = this.props;
		try {
			clear();
			console.log('About to add new location:', name, city, start.toString(), end);
			if (!name) return flash('Location Name Required.');
			if (!city) return flash('City Required.');
			if (!start) return flash('Start Date Required.');
			const startDate = Date.parse(start);
			const endDate = Date.parse(end);
			if (Number.isNaN(startDate)) return flash('Invalid start date');
			console.log('StartDate:', startDate);
			console.log('EndDate:', endDate);
			if (end) {
				if (Number.isNaN(endDate)) return flash('Invalid end date');
				if (startDate > endDate) return flash('Start date must be before end date');
			}
			flash('Adding Job Record...', 'green');
			const job = await addJob({
				name,
				city,
				start,
				end,
				memberID: id
			});
			console.log('Created job:', job);
			this.setState({
				jobs: [...this.state.jobs, job],
				name: '',
				city: '',
				start: '',
				end: ''
			});
			return flash('Job Record Added!', 'green');
		} catch (error) {
			clear();
			console.error(error);
			return flash(err(error));
		}
	};

	onDeleteJob = async e => {
		e.preventDefault();
		e.stopPropagation();
		const { flash, clear, history, match } = this.props;
		clear();
		try {
			console.log('About to delete job:');
			const job = await deleteJob(e.target.id);
			console.log('Deleted job:', job);
			this.setState({ jobs: this.state.jobs.filter(j => j._id !== job._id) });
			history.push(`/member/${match.params.id}`);
			return flash('Job Record Removed!', 'green');
		} catch (error) {
			console.error(error);
			return flash(err(error));
		}
	};

	render() {
		const { member, events, jobs, memberMatched, notFound, name, city, start, end } = this.state;
		if (notFound) return <CustomRedirect msgRed="Member not found" />;
		if (!member) return <span>Loading...</span>;
		return (
			<div>
				<Header message={member.name} />
				<div className="section">
					<div className="section-container">
						<h3>
							Member - {member.name}
							{memberMatched && (
								<React.Fragment>
									<Link to={`/member/${member._id}/edit`} className="pull-right">
										<button type="button" className="btn btn-primary btn-sm">
											Edit Profile
										</button>
									</Link>
									{/* <Link to={routes.PROJECTS} className="pull-left">
										<button type="button" className="btn btn-primary btn-sm">
											Projects
										</button>
									</Link> */}
								</React.Fragment>
							)}
						</h3>

						<ProfilePanel
							member={member}
							events={events ? events.length : 0}
							jobs={jobs ? jobs.length : 0}
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
									{jobs && jobs.length ? (
										jobs.map((job, i) => (
											<tr key={i} onClick={this.onJobClick(job.location._id)}>
												<td>{job.location.name}</td>
												<td>{job.location.city}</td>
												<td>{formatDate(job.start)}</td>
												<td>
													{job.end ? formatDate(job.end) : 'Current'}
													{memberMatched && (
														<button
															id={job._id}
															className="btn btn-sm btn-danger pull-right"
															onClick={this.onDeleteJob}
														>
															Remove
														</button>
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
													name="name"
													id="name"
													placeholder="Location Name"
													className="form-control locationsautocomplete"
													value={name}
													onChange={this.onChange}
												/>
											</td>
											<td>
												<input
													type="text"
													name="city"
													id="city"
													placeholder="City"
													className="form-control citiesautocomplete"
													value={city}
													onChange={this.onChange}
												/>
											</td>
											<td>
												<input
													type="date"
													name="start"
													id="start"
													placeholder="Start Date"
													className="form-control datepicker"
													value={start}
													onChange={this.onChange}
												/>
											</td>
											<td>
												<input
													type="date"
													name="end"
													id="end"
													placeholder="End Date (Optional)"
													className="form-control datepicker"
													value={end}
													onChange={this.onChange}
												/>
												<br />
												<input
													type="submit"
													value="Add Location Record"
													className="btn btn-primary pull-right"
													onClick={this.onAddJob}
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

export default connect(
	mapStateToProps,
	{ flash: sendFlashMessage, clear: clearFlashMessages }
)(MemberPage);
