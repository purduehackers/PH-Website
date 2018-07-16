import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Downshift from 'downshift';
import { hasPermission, shortName } from '../../constants';
import {
	sendFlashMessage,
	clearFlashMessages,
	fetchEvent,
	checkinEvent,
	checkoutEvent,
	autocompleteMembers
} from '../../actions';
import { CustomRedirect } from '../Common';

// TODO: Add autocomplete to input tags

class EventCheckinPage extends Component {
	static propTypes = {
		match: PropTypes.shape({
			params: PropTypes.shape({
				id: PropTypes.string
			})
		}).isRequired,
		flash: PropTypes.func.isRequired,
		clear: PropTypes.func.isRequired,
		user: PropTypes.object
	};

	static defaultProps = {
		user: null
	};

	constructor(props) {
		super(props);
		this.state = {
			event: null,
			loading: true,
			members: [],
			selectedMember: null
		};
		console.log('EventCheckinPage props:', this.props);
	}

	componentDidMount = async () => {
		const {
			match: {
				params: { id }
			},
			flash,
			clear
		} = this.props;
		try {
			clear();
			const event = await fetchEvent(id);
			this.setState({ event, loading: false });
		} catch (error) {
			this.setState({ loading: false });
			flash(error.error);
		}
	};

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	onInputChange = async (e, field) => {
		const { flash } = this.props;
		try {
			const response = await autocompleteMembers({
				term: e.target.value,
				field
			});
			console.log('Autocomplete for:', field, response);
			return this.setState({ members: response });
		} catch (error) {
			console.error('EventCheckinPage error:', error);
			return flash(error.error);
		}
	};

	checkinMember = async e => {
		e.preventDefault();
		const { selectedMember, event } = this.state;
		const { flash } = this.props;
		try {
			if (!event) return flash('Event does not exist');
			if (!selectedMember) return flash('Please provide your name and email');
			console.log('Selected Member:', selectedMember);
			await checkinEvent(event._id, selectedMember.name, selectedMember.email);
			this.setState({ selectedMember: null });
			return flash(`Checked in member: ${selectedMember.name}`, 'green');
		} catch (error) {
			console.error('EventCheckinPage error:', error);
			return flash(error.error);
		}
	};

	checkoutMember = async e => {
		e.preventDefault();
		const { selectedMember, event } = this.state;
		const { flash } = this.props;
		try {
			if (!event) return flash('Event does not exist');
			if (!selectedMember) return flash('Please provide your name and email');
			console.log('Selected Member:', selectedMember);
			await checkoutEvent(event._id, selectedMember._id);
			this.setState({ selectedMember: null });
			return flash(`Checked out member: ${selectedMember.name}`, 'green');
		} catch (error) {
			console.error('EventCheckinPage error:', error);
			return flash(error.error);
		}
	};

