import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as paginate from 'express-paginate';
import * as http from 'http';
import * as logger from 'morgan';
import * as path from 'path';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as cors from 'cors';
// tslint:disable-next-line:no-import-side-effect
import './config';
import passportMiddleWare from './middleware/passport';
import { router as auth } from './routes/auth';
import { router as home } from './routes/home';
import { router as members } from './routes/members';
import { router as events } from './routes/events';
import { router as jobs } from './routes/jobs';
import { router as credentials } from './routes/credentials';
import { router as permissions } from './routes/permissions';
import { router as autocomplete } from './routes/autocomplete';

export const app = express();
export const server = http.createServer(app);
const { PORT, DB, SECRET } = CONFIG;

mongoose.connect(DB);

passportMiddleWare(passport);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	session({
		name: 'PH-token',
		secret: SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false,
			httpOnly: true
		}
	})
);
app.use(passport.initialize());
// app.use(passport.session());
app.use(cors());

app.use(paginate.middleware(20, 50));
app.use('/api', home);
app.use('/api/auth', auth);
app.use('/api/members', members);
app.use('/api/events', events);
app.use('/api/jobs', jobs);
app.use('/api/credentials', credentials);
app.use('/api/permissions', permissions);
app.use('/api/autocomplete', autocomplete);

// Serves react app, only used in production
app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.get('*', (req, res) =>
	res.sendFile(path.resolve(__dirname, '../../frontend/build/index.html'))
);

server.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});
