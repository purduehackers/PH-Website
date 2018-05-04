import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as http from 'http';
import * as createError from 'http-errors';
import * as logger from 'morgan';
import * as path from 'path';
import { router as home } from './routes/home';
import { router as users } from './routes/users';

export const app = express();
export const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', home);
app.use('/users', users);

// Serves react app, only used in production
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../../frontend/build')));
	app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../../frontend/build/index.html')));
}

server.listen(PORT, () => {
	console.log(`Started on port ${PORT}`);
});


