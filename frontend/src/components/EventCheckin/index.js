import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Downshift from 'downshift';
import { hasPermission, shortName, err } from '../../constants';
import {
	sendFlashMessage,
	clearFlashMessages,
	fetchEvent,
	checkinEvent,
	checkoutEvent,
	autocompleteMembers
} from '../../actions';
import { CustomRedirect, Header } from '../Common';

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
			name: '',
			email: '',
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
			flash(err(error));
		}
	};

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	onInputChange = async (e, field) => {
		const { flash } = this.props;
		try {
			// const response = await autocompleteMembers({
			// 	term: e.target.value,
			// 	field
			// });
			// console.log('Autocomplete for:', field, response);
			// return this.setState({ members: response });

			const { value, id } = e.target;
			console.log('ID:', id, '\tValue:', value);
			this.setState({ [id]: value });
			if (value) {
				const response = await autocompleteMembers({
					term: value,
					field
				});
				console.log('Autocomplete for:', field, response);
				return this.setState({ members: response });
			}
			return null;
		} catch (error) {
			console.error('EventCheckinPage error:', error);
			return flash(err(error));
		}
	};

	onSelectionChange = async selection => {
		console.log('Selection:', selection);
		const nextState = { selectedMember: selection };
		if (selection.name) nextState.name = selection.name;
		if (selection.email) nextState.email = selection.email;
		console.log('Next State:', selection);
		this.setState(nextState);
	};

	checkinMember = async e => {
		e.preventDefault();
		const { name, email, event } = this.state;
		const { flash, clear } = this.props;
		try {
			clear();
			if (!event) return flash('Event does not exist');
			if (!name) return flash('Please provide your name');
			if (!email) return flash('Please provide your email');
			console.log('Checking in member:', name, '\t', email);
			await checkinEvent(event._id, name, email);
			this.setState({ selectedMember: null, name: '', email: '' });
			return flash(`Checked in member: ${name}`, 'green');
		} catch (error) {
			console.error('EventCheckinPage error:', error);
			return flash(err(error));
		}
	};

	checkoutMember = async e => {
		e.preventDefault();
		const { selectedMember, event } = this.state;
		const { flash, clear } = this.props;
		try {
			clear();
			if (!event) return flash('Event does not exist');
			if (!selectedMember) return flash('Please provide your name and email');
			console.log('Selected Member:', selectedMember);
			await checkoutEvent(event._id, selectedMember._id);
			this.setState({ selectedMember: null, name: '', email: '' });
			return flash(`Checked out member: ${selectedMember.name}`, 'green');
		} catch (error) {
			console.error('EventCheckinPage error:', error);
			return flash(err(error));
		}
	};

	render() {
		const { event, loading, selectedMember, members, name, email } = this.state;
		const { user } = this.props;
		if (loading) return <span>Loading...</span>;
		if (!loading && !event) return <CustomRedirect msgRed="Event not found" />;
		if (event.privateEvent && !hasPermission(user, 'events'))
			return <CustomRedirect msgRed="You are not authorized to view this page" />;
		return (
			<div>
				<Header message={shortName(event.name)} />
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
									inputValue={name}
									selectedItem={selectedMember}
									onChange={this.onSelectionChange}
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
														onChange: e => this.onInputChange(e, 'name'),
														id: 'name',
														name: 'name',
														className: 'form-control membersautocomplete',
														placeholder: 'Member Name',
														pattern: '([a-zA-Z]+ )+[a-zA-Z]+',
														title: 'Please enter first and last name'
													})}
												/>
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
									inputValue={email}
									selectedItem={selectedMember}
									onChange={this.onSelectionChange}
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
														onChange: e => this.onInputChange(e, 'email'),
														id: 'email',
														name: 'email',
														className: 'form-control',
														placeholder: 'Member Email'
													})}
												/>
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

export default connect(
	mapStateToProps,
	{ flash: sendFlashMessage, clear: clearFlashMessages }
)(EventCheckinPage);
