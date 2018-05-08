import * as passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserModel as User } from '../models/user';
import { errorRes } from '../utils';

passport.serializeUser<any, any>((user, done) => {
	done(undefined, user.id);
});

passport.deserializeUser((id, done) =>
	User.findById(id, (err, user) => {
		done(err, user);
	})
);

export default passport => {
	passport.use(
		new Strategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: CONFIG.SECRET
			},
			async (payload, done) => {
				try {
					const user = await User.findById(payload._id).exec();
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
