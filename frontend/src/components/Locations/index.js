import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import routes from '../../constants';
import { sendFlashMessage, clearFlashMessages, fetchLocations } from '../../actions';
import { Header } from '../Common';

class LocationsPage extends Component {
	static propTypes = {
		flash: PropTypes.func.isRequired,
		clear: PropTypes.func.isRequired,
		history: PropTypes.shape({
			push: PropTypes.func
		}).isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			locations: []
		};
	}

	componentDidMount = async () => {
		const { flash, clear } = this.props;
		try {
			clear();
			const locations = await fetchLocations();
			console.log('Fetched locations:', locations);
			this.setState({ locations });
		} catch (error) {
			flash('Whoops! Something went wrong!');
			console.error('LocationsPage error:', error);
		}
	};

	onClick = id => () => this.props.history.push(`/location/${id}`);

	render() {
		const { locations } = this.state;
		return (
			<div className="section">
				<div className="section-container">
					<Header message="Locations" />
					<h3>
						Purdue Hackers Around The Globe
						<Link to={routes.LOCATIONS_MAP} className="pull-right">
							<button type="button" className="btn btn-primary btn-sm">
								Map
							</button>
						</Link>
					</h3>
					<div className="panel panel-default">
						<table className="table table-bordered table-hover table-clickable panel-body sortableTable">
							<thead>
								<tr>
									<th>Location</th>
									<th>City</th>
									<th># Members</th>
								</tr>
							</thead>
							<tbody>
								{locations.map(location => (
									<tr key={location._id} onClick={this.onClick(location._id)}>
										<td>{location.name}</td>
										<td>{location.city}</td>
										<td>{location.members.length}</td>
									</tr>
								))}
							</tbody>
						</table>
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
)(LocationsPage);
