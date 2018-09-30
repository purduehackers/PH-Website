import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import routes from '../../constants';
import { sendFlashMessage, clearFlashMessages, fetchJobs } from '../../actions';
import { Header, MembersMap } from '../Common';

class LocationsMapPage extends Component {
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
			const jobs = await fetchJobs();
			const locations = jobs.map(job => job.location);
			console.log('Fetched locations:', locations);
			this.setState({ locations });
		} catch (error) {
			flash('Whoops! Something went wrong!');
			console.error('LocationsPage error:', error);
		}
	};

	render = () => (
		<div className="section">
			<div className="section-container">
				<Header message="Map" />
				<h3>
					Purdue Hackers Around The Globe
					<Link to={routes.LOCATIONS} className="pull-right">
						<button type="button" className="btn btn-primary btn-sm">
							List
						</button>
					</Link>
				</h3>
				<MembersMap markers={this.state.locations} />
			</div>
		</div>
	);
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default connect(
	mapStateToProps,
	{ flash: sendFlashMessage, clear: clearFlashMessages }
)(LocationsMapPage);
