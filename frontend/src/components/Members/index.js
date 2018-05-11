import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import MemberTable from '../Common/MemberTable';
import routes from '../../constants';
import { fetchMembers } from '../../actions';

// TODO: Implement pagination

class MembersPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			members: []
		};
	}

	componentDidMount = async () => {
		const { members } = await fetchMembers({});
		console.log('MembersPage fetched members:', members);
		this.setState({ members });
	};

	render() {
		const { members } = this.state;
		return (
			<div className="section">
				<div className="section-container">
					<h3>
						<Link to={routes.REPORTS} className="pull-left marginR">
							<button type="button" className="btn btn-primary btn-sm">
								Graphs
							</button>
						</Link>
						<Link to={routes.LOCATIONS} className="pull-left">
							<button type="button" className="btn btn-primary btn-sm">
								Map
							</button>
						</Link>
						<Link to="#" className="pull-right">
							<button type="button" className="btn btn-primary btn-sm">
								{members && members.length} members
							</button>
						</Link>
						<Link to={routes.PERMISSIONS} className="pull-right marginR">
							<button type="button" className="btn btn-primary btn-sm">
								Edit Permissions
							</button>
						</Link>
					</h3>
					<MemberTable members={members} push={this.props.history.push} />
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default connect(mapStateToProps, {})(MembersPage);
