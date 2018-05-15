import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MemberTable extends Component {
	static propTypes = {
		members: PropTypes.array,
		push: PropTypes.func
	};

	static defaultProps = {
		members: null,
		push: null
	};

	onClick = e => {
		console.log('Trying to go to:', e.target.id);
		this.props.push(`/member/${e.target.id}`);
	};

	render() {
		const { members } = this.props;
		return (
			<div className="panel panel-default">
				<table className="table table-bordered table-hover table-clickable panel-body sortableTable">
					<thead>
						<tr>
							<th>Picture</th>
							<th>Name</th>
							<th>Year</th>
							<th>Joined</th>
						</tr>
					</thead>
					<tbody>
						{members &&
							members.map(member => (
								<tr key={member._id} id={member._id} onClick={this.onClick}>
									<td className="member-icon">
										<img src={member.picture} alt="" className="member-icon" />
									</td>
									<td>{member.name}</td>
									<td>{member.graduation_year}</td>
									<td>{new Date(member.created_at).toDateString()}</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		);
	}
}

export default MemberTable;
