import React from 'react';
import PropTypes from 'prop-types';
import { Marker, InfoWindow } from 'react-google-maps';

export default class extends React.Component {
	static propTypes = { marker: PropTypes.object.isRequired };

	constructor(props) {
		super(props);
		this.state = { isOpen: false };
	}

	setOpen = val => () => this.setState({ isOpen: val });

	toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

	render = () => {
		const { marker } = this.props;
		const { isOpen } = this.state;
		return (
			<Marker
				key={marker._id}
				position={{ lat: marker.lat, lng: marker.lng }}
				onClick={this.toggleOpen}
				onMouseOver={this.setOpen(true)}
				// onFocus={this.setOpen(true)}
				// onMouseOut={this.setOpen(false)}
				// onBlur={this.setOpen(false)}
			>
				{isOpen && (
					<InfoWindow>
						<div>
							<h4>{marker.name}</h4>
							<p>
								<a href={`/location/${marker._id}`}>
									{`${marker.members.length} ${
										marker.members.length !== 1 ? 'members' : 'member'
									}`}
								</a>
							</p>
						</div>
					</InfoWindow>
				)}
			</Marker>
		);
	};
}
