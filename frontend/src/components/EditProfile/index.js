import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import validator from 'validator';
import { sendFlashMessage, clearFlashMessages } from '../../actions';
import { memberMatches } from '../../constants';
import { CustomRedirect } from '../Common';

class EditProfilePage extends Component {
	static propTypes = {
		match: PropTypes.shape({
			params: PropTypes.shape({
				id: PropTypes.string
			})
		}).isRequired,
		flash: PropTypes.func.isRequired,
		clear: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);
		const { user } = this.props;
		this.state = {
			name: user ? user.name : '',
			email: user ? user.email : '',
			password: '',
			passwordConfirm: '',
			graduationYear: user ? user.graduationYear : new Date().getFullYear() + 4
		};
		console.log('Signup page props', this.props);
	}

	onChange = e => this.setState({ [e.target.id]: e.target.value });

	render() {
		if (!memberMatches(this.props.user, this.props.match.params.id))
			return <CustomRedirect msgRed="Member not found" />;

		let major;
		const member = this.props.user;
		return (
			<div className="section">
				<div className="section-container">
					<h3>
						Member - {member.name}
						<a
							href="{{ action('MemberController@getMember', $member->username) }}"
							className="pull-left"
						>
							<button type="button" className="btn btn-primary btn-sm">
								<span className="glyphicon glyphicon-chevron-left" aria-hidden="true" />{' '}
								Profile
							</button>
						</a>
					</h3>

					<div className="panel panel-default">
						<form
							method="post"
							action="{{ $member->profileURL() }}"
							encType="multipart/form-data"
							className="panel-body validate"
						>
							<p className="text-muted text-center">Fields marked with an * are required</p>
							<label htmlFor="memberName">
								Full Name *
								<div className="text-right pull-right">
									<span style="font-size: 8px;">
										(Restrict your profile to only members)
									</span>{' '}
									Private Profile
								</div>
							</label>
							<div className="input-group">
								<input
									type="text"
									name="memberName"
									id="memberName"
									placeholder="Full Name"
									value="{{ $member->name }}"
									className="form-control"
									data-bvalidator="required"
									data-bvalidator-msg="Please enter your full name"
								/>
								<span className="input-group-addon" id="privateProfileGroup">
									<input
										type="checkbox"
										name="privateProfile"
										id="privateProfile"
										value="true"
										checked={member.privateProfile ? 'checked' : ''}
									/>
								</span>
							</div>
							<br />
							<label htmlFor="username">Username *</label>
							<input
								type="text"
								name="username"
								id="username"
								placeholder="Username"
								value="{{ $member->username }}"
								className="form-control"
								data-bvalidator="required,alphanum,regex[^\S+$]"
								data-bvalidator-msg="Your username must be alphanumeric"
							/>
							<br />
							<label htmlFor="picture">Profile Picture (JPG or PNG)</label>
							@if ($member->picture)
							<a href="{{ $member->picturePath() }}" className="form-control">
								{member.picture}
							</a>
							@endif
							<input type="file" name="picture" id="picture" className="form-control" />
							<br />
							<label htmlFor="email">
								Account Email *
								<div className="text-right pull-right">
									<span style="font-size: 8px;">
										(Stop receiving auto-generated emails)
									</span>{' '}
									Unsubscribe
								</div>
							</label>
							<div className="input-group">
								<input
									type="email"
									name="email"
									id="email"
									placeholder="Email"
									value="{{ $member->email }}"
									className="form-control"
									data-bvalidator="required,email"
									data-bvalidator-msg="An email is required for your account."
								/>
								<span className="input-group-addon" id="unsubscribedGroup">
									<input
										type="checkbox"
										name="unsubscribed"
										id="unsubscribed"
										value="true"
										checked={member.unsubscribed ? 'checked' : ''}
									/>
								</span>
							</div>
							<br />
							<br />
							@if (isset($setPassword))
							<label htmlFor="password">Password *</label>
							<input
								type="password"
								name="password"
								id="password"
								placeholder="Password"
								className="form-control"
								data-bvalidator="required"
								data-bvalidator-msg="A password is required"
							/>
							<br />
							<label htmlFor="confirmPassword">Confirm Password *</label>
							<input
								type="password"
								name="confirmPassword"
								id="confirmPassword"
								placeholder="Confirm Password"
								className="form-control"
								data-bvalidator="required,equalto[password]"
								data-bvalidator-msg="Password does not match"
							/>
							<br />
							@endif
							<label htmlFor="phone">
								Cell Phone Number (private, only for text notifications)
							</label>
							<input
								type="text"
								name="phone"
								id="phone"
								placeholder="Cell Phone Number"
								value="{{ $member->phone }}"
								className="form-control"
								data-bvalidator="minlength[10]"
								data-bvalidator-msg="Please enter a valid cell phone # (with area code)"
							/>
							<br />
							<label htmlFor="email_public">Public Email</label>
							<input
								type="text"
								name="email_public"
								id="email_public"
								placeholder="Public Email"
								value="{{ $member->email_public }}"
								className="form-control"
								data-bvalidator="email"
								data-bvalidator-msg="Please enter a valid email address. (Optional)"
							/>
							<br />
							<label htmlFor="description">Public Message</label>
							<textarea
								name="description"
								id="description"
								className="form-control"
								placeholder="Public Message"
							>
								{member.description}
							</textarea>
							<br />
							<label htmlFor="gradYear">Year of Graduation *</label>
							<input
								type="number"
								name="gradYear"
								id="gradYear"
								placeholder="Graduation Year"
								value="{{ $member->graduation_year}}"
								className="form-control"
								data-bvalidator="required,number,between[1900:2100]"
								data-bvalidator-msg="A graduation year is required"
							/>
							<br />
							<label htmlFor="major">Major</label>
							<select name="major" id="major" className="form-control">
								<option value="">Select</option>
								@foreach ($majors as $major)
								<option
									value="{{ $major->id }}"
									selected={member.major_id == major.id ? 'selected' : ''}
								>
									{major.name}
								</option>
								@endforeach
							</select>
							<br />
							<label htmlFor="gender">Gender</label>
							<select
								name="gender"
								id="gender"
								className="form-control"
								selected={member.gender != '' ? 'data-bvalidator="required"' : ''}
							>
								<option value="">Select</option>
								<option
									value="Female"
									selected={member.gender == 'Female' ? 'selected' : ''}
								>
									Female
								</option>
								<option value="Male" selected={member.gender == 'Male' ? 'selected' : ''}>
									Male
								</option>
								<option value="Other" selected={member.gender == 'Other' ? 'selected' : ''}>
									Other
								</option>
								<option value="No" selected={member.gender == 'No' ? 'selected' : ''}>
									Prefer Not To Answer
								</option>
							</select>
							<br />
							<label htmlFor="facebook">Facebook Profile</label>
							<input
								type="text"
								name="facebook"
								id="facebook"
								placeholder="Facebook Profile"
								value="{{ $member->facebook }}"
								className="form-control"
								data-bvalidator="url"
								data-bvalidator-msg="Please enter a valid URL to your Facebook Profile."
							/>
							<br />
							<label htmlFor="github">Github Profile</label>
							<input
								type="text"
								name="github"
								id="github"
								placeholder="Github Profile"
								value="{{ $member->github }}"
								className="form-control"
								data-bvalidator="url"
								data-bvalidator-msg="Please enter a valid URL to your Github Profile."
							/>
							<br />
							<label htmlFor="linkedin">LinkedIn Profile</label>
							<input
								type="text"
								name="linkedin"
								id="linkedin"
								placeholder="LinkedIn Profile"
								value="{{ $member->linkedin }}"
								className="form-control"
								data-bvalidator="url"
								data-bvalidator-msg="Please enter a valid URL to your LinkedIn Profile."
							/>
							<br />
							<label htmlFor="devpost">Devpost Profile</label>
							<input
								type="text"
								name="devpost"
								id="devpost"
								placeholder="Devpost Profile"
								value="{{ $member->devpost }}"
								className="form-control"
								data-bvalidator="url"
								data-bvalidator-msg="Please enter a valid URL to your Devpost Profile."
							/>
							<br />
							<label htmlFor="website">Personal Website</label>
							<input
								type="text"
								name="website"
								id="website"
								placeholder="Personal Website"
								value="{{ $member->website }}"
								className="form-control"
								data-bvalidator="url"
								data-bvalidator-msg="Please enter a valid URL to your Personal Website."
							/>
							<br />
							<label htmlFor="resume">Resume (PDF)</label>
							@if ($member->resume)
							<a href="{{ $member->resumePath() }}" className="form-control">
								{member.resume}
							</a>
							@endif
							<input type="file" name="resume" id="resume" className="form-control" />
							<br />
							<label htmlFor="linktoresume">Link to Resume</label>
							<input
								type="text"
								name="linktoresume"
								id="linktoresume"
								placeholder="Link to Resume"
								value="{{ $member->linktoresume }}"
								className="form-control"
								data-bvalidator="url"
								data-bvalidator-msg="Please enter a valid URL to your Resume."
							/>
							<br />
							@if (!isset($setPassword)) @if (Gate::allows('permission', 'members'))
							<a href="{{ $member->reset_url() }}" className="btn btn-warning pull-left">
								Reset Password
							</a>
							@elseif (Gate::allows('member-matches',$member))
							<a href="{{ $member->reset_url() }}" className="btn btn-warning pull-left">
								Change Password
							</a>
							@endif @endif
							<input
								type="submit"
								value="Update Profile"
								className="btn btn-primary pull-right"
							/>
						</form>
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
	EditProfilePage
);
