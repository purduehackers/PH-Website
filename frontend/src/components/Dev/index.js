import React from 'react';
import { Header } from '../Common';

export default () => (
	<React.Fragment>
		<Header message="Dev" />
		<div className="section about">
			<div className="section-container">
				<h1>Purdue Hackers Dev Team</h1>
				<h3>
					We are a community of students who collaborate, learn, and build kick-ass technical
					projects.
				</h3>
				<div className="about-img" />
			</div>
		</div>

		<div className="section events">
			<div className="section-container">
				<h1>What We Do</h1>
				<div className="content left">
					<h3>
						<a href="http://www.purduehackers.com/">PurdueHackers.com</a>
					</h3>
					<p>
						PurdueHackers.com is a web application for Purdue Hackers to manage their members,
						events, and attendance. It also has the opportunity to provide useful features to
						the Purdue Hackers community, such as showcasing projects and helping students
						find team-mates for school, hackathon, and personal projects.
					</p>
					<h3>Mobile Apps</h3>
					<p>
						A lot of students have expressed interest in Purdue Hackers having an ios/android
						app. Purdue Hackers web application already provides the necessary accounts/data
						to serve users, we just need someone who can build these apps and hook them up to
						our current API.
					</p>
					<h3>Other Projects</h3>
					<p>
						There are tons of other development projects which Purdue Hackers organizes. This
						includes technical workshops, and events such as Purdue Hackers Battleship and
						Purdue Hackers Tron. Purdue Hackers is a community that is open to ideas for
						future events. If you have an idea, come to the next weekly PH Organizer Meeting
						and present it.
					</p>
				</div>
				<div className="event-img" />
			</div>
		</div>

		<div className="section">
			<div className="section-container">
				<hr />
				<h1 style={{ fontSize: '5em', color: '#e6d36a' }}>Web-Dev</h1>
				<hr />
			</div>
		</div>

		<div className="section">
			<div className="section-container">
				<h1>Resources</h1>
				<div className="list-group">
					<a
						rel="noopener noreferrer"
						href="https://github.com/PurdueHackers/PH-Website"
						className="list-group-item"
						target="_blank"
					>
						<b>Project Github Repository:</b> The master repository. Fork your repository from
						here, and submit pull requests to push your code live.
					</a>
					<a
						rel="noopener noreferrer"
						href="https://github.com/PurdueHackers/PH-Website/issues"
						className="list-group-item"
						target="_blank"
					>
						<b>GitHub Issues:</b> Submit feature requests, bugs, or anything else to be
						tracked here.
					</a>
					<a
						rel="noopener noreferrer"
						href="https://discordapp.com/invite/Vkns8pZ"
						className="list-group-item"
						target="_blank"
					>
						<b>Discord Group Chat:</b> General Purdue Hackers Open Organizer/WebDev Group
						Chat.
					</a>
				</div>
				<hr />
			</div>
		</div>

		<div className="section">
			<div className="section-container">
				<h1>The Stack</h1>
				<h3>Frontend:</h3>
				<ul className="list-group">
					<li className="list-group-item">
						<a target="_blank" rel="noopener noreferrer" href="https://nodejs.org/en">
							<img
								src="https://cdn-images-1.medium.com/max/960/1*pxfq-ikL8zPE3RyGB2xbng.png"
								alt="Node js"
								style={{ maxWidth: '180px' }}
							/>
						</a>
					</li>
					<li className="list-group-item">
						<a target="_blank" rel="noopener noreferrer" href="https://reactjs.org/">
							<img
								src="http://blog-assets.risingstack.com/2016/Jan/react_best_practices-1453211146748.png"
								alt="React js"
								style={{ maxWidth: '180px' }}
							/>
						</a>
					</li>
					<li className="list-group-item">
						<a target="_blank" rel="noopener noreferrer" href="https://redux.js.org/">
							<img
								src="https://camo.githubusercontent.com/f28b5bc7822f1b7bb28a96d8d09e7d79169248fc/687474703a2f2f692e696d6775722e636f6d2f4a65567164514d2e706e67"
								alt="Redux js"
								style={{ maxWidth: '180px' }}
							/>
						</a>
					</li>
					<li className="list-group-item">
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://github.com/ReactTraining/react-router"
						>
							<img
								src="https://cdn-images-1.medium.com/max/698/1*TKvlTeNqtkp1s-eVB5Hrvg.png"
								alt="React Router"
								style={{ maxWidth: '180px' }}
							/>
						</a>
					</li>
					<li className="list-group-item">
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://yarnpkg.com/en/docs/install"
						>
							<img
								src="https://yarnpkg.com/assets/og_image.png"
								alt="Yarn"
								style={{ maxWidth: '180px' }}
							/>
						</a>
					</li>
				</ul>
				<h3>Backend:</h3>
				<ul className="list-group">
					<li className="list-group-item">
						<a target="_blank" rel="noopener noreferrer" href="https://nodejs.org/en">
							<img
								src="https://cdn-images-1.medium.com/max/960/1*pxfq-ikL8zPE3RyGB2xbng.png"
								alt="Node js"
								style={{ maxWidth: '180px' }}
							/>
						</a>
					</li>
					<li className="list-group-item">
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://www.typescriptlang.org/"
						>
							<img
								src="https://cdn-images-1.medium.com/max/852/1*pVC_16G2Mv_vK28obTPF5A.png"
								alt="Typescript"
								style={{ maxWidth: '180px' }}
							/>
						</a>
					</li>
					<li className="list-group-item">
						<a target="_blank" rel="noopener noreferrer" href="https://docs.mongodb.com">
							<img
								src="https://webassets.mongodb.com/_com_assets/cms/MongoDB-Logo-5c3a7405a85675366beb3a5ec4c032348c390b3f142f5e6dddf1d78e2df5cb5c.png"
								alt="MongoDB"
								style={{ maxWidth: '180px' }}
							/>
						</a>
					</li>
					<li className="list-group-item">
						<a target="_blank" rel="noopener noreferrer" href="https://expressjs.com/">
							<img
								src="http://mean.io/wp-content/themes/twentysixteen-child/images/express.png"
								alt="Express JS"
								style={{ maxWidth: '180px' }}
							/>
						</a>
					</li>
					<li className="list-group-item">
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://github.com/szokodiakos/typegoose"
						>
							Typegoose
						</a>
					</li>
				</ul>
				<hr />
			</div>
		</div>

		<div className="section">
			<div className="section-container">
				<h1>Local Environment Setup</h1>
				<ol className="list-group">
					<li className="list-group-item">1) sh setup.sh</li>
					<li className="list-group-item">2) mongod</li>
					<li className="list-group-item">3) cd backend</li>
					<li className="list-group-item">4) npm start</li>
					<li className="list-group-item">5) cd ../frontend</li>
					<li className="list-group-item">6) yarn start</li>
				</ol>
				<hr />
			</div>
		</div>

		<div className="section">
			<div className="section-container">
				<h1>Introduction To The Purdue Hackers Project</h1>
				<ul className="list-group">
					<li className="list-group-item">
						<b>frontend/src/actions</b>: Redux actions. Contains all async actions and has
						dispatchers to change global state of applications
					</li>
					<li className="list-group-item">
						<b>frontend/src/components</b>: Main code for each portion of the site. Each
						folder is a page on the website.
					</li>
					<li className="list-group-item">
						<b>frontend/src/reducers</b>: Contains all Redux action reducers, which modifies
						thier own substate based on what action is dispatched
					</li>
					<li className="list-group-item">
						<b>frontend/src/store</b>: Combines the redux reducers into one store and adds
						middleware
					</li>
					<li className="list-group-item">
						<b>backend/src/config</b>: Sets up any global configurations
					</li>
					<li className="list-group-item">
						<b>backend/src/config</b>: Sets up any global configurations into CONFIG global
						variable
					</li>
					<li className="list-group-item">
						<b>backend/src/middleware</b>: Defines any middleware to be used in the backend
					</li>
					<li className="list-group-item">
						<b>backend/src/models</b>: Various models (objects) which we use for manipulating
						and storing data in our database. (E.G. Each user who signs up has their own
						Member object)
					</li>
					<li className="list-group-item">
						<b>backend/src/routes</b>: Main code for each portion of the site. Given a
						specific request, performs logic and returns an http response.
					</li>
				</ul>
				<hr />
			</div>
		</div>
	</React.Fragment>
);
