import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { hasPermission } from '../../constants';
import { sendFlashMessage, clearFlashMessages, fetchPermissions } from '../../actions';

class PermissionsPage extends Component {
	static propTypes = {
		history: PropTypes.shape({
			push: PropTypes.func
		}).isRequired
		// user: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			permissions: []
			// loading: true
		};
		console.log();
	}

	componentDidMount = async () => {
		const { flash, clear } = this.props;
		try {
			clear();
			const permissions = await fetchPermissions();
			console.log('Fetched permissions:', permissions);
			this.setState({ permissions });
		} catch (error) {
			console.error('Permissions Page error:', error);
			flash(error.error);
		}
	};

	onPermissionClick = id => () => this.props.history.push(`/permission/${id}`);

	render() {
		const { permissions } = this.state;
		// const { user } = this.props;
		return (
			<div className="section">
				<div className="section-container">
					<h3>Permissions</h3>
					<div className="panel panel-default">
						<table className="table table-bordered panel-body table-hover table-clickable sortableTable">
							<thead>
								<tr>
									<th>Name</th>
									<th>Description</th>
									<th># Users</th>
								</tr>
							</thead>
							<tbody>
								{permissions.map(permission => (
									<tr key={permission._id} onClick={this.onPermissionClick}>
										<td>{permission.name}</td>
										<td>{permission.description}</td>
										<td>{permission.members ? permission.members.length : 0}</td>
									</tr>
								))}
								<tr>
									<td />
									<td>
										<input
											type="text"
											id="memberEmail"
											name="member_name"
											placeholder="Add Organizer"
											className="form-control membersautocomplete"
											data-bvalidator="required"
										/>
									</td>
									<td>
										<input
											type="submit"
											value="Add Organizer"
											className="btn btn-sm btn-primary"
										/>
									</td>
								</tr>
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
	PermissionsPage
);
