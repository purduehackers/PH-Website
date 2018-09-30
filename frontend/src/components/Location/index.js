import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import routes, { hasPermission, formatDate, err } from '../../constants';
import { sendFlashMessage, clearFlashMessages, fetchLocation, updateLocation } from '../../actions';
import { CustomRedirect, Header } from '../Common';

// TODO: Add autocomplete to input tags

class LocationPage extends Component {
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
		user: PropTypes.object
	};

	static defaultProps = {
		user: null
	};

	constructor(props) {
		super(props);
		this.state = {
			location: null,
			name: '',
			city: '',
			loading: true
		};
		console.log('LocationPage props:', this.props);
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
			const location = await fetchLocation(id);
			console.log('Fetched Location:', location);
			this.setState({ location, ...location, loading: false });
		} catch (error) {
			this.setState({ loading: false });
			flash(err(error));
		}
	};

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	onClick = id => () => this.props.history.push(`/member/${id}`);

	onSubmit = async e => {
		const {
			match: {
				params: { id }
			},
			flash,
			clear
		} = this.props;
		const { name, city } = this.state;
		try {
			e.preventDefault();
			clear();
			if (!name) return flash('Please provide a name');
			if (!city) return flash('Please provide a city');
			const location = await updateLocation(id, name, city);
			this.setState({ name: location.name, city: location.city });
			return flash('Successfully updated location', 'green');
		} catch (error) {
			console.log('Edit Event Page error:', error);
			return flash(err(error));
		}
	};

	render() {
		const { location, name, city, loading } = this.state;
		const { user } = this.props;
		if (loading) return <span>Loading...</span>;
		if (!loading && !location) return <CustomRedirect msgRed="Location not found" />;
		const { members } = location;
		return (
			<div>
				<Header message={location.name} />
				<div className="section">
					<div className="section-container">
						<Header message={location.name} />
						<h3>
							{location.name}
							<Link to={routes.LOCATIONS}>
								<button type="button" className="pull-left btn btn-primary btn-sm marginR">
									<span className="glyphicon glyphicon-chevron-left" aria-hidden="true" />
									List of Locations
								</button>
							</Link>
						</h3>
						<div className="panel panel-default">
							{hasPermission(user, 'admin') ? (
								<form className="panel-body" onSubmit={this.onSubmit}>
									<label htmlFor="name">
										Location Name
										<input
											id="name"
											placeholder="Location Name"
											className="form-control"
											value={name}
											onChange={this.onChange}
										/>
									</label>
									<br />
									<label htmlFor="city">
										Location City
										<input
											id="city"
											placeholder="City"
											className="form-control"
											value={city}
											onChange={this.onChange}
										/>
									</label>
									<br />
									<input
										type="submit"
										value="Update Location"
										className="btn btn-primary"
									/>
								</form>
							) : (
								<div className="panel-body">
									<div id="profile_name">{location.name}</div>
									<div id="profile_major">City: {location.city}</div>
								</div>
							)}
						</div>

						<hr />

						<h3>Members</h3>
						<div className="panel panel-default">
							<table className="table table-bordered table-hover table-clickable panel-body">
								<thead>
									<tr>
										<th>Name</th>
										<th>Start Date</th>
										<th>End Date</th>
									</tr>
								</thead>
								<tbody>
									{members && members.length ? (
										members.map(member => (
											<tr key={member._id} onClick={this.onClick(member.member._id)}>
												<td>{member.member.name}</td>
												<td>{formatDate(member.dateStart)}</td>
												<td>{formatDate(member.dateEnd)}</td>
											</tr>
										))
									) : (
										<tr>
											<td>No Members</td>
											<td />
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

export default connect(
	mapStateToProps,
	{ flash: sendFlashMessage, clear: clearFlashMessages }
)(LocationPage);
