import React from 'react';
import PropTypes from 'prop-types';

const SocialMediaPanel = ({ member }) => (
	<div className="panel panel-default text-left">
		<div className="panel-body">
			{member.facebook && (
				<React.Fragment>
					<b>Facebook Profile:</b>
					&nbsp;
					<a href={member.facebook} rel="noopener noreferrer" target="_blank">
						{member.facebook}
					</a>
					<br />
				</React.Fragment>
			)}
			{member.github && (
				<React.Fragment>
					<b>Github Profile:</b>
					&nbsp;
					<a href={member.github} rel="noopener noreferrer" target="_blank">
						{member.github}
					</a>
					<br />
				</React.Fragment>
			)}
			{member.linkedin && (
				<React.Fragment>
					<b>LinkedIn Profile:</b>
					&nbsp;
					<a href={member.linkedin} rel="noopener noreferrer" target="_blank">
						{member.linkedin}
					</a>
					<br />
				</React.Fragment>
			)}
			{member.devpost && (
				<React.Fragment>
					<b>Devpost Profile:</b>
					&nbsp;
					<a href={member.devpost} rel="noopener noreferrer" target="_blank">
						{member.devpost}
					</a>
					<br />
				</React.Fragment>
			)}
			{member.website && (
				<React.Fragment>
					<b>Personal Website:</b>
					&nbsp;
					<a href={member.website} rel="noopener noreferrer" target="_blank">
						{member.website}
					</a>
					<br />
				</React.Fragment>
			)}
			{member.linktoresume && (
				<React.Fragment>
					<b>Link to Resume:</b>
					&nbsp;
					<a href={member.linktoresume} rel="noopener noreferrer" target="_blank">
						{member.linktoresume}
					</a>
				</React.Fragment>
			)}
		</div>
	</div>
);

SocialMediaPanel.propTypes = {
	member: PropTypes.shape({
		facebook: PropTypes.string,
		github: PropTypes.string,
		linkedin: PropTypes.string,
		devpost: PropTypes.string,
		website: PropTypes.string,
		linktoresume: PropTypes.string
	}).isRequired
};

export default SocialMediaPanel;
