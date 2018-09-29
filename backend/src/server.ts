import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as yes from 'yes-https';
import { join, resolve } from 'path';
import CONFIG from './config';
import passportMiddleWare, { extractUser } from './middleware/passport';
import { router as auth } from './routes/auth';
import { router as home } from './routes/home';
import { router as members } from './routes/members';
import { router as events } from './routes/events';
import { router as jobs } from './routes/jobs';
import { router as locations } from './routes/locations';
import { router as credentials } from './routes/credentials';
import { router as permissions } from './routes/permissions';
import { router as autocomplete } from './routes/autocomplete';
const { NODE_ENV, DB } = CONFIG;

export default class Server {
	public static async createInstance() {
		const server = new Server();
		await server.mongoSetup();
		return server;
	}
	public app: express.Application;
	public mongoose: typeof mongoose;

	private constructor() {
		this.app = express();
		this.setup();
	}

	private setup(): void {
		this.setupMiddleware();
		this.setupRoutes();
	}

	private setupMiddleware() {
		this.app.use(helmet());
		if (NODE_ENV !== 'test')
			NODE_ENV !== 'production'
				? this.app.use(logger('dev'))
				: this.app.use(logger('tiny'));

		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser());
		this.app.use(passportMiddleWare(passport).initialize());
		this.app.use(extractUser());
		this.app.use(cors());
		this.app.use(express.static(join(__dirname, '../frontend/build')));

		this.app.use(helmet());
		if (NODE_ENV === 'production') this.app.use(yes());
		if (NODE_ENV !== 'test')
			NODE_ENV !== 'production'
				? this.app.use(logger('dev'))
				: this.app.use(logger('tiny'));
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser());
		this.app.use(passportMiddleWare(passport).initialize());
		this.app.use(cors());
		this.app.use(extractUser());
		this.app.use(express.static(join(__dirname, '../frontend/build')));
	}

	private setupRoutes() {
		this.app.use('/api', home);
		this.app.use('/api/auth', auth);
		this.app.use('/api/members', members);
		this.app.use('/api/events', events);
		this.app.use('/api/jobs', jobs);
		this.app.use('/api/locations', locations);
		this.app.use('/api/credentials', credentials);
		this.app.use('/api/permissions', permissions);
		this.app.use('/api/autocomplete', autocomplete);

		// Serves react app, only used in production
		this.app.get('*', (req, res) =>
			res.sendFile(resolve(__dirname, '../frontend/build/index.html'))
		);
	}

	private async mongoSetup() {
		try {
			this.mongoose = await mongoose.connect(
				DB,
				{ useNewUrlParser: true }
			);
			this.mongoose.Promise = Promise;
			console.log('Connected to Mongo:', DB);
			return this.mongoose;
		} catch (error) {
			console.error('Error connecting to mongo:', error);
			return process.exit(1);
		}
	}
}