	render() {
		const { event, loading, members, selectedMember } = this.state;
		const { user } = this.props;
		if (loading) return <span>Loading...</span>;
		if (!loading && !event) return <CustomRedirect msgRed="Event not found" />;
		if (event.privateEvent && !hasPermission(user, 'events'))
			return <CustomRedirect msgRed="You are not authorized to view this page" />;
		return (
			<div>
				<Helmet>
					<title>{shortName(event.name)}</title>
				</Helmet>
				<div className="section">
					<div className="section-container">
						<h3>
							{shortName(event.name)}
							<Link key={`${event._id}-1`} to={`/event/${event._id}`}>
								<button type="button" className="pull-left btn btn-primary btn-sm marginR">
									<span className="glyphicon glyphicon-chevron-left" aria-hidden="true" />
									Event
								</button>
							</Link>
						</h3>
						<div className="panel panel-default">
							<div id="checkinForm" className="panel-body validate" autoComplete="off">
								<Downshift
									selectedItem={selectedMember}
									onChange={selection => this.setState({ selectedMember: selection })}
									itemToString={item => (item ? item.name : '')}
								>
									{({
										selectedItem,
										getInputProps,
										getItemProps,
										inputValue,
										highlightedIndex,
										isOpen
									}) => (
										<div>
											<div className="input-group">
												<span className="input-group-addon" id="memberNameTitle">
													Name:
												</span>
												<input
													{...getInputProps({
														onChange: async e => {
															const { value } = e.target;
															if (!value) return;
															await this.onInputChange(e, 'name');
														},
														id: 'name',
														name: 'name',
														className: 'form-control membersautocomplete',
														placeholder: 'Member Name',
														pattern: '([a-zA-Z]+ )+[a-zA-Z]+',
														title: 'Please enter first and last name'
													})}
												/>
												<span className="input-group-btn">
													<button
														className="btn btn-primary"
														type="button"
														onClick={this.checkinMember}
													>
														Checkin
													</button>
												</span>
											</div>
											{isOpen &&
												members.length && (
													<div>
														{members
															.filter(
																item =>
																	!inputValue || item.name.includes(inputValue)
															)
															.map((item, index) => (
																<div
																	{...getItemProps({
																		key: item.name,
																		index,
																		item,
																		style: {
																			backgroundColor:
																				highlightedIndex === index
																					? 'lightgray'
																					: 'white',
																			fontWeight:
																				selectedItem === item
																					? 'bold'
																					: 'normal'
																		}
																	})}
																>
																	{item.name}
																</div>
															))}
													</div>
												)}
										</div>
									)}
								</Downshift>
								<br />
								<Downshift
									selectedItem={selectedMember}
									onChange={selection => this.setState({ selectedMember: selection })}
									itemToString={item => (item ? item.email : '')}
								>
									{({
										selectedItem,
										getInputProps,
										getItemProps,
										inputValue,
										highlightedIndex,
										isOpen
									}) => (
										<div>
											<div className="input-group">
												<span className="input-group-addon" id="memberEmailTitle">
													Email:
												</span>
												<input
													{...getInputProps({
														onChange: async e => {
															const { value } = e.target;
															if (!value) return;
															await this.onInputChange(e, 'email');
														},
														id: 'email',
														name: 'email',
														className: 'form-control',
														placeholder: 'Member Email'
													})}
												/>
												<span className="input-group-btn">
													<button
														className="btn btn-primary"
														type="button"
														onClick={this.checkinMember}
													>
														Checkin
													</button>
												</span>
											</div>
											{isOpen &&
												members.length && (
													<div>
														{members
															.filter(
																item =>
																	!inputValue || item.email.includes(inputValue)
															)
															.map((item, index) => (
																<div
																	{...getItemProps({
																		key: item.email,
																		index,
																		item,
																		style: {
																			backgroundColor:
																				highlightedIndex === index
																					? 'lightgray'
																					: 'white',
																			fontWeight:
																				selectedItem === item
																					? 'bold'
																					: 'normal'
																		}
																	})}
																>
																	{item.email}
																</div>
															))}
													</div>
												)}
										</div>
									)}
								</Downshift>
								<br />
								<div className="input-group">
									<span className="input-group-addon" id="graduationYearTitle">
										Graduation Year:
									</span>
									<input
										type="text"
										id="graduationYear"
										className="form-control"
										readOnly
										value={selectedMember ? selectedMember.graduationYear : ''}
									/>
								</div>
								<br />
								<button
									className="btn btn-primary"
									type="button"
									onClick={this.checkinMember}
									style={{ float: 'center' }}
								>
									Checkin
								</button>
								<button
									className="btn btn-danger"
									type="button"
									onClick={this.checkoutMember}
									style={{ float: 'center' }}
								>
									Checkout
								</button>
							</div>
						</div>
						<div id="checkinAlerts" />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default connect(mapStateToProps, { flash: sendFlashMessage, clear: clearFlashMessages })(
	EventCheckinPage
);
