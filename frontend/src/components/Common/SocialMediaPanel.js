import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SocialMediaPanel extends Component {
	static propTypes = {
		member: PropTypes.shape({
			facebook: PropTypes.string,
			github: PropTypes.string,
			linkedin: PropTypes.string,
			devpost: PropTypes.string,
			website: PropTypes.string,
			linktoresume: PropTypes.string
		})
	};

	static defaultProps = {
		member: null
	};

	render() {
		const { member } = this.props;
		return (
			<div className="panel panel-default text-left">
				<div className="panel-body">
					{member.facebook && (
						<React.Fragment>
							<b>Facebook Profile:</b>
							<a href={member.facebook} target="_blank">
								{member.facebook}
							</a>
							<br />
						</React.Fragment>
					)}
					{member.github && (
						<React.Fragment>
							<b>Github Profile:</b>
							<a href={member.github} target="_blank">
								{member.github}
							</a>
							<br />
						</React.Fragment>
					)}
					{member.linkedin && (
						<React.Fragment>
							<b>LinkedIn Profile:</b>
							<a href={member.linkedin} target="_blank">
								{member.linkedin}
							</a>
							<br />
						</React.Fragment>
					)}
					{member.devpost && (
						<React.Fragment>
							<b>Devpost Profile:</b>
							<a href={member.devpost} target="_blank">
								{member.devpost}
							</a>
							<br />
						</React.Fragment>
					)}
					{member.website && (
						<React.Fragment>
							<b>Personal Website:</b>
							<a href={member.website} target="_blank">
								{member.website}
							</a>
							<br />
						</React.Fragment>
					)}
					{member.linktoresume && (
						<React.Fragment>
							<b>Link to Resume:</b>
							<a href={member.linktoresume} target="_blank">
								{member.linktoresume}
							</a>
						</React.Fragment>
					)}
				</div>
			</div>
		);
	}
}

export default SocialMediaPanel;
