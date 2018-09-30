import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import routes, { formatDate, hasPermission, err } from '../../constants';
import {
	sendFlashMessage,
	clearFlashMessages,
	fetchPermission,
	deletePermission,
	addUserToPermission,
	removeUserFromPermission
} from '../../actions';
import { CustomRedirect, Header } from '../Common';

class PermissionPage extends Component {
	static propTypes = {
		history: PropTypes.shape({
			push: PropTypes.func
		}).isRequired,
		user: PropTypes.object.isRequired,
		match: PropTypes.shape({
			params: PropTypes.shape({
				id: PropTypes.string
			})
		}).isRequired,
		flash: PropTypes.func.isRequired,
		clear: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			permission: null,
			loading: true,
			memberEmail: '',
			members: []
		};
	}

	componentDidMount = async () => {
		const { flash, clear } = this.props;
		try {
			clear();
			const permission = await fetchPermission(this.props.match.params.id);
			console.log('Fetched permission:', permission);
			this.setState({
				permission,
				loading: false,
				members: permission ? permission.members : []
			});
		} catch (error) {
			console.error('Permission Page error:', error);
			this.setState({ loading: false });
			flash(err(error));
		}
	};

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	onClick = id => () => this.props.history.push(`/member/${id}`);

	onAddUser = async e => {
		e.preventDefault();
		const { flash, clear } = this.props;
		const { memberEmail } = this.state;
		try {
			clear();
			const response = await addUserToPermission(this.props.match.params.id, memberEmail);
			console.log('Added user to permission:', response);
			const { permission } = response;
			this.setState({ members: permission.members, memberEmail: '' });
			return flash('Successfully added user to this permission', 'green');
		} catch (error) {
			console.error('Permissions Page error:', error);
			return flash(err(error));
		}
	};

	onDeleteUser = async e => {
		e.preventDefault();
		e.stopPropagation();
		const { flash, clear } = this.props;
		const { id: memberID } = e.target;
		try {
			clear();
			const { permission } = await removeUserFromPermission(
				this.props.match.params.id,
				memberID
			);
			this.setState({ members: permission.members });
			return flash('Successfully removed user from this permission', 'green');
		} catch (error) {
			console.error('Permissions Page error:', error);
			return flash(err(error));
		}
	};

	onDeletePermission = async e => {
		e.preventDefault();
		const { flash, clear, history } = this.props;
		try {
			clear();
			await deletePermission(this.props.match.params.id);
			history.push('/permissions');
			return flash('Permission successfully deleted', 'green');
		} catch (error) {
			console.error('Permissions Page error:', error);
			return flash(err(error));
		}
	};

	render() {
		const { permission, loading, memberEmail, members } = this.state;
		const { user } = this.props;
		if (loading) return <div>Loading...</div>;
		if (!permission) return <CustomRedirect msgRed="Permission not found" />;
		return (
			<div className="section">
				<div className="section-container">
					<Header message={`Permission: ${permission.name}`} />
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
										<tr onClick={this.onClick(m.member._id)} key={i}>
											<td>{m.member.name}</td>
											<td>{formatDate(m.dateAdded)}</td>
											<td>
												{m.recordedBy ? m.recordedBy.name : 'Unknown'}
												<button
													className="btn btn-xs btn-danger pull-right"
													id={m.member._id}
													onClick={this.onDeleteUser}
												>
													Delete
												</button>
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
								<tr>
									<td />
									<td>
										<input
											type="text"
											id="memberEmail"
											name="member_name"
											placeholder="Add User"
											className="form-control membersautocomplete"
											data-bvalidator="required"
											value={memberEmail}
											onChange={this.onChange}
										/>
									</td>
									<td>
										<input
											type="submit"
											value="Add User"
											className="btn btn-sm btn-primary"
											onClick={this.onAddUser}
										/>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					{hasPermission(user, 'adminpermissions') && (
						<button
							className="btn btn-sm btn-danger pull-right"
							onClick={this.onDeletePermission}
						>
							Delete Permission
						</button>
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
	{ flash: sendFlashMessage, clear: clearFlashMessages }
)(PermissionPage);
