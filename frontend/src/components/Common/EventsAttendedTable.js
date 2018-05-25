import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../constants';

class EventsAttendedTable extends Component {
	static propTypes = {
		events: PropTypes.array.isRequired,
		push: PropTypes.func.isRequired
	};

	onEventClick = id => () => this.props.push(`/event/${id}`);

	render() {
		const { events } = this.props;
		return (
			<div className="panel panel-default">
				<table className="table table-bordered table-hover table-clickable panel-body">
					<thead>
						<tr>
							<th>Event</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{events && events.length ? (
							events.map((event, i) => (
								<tr key={i} onClick={this.onEventClick(event._id)}>
									<td>{event.name}</td>
									<td>{formatDate(event.eventTime)}</td>
								</tr>
							))
						) : (
							<tr>
								<td>No Events Attended</td>
								<td />
							</tr>
						)}
					</tbody>
				</table>
			</div>
		);
	}
}

export default EventsAttendedTable;
