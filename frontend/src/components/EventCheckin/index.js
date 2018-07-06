import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// import Downshift from 'downshift';
import { hasPermission, shortName } from '../../constants';
import { sendFlashMessage, clearFlashMessages, fetchEvent, checkinEvent } from '../../actions';
import { CustomRedirect } from '../Common';

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
			loading: true,
			name: '',
			email: '',
			graduationYear: 0
			// membersFromName: [],
			// membersFromEmail: []
		};
		console.log('EventCheckinPage props:', this.props);
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

	checkinMember = async e => {
		e.preventDefault();
		const { name, email, event } = this.state;
		const { flash } = this.props;
		try {
			if (!event) return flash('Event does not exist');
			await checkinEvent(event._id, name, email);
			this.setState({
				name: '',
				email: '',
				graduationYear: 0
			});
			return flash(`Checked in member: ${name}`, 'green');
		} catch (error) {
			console.error('EventCheckinPage error:', error);
			return flash(error.error);
		}
	};

	render() {
		const {
			event,
			loading,
			name,
			email,
			graduationYear
			// membersFromName,
			// membersFromEmail
		} = this.state;
		const { user } = this.props;
		if (loading) return <span>Loading...</span>;
		if (!loading && !event) return <CustomRedirect msgRed="Event not found" />;
		if (event.privateEvent && !hasPermission(user, 'events'))
			return <CustomRedirect msgRed="You are not authorized to view this page" />;
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
										Name:
									</span>
									<input
										type="text"
										id="name"
										name="name"
										className="form-control membersautocomplete"
										placeholder="Member Name"
										value={name}
										onChange={this.onChange}
										pattern="[a-zA-Z]+ [a-zA-Z ]+"
										title="Please enter first and last name"
										required
									/>
									<span className="input-group-btn">
										<button
											className="btn btn-primary"
											type="button"
											onClick={this.checkinMember}
										>
											Checkin
										</button>
									</span>
								</div>
								<br />
								<div className="input-group">
									<span className="input-group-addon" id="memberEmailTitle">
										Email:
									</span>
									<input
										type="text"
										id="email"
										name="email"
										className="form-control membersautocomplete"
										placeholder="Member Email"
										data-bvalidator="required,email"
										data-bvalidator-msg="An email is required for your account."
										value={email}
										onChange={this.onChange}
									/>
								</div>
								<br />
								<div className="input-group">
									<span className="input-group-addon" id="graduationYearTitle">
										Graduation Year:
									</span>
									<input
										type="text"
										id="graduationYear"
										className="form-control"
										readOnly
										value={graduationYear}
									/>
								</div>
								<br />
								<button
									className="btn btn-primary"
									type="button"
									onClick={this.checkinMember}
									style={{ float: 'center' }}
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
