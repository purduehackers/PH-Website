import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class FlashMessage extends Component {
	static propTypes = {
		msgGreen: PropTypes.string,
		msgRed: PropTypes.string
	};

	static defaultProps = {
		msgGreen: '',
		msgRed: ''
	};

	render = () => (
		<React.Fragment>
			{this.props.msgGreen && (
				<div className="section alert-section" style={{ paddingTop: 0 }}>
					<div className="section-container">
						<div className="alert alert-success" role="alert">
							{this.props.msgGreen}
						</div>
					</div>
				</div>
			)}
			{this.props.msgRed && (
				<div className="section alert-section" style={{ paddingTop: 0 }}>
					<div className="section-container">
						<div className="alert alert-danger" role="alert">
							{this.props.msgRed}
						</div>
					</div>
				</div>
			)}
		</React.Fragment>
	);
}

const mapStateToProps = state => ({
	...state.flashState
});

export default connect(mapStateToProps)(FlashMessage);
