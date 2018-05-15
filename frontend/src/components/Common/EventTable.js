import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EventTable extends Component {
	static propTypes = {
		events: PropTypes.array,
		push: PropTypes.func
	};

	static defaultProps = {
		events: null,
		push: null
	};

	onClick = e => {
		console.log('Trying to go to:', e.target.id);
		this.props.push(`/event/${e.target.id}`);
	};

	render() {
		const { events } = this.props;
		return (
			<div className="panel panel-default">
				<table className="table table-bordered table-hover table-clickable panel-body sortableTable">
					<thead>
						<tr>
							<th>Name</th>
							<th>Date</th>
							<th>Location</th>
							<th># Attended</th>
						</tr>
					</thead>
					<tbody>
						{events &&
							events.map(event => (
								<tr key={event._id} id={event._id} onClick={this.onClick}>
									<td>{event.name}</td>
									<td>{new Date(event.created_at).toDateString()}</td>
									<td>{event.location}</td>
									<td>{event.members}</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		);
	}
}

export default EventTable;
