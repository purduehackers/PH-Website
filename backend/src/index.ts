import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as paginate from 'express-paginate';
import * as http from 'http';
import * as createError from 'http-errors';
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
import { router as users } from './routes/users';

export const app = express();
export const api = express.Router();
export const server = http.createServer(app);
const { PORT, DB } = CONFIG;

mongoose.connect(DB);

passportMiddleWare(passport);

app.disable('etag');
app.use(logger('dev'));
app.use(express.json());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors());

app.use(paginate.middleware(20, 50));
api.use('/', home);
api.use('/auth', auth);
api.use('/users', users);
api.use('/members', members);

app.use('/api', api);

// Serves react app, only used in production
app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.get('*', (req, res) =>
	res.sendFile(path.resolve(__dirname, '../../frontend/build/index.html'))
);

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
