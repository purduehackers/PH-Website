import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as http from 'http';
import * as createError from 'http-errors';
import * as logger from 'morgan';
import * as path from 'path';
import * as mongoose from 'mongoose';
import { router as home } from './routes/home';
import { router as users } from './routes/users';

export const app = express();
export const api = express.Router();
export const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const DB = process.env.DB || 'mongodb://localhost:27017/PH';
mongoose.connect(DB);

api.use('/', home);
api.use('/users', users);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', api);
// Serves react app, only used in production
app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../../frontend/build/index.html')));

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
