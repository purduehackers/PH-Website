import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../constants';

class EventTable extends Component {
	static propTypes = {
		events: PropTypes.array,
		push: PropTypes.func
	};

	static defaultProps = {
		events: null,
		push: null
	};

	onClick = id => () => this.props.push(`/event/${id}`);

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
								<tr key={event._id + 1} id={event._id} onClick={this.onClick(event._id)}>
									<td>{event.name}</td>
									<td>{formatDate(event.created_at)}</td>
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
