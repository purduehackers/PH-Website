import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sendFlashMessage, clearFlashMessages, fetchLocations } from '../../actions';
import { Header } from '../Common';

class Locations extends Component {
	static propTypes = {
		flash: PropTypes.func.isRequired,
		clear: PropTypes.func.isRequired
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

	render() {
		const { locations } = this.state;
		return (
			<div className="section">
				<div className="section-container">
					<Header message="Locations" />
					<h3>
						Purdue Hackers Around The Globe
						<a href="{{ action('LocationController@getMap') }}" className="pull-right">
							<button type="button" className="btn btn-primary btn-sm">
								Map
							</button>
						</a>
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
									<tr onClick={location._id}>
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

export default connect(mapStateToProps, { flash: sendFlashMessage, clear: clearFlashMessages })(
	Locations
);
