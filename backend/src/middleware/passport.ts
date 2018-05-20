import * as passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { MemberModel as Member } from '../models/member';
import { PermissionModel, Permission } from '../models/permission';
import { errorRes, hasPermission } from '../utils';

passport.serializeUser<any, any>((user, done) => {
	done(undefined, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await Member.findById(id)
			.populate({
				path: 'permissions',
				model: PermissionModel
			})
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
					const user = await Member.findById(payload._id)
						.populate({
							path: 'permissions',
							model: PermissionModel
						})
						.lean()
						.exec();
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
	passport.authenticate('jwt', { session: false }, (err, data, info) => {
		req.user = data;
		err || info ? errorRes(res, 401, 'Unauthorized') : next();
	})(req, res, next);

export const permissions = (roles: string[]) => (req, res, next) => {
	if (!req.user || !roles.some(role => hasPermission(req.user, role)))
		return errorRes(res, 401, 'Permission Denied');
	return next();
	// for (const role of roles) {
	// 	console.log('Role:', role);
	// 	const allowed = hasPermission(req.user, role);
	// 	console.log('Has Permission:', allowed);
	// }
	// next();
	// const allowed = roles.some(role => hasPermission(req.user, role));
	// return allowed ? next() : errorRes(res, 401, 'Permission Denied');
};
