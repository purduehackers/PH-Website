import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export default () => (
	<div className="footer">
		<ul className="footer-links">
			<li className="facebook">
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="//www.facebook.com/groups/purduehackers/"
				>
					<FontAwesomeIcon icon={['fab', 'facebook']} />
				</a>
			</li>
			<li className="twitter">
				<a target="_blank" rel="noopener noreferrer" href="//www.twitter.com/purduehackers">
					<FontAwesomeIcon icon={['fab', 'twitter']} />
				</a>
			</li>
			<li className="calendar">
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="//www.google.com/calendar/embed?src=t27bsfuiaaeh82n0upu2hkepn4%40group.calendar.google.com"
				>
					<FontAwesomeIcon icon="calendar" />
				</a>
			</li>
			<li className="email">
				<a href="mailto:purduehackers@gmail.com">
					<FontAwesomeIcon icon="envelope" />
				</a>
			</li>
		</ul>
		<h4>
			Made with <FontAwesomeIcon icon="heart" /> and <FontAwesomeIcon icon="coffee" /> by the
			Purdue Hackers Team
		</h4>
		<h4>
			Source{' '}
			<a
				href="https://github.com/PurdueHackers/PH-Website"
				rel="noopener noreferrer"
				target="_blank"
			>
				available on GitHub
			</a>
		</h4>
	</div>
);
