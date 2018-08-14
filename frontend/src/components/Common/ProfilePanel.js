import React from 'react';
import PropTypes from 'prop-types';

const ProfilePanel = ({ member, events, jobs }) => (
	<React.Fragment>
		<div className="panel panel-default text-left">
			<div className="panel-body">
				{member.picture && <img src={member.picture} id="profile_image" alt="Profile Pic" />}
				<div id="profile_intro_text">
					<div id="profile_name">{member.name}</div>
					{member.email_public && (
						<a id="profile_email" href={`mailto:${member.email_public}`}>
							{member.email_public}
						</a>
					)}
					{member.graduationYear ? (
						<div id="profile_major">
							{member.major ? member.major : ''} Class of {member.graduationYear}
						</div>
					) : null}
					<div id="profile_badges">
						<div className="profile_badge">
							<div className="profile_badge_title">Events</div>
							{events}
						</div>
						<div className="profile_badge">
							<div className="profile_badge_title">Projects</div>
							{member.projects ? member.projects.length : 0}
						</div>
						<div className="profile_badge">
							<div className="profile_badge_title">Jobs</div>
							{jobs}
						</div>
					</div>
				</div>
			</div>
		</div>
		{member.description && (
			<div className="panel panel-default text-left">
				<div className="panel-body">
					{member.description.split('\\\n').map((item, key) => (
						<span key={key}>
							{item}
							<br />
						</span>
					))}
				</div>
			</div>
		)}
	</React.Fragment>
);

ProfilePanel.propTypes = {
	member: PropTypes.object,
	events: PropTypes.number,
	jobs: PropTypes.number
};

ProfilePanel.defaultProps = {
	member: null,
	events: 0,
	jobs: 0
};

export default ProfilePanel;
