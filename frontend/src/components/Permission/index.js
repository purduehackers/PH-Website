import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import routes, { formatDate } from '../../constants';
import { sendFlashMessage, clearFlashMessages, fetchPermission } from '../../actions';

class PermissionPage extends Component {
	static propTypes = {
		// history: PropTypes.shape({
		// 	push: PropTypes.func
		// }).isRequired
		// user: PropTypes.object.isRequired
		match: PropTypes.shape({
			params: PropTypes.shape({
				id: PropTypes.string
			})
		}).isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			permission: null,
			loading: true
		};
	}

	componentDidMount = async () => {
		const { flash, clear } = this.props;
		try {
			clear();
			const permission = await fetchPermission(this.props.match.params.id);
			console.log('Fetched permission:', permission);
			this.setState({ permission, loading: false });
		} catch (error) {
			console.error('Permission Page error:', error);
			this.setState({ loading: false });
			flash(error.error);
		}
	};

	render() {
		const { permission, loading } = this.state;
		if (loading) return <div>Loading...</div>;
		if (!permission) return <div>Permission not found</div>;
		const { members } = permission;
		return (
			<div className="section">
				<div className="section-container">
					<h3>
						Permission: {permission.name}
						<Link to={routes.PERMISSIONS} className="pull-left">
							<button type="button" className="btn btn-primary btn-sm">
								<span className="glyphicon glyphicon-chevron-left" aria-hidden="true" />
								Permissions
							</button>
						</Link>
					</h3>
					<div className="panel panel-default text-left">
						<div className="panel-body">
							<div id="profile_intro_text">
								<div id="profile_name">{permission.name}</div>
								<div id="profile_major">{permission.description}</div>
								<div id="profile_badges">
									<div className="profile_badge">
										<div className="profile_badge_title">Users</div>
										{members ? members.length : 0}
									</div>
								</div>
							</div>
						</div>
					</div>
					<hr />
					<h3>Users</h3>
					<div className="panel panel-default">
						<table className="table table-bordered table-hover table-clickable panel-body sortableTable">
							<thead>
								<tr>
									<th>Member</th>
									<th>Date Added</th>
									<th>Added By</th>
								</tr>
							</thead>
							<tbody>
								{members && members.length ? (
									members.map((m, i) => (
										<tr onClick="location.href='{{ $member->profileURL() }}';" key={i}>
											<td>{m.member.name}</td>
											<td>{formatDate(m.dateAdded)}</td>
											<td>
												{m.recordedBy ? m.recordedBy.name : 'Unknown'}
												<a
													href="{{ action('PermissionController@getDeleteMember', [$permission->id, $member->id]) }}"
													className="pull-right"
												>
													<button className="btn btn-xs btn-danger pull-right">
														Delete
													</button>
												</a>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td>No Users</td>
										<td />
										<td />
									</tr>
								)}
								<form
									method="post"
									action="{{ action('PermissionController@postAdd',$permission->id) }}"
									className="panel-body validate"
								>
									<tr>
										<td>
											<input
												type="text"
												id="memberEmail"
												name="member_name"
												placeholder="Add User"
												className="form-control membersautocomplete"
												data-bvalidator="required"
											/>
										</td>
										<td />
										<td>
											<input
												type="submit"
												value="Add User"
												className="btn btn-sm btn-primary"
											/>
										</td>
									</tr>
								</form>
							</tbody>
						</table>
					</div>
					@can ('permission','adminpermissions')
					<a
						href="{{ action('PermissionController@getDelete', $permission->id) }}"
						className="pull-right"
					>
						<button className="btn btn-sm btn-danger pull-right">Delete Permission</button>
					</a>
					@endcan
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default connect(mapStateToProps, { flash: sendFlashMessage, clear: clearFlashMessages })(
	PermissionPage
);
