import React from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import MarkerInfo from './MarkerInfo';

export default compose(
	withProps({
		googleMapURL:
			'https://maps.googleapis.com/maps/api/js?key=AIzaSyAxfBt53om-sXi6wyZGIWfWtvG9MehVFwA',
		loadingElement: <div />,
		containerElement: <div style={{ height: '500px' }} />,
		mapElement: <div style={{ height: '100%' }} />
	}),
	withScriptjs,
	withGoogleMap
)(props => (
	<GoogleMap defaultZoom={3} defaultCenter={{ lat: 40.4237, lng: -86.9212 }}>
		<MarkerClusterer onClick={props.onMarkerClustererClick} enableRetinaIcons>
			{props.markers.map((marker, i) => (
				<MarkerInfo key={`marker:${i}`} marker={marker} />
			))}
		</MarkerClusterer>
	</GoogleMap>
));
