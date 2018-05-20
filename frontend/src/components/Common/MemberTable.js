import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate, hasPermission } from '../../constants';

class MemberTable extends Component {
	static propTypes = {
		members: PropTypes.array.isRequired,
		push: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	};

	onClick = id => () => this.props.push(`/member/${id}`);

	render() {
		const { members, user } = this.props;
		return (
			<div className="panel panel-default">
				<table className="table table-bordered table-hover table-clickable panel-body sortableTable">
					<thead>
						<tr>
							{hasPermission(user, 'members') && <th>Picture</th>}
							<th>Name</th>
							<th>Year</th>
							<th>Joined</th>
						</tr>
					</thead>
					<tbody>
						{members &&
							members.map(member => (
								<tr key={member._id} id={member._id} onClick={this.onClick(member._id)}>
									{hasPermission(user, 'members') && (
										<td className="member-icon">
											<img src={member.picture} alt="" className="member-icon" />
										</td>
									)}
									<td>{member.name}</td>
									<td>{member.graduation_year}</td>
									<td>{formatDate(member.created_at)}</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		);
	}
}

export default MemberTable;
