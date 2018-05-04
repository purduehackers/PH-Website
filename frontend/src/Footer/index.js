import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class Footer extends Component {
	render() {
		return (
			<div className="footer">
				<ul className="footer-links">
					<li className="facebook">
						<Link to="//www.facebook.com/groups/purduehackers/">
							<FontAwesomeIcon icon={['fab', 'facebook']} />
						</Link>
					</li>
					<li className="twitter">
						<Link to="//www.twitter.com/purduehackers">
							<FontAwesomeIcon icon={['fab', 'twitter']} />
						</Link>
					</li>
					<li className="calendar">
						<Link to="//www.google.com/calendar/embed?src=t27bsfuiaaeh82n0upu2hkepn4%40group.calendar.google.com">
							<FontAwesomeIcon icon="calendar" />
						</Link>
					</li>
					<li className="email">
						<Link to="mailto:purduehackers@gmail.com">
							<FontAwesomeIcon icon="envelope" />
						</Link>
					</li>
				</ul>
				<h4>
					Made with <FontAwesomeIcon icon="heart" /> and <FontAwesomeIcon icon="coffee" /> by the Purdue Hackers Team
				</h4>
				<h4>Source <Link to="https://github.com/purdueHackers/MembersPortal" rel="noopener noreferrer" target="_blank">available on GitHub</Link></h4>
			</div>
		);
	}
}

export default Footer;
