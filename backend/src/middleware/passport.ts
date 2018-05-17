import * as passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { MemberModel as Member } from '../models/member';
import { PermissionModel as Permission } from '../models/permission';
import { errorRes } from '../utils';

passport.serializeUser<any, any>((user, done) => {
	done(undefined, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await Member.findById(id)
			.populate({
				path: 'permissions',
				model: Permission
			})
			.populate('password')
			.exec();
		done(null, user);
	} catch (error) {
		done(error, null);
	}
});

export default pass => {
	pass.use(
		new Strategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: CONFIG.SECRET
			},
			async (payload, done) => {
				try {
					const user = await Member.findById(payload._id).exec();
					return user ? done(null, user) : done(null, false);
				} catch (error) {
					console.error('Strategy error:', error);
					return done(error, false);
				}
			}
		)
	);
};

export const auth = () => (req, res, next) =>
	passport.authenticate(
		'jwt',
		{ session: false },
		(err, data, info) => (err || info ? errorRes(res, 401, 'Unauthorized') : next())
	)(req, res, next);
