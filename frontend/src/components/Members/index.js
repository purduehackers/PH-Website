import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { MemberTable, Header } from '../Common';
import routes, { hasPermission } from '../../constants';
import { fetchMembers } from '../../actions';

// TODO: Implement pagination
// TODO: Implement permissions

class MembersPage extends Component {
	static propTypes = {
		history: PropTypes.shape({
			push: PropTypes.func
		}).isRequired,
		user: PropTypes.object
	};

	static defaultProps = { user: null };

	constructor(props) {
		super(props);
		this.state = {
			members: [],
			loading: true
		};
	}

	componentDidMount = async () => {
		const { members } = await fetchMembers({});
		console.log('MembersPage fetched members:', members);
		this.setState({ members, loading: false });
	};

	render() {
		const { members, loading } = this.state;
		const { user } = this.props;
		return (
			<div className="section">
				<div className="section-container">
					<Header message="Members" />
					<h3>
						Members
						<React.Fragment>
							{hasPermission(user, 'members') && (
								<Link to={routes.REPORTS} className="pull-left marginR">
									<button type="button" className="btn btn-primary btn-sm">
										Graphs
									</button>
								</Link>
							)}
							<Link to={routes.LOCATIONS_MAP} className="pull-left">
								<button type="button" className="btn btn-primary btn-sm">
									Map
								</button>
							</Link>
							{hasPermission(user, 'members') && (
								<Link to="#" className="pull-right">
									<button type="button" className="btn btn-primary btn-sm">
										{members && members.length} members
									</button>
								</Link>
							)}
						</React.Fragment>
						{hasPermission(user, 'members') && (
							<Link to={routes.PERMISSIONS} className="pull-right marginR">
								<button type="button" className="btn btn-primary btn-sm">
									Edit Permissions
								</button>
							</Link>
						)}
					</h3>
					{loading ? (
						<span>Loading...</span>
					) : (
						<MemberTable members={members} push={this.props.history.push} user={user} />
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
	{}
)(MembersPage);
