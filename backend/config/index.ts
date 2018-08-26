import { join } from 'path';
// require('dotenv').config();
require('dotenv').config({ path: join(__dirname, '../../', '.env') });

const env = process.env;

const config = {
	...env,
	PORT: env.PORT || 5000,
	DB: env.DB || 'mongodb://localhost:27017/PH',
	MONGO_USER: env.MONGO_USER || 'my-user',
	MONGO_PASSWORD: env.MONGO_PASSWORD || 'my-password',
	SECRET: env.SECRET || 'my-secret',
	EXPIRES_IN: env.EXPIRES_IN || 10000,
	NODE_ENV: env.NODE_ENV || 'development',
	CREDENTIAL_SECRET: env.CREDENTIAL_SECRET || 'CredentialSecret',
	ORG_NAME: env.ORG_NAME || 'Purdue Hackers',
	EMAIL: env.EMAIL || 'your@email.com',
	EMAIL_PASSWORD: env.EMAIL_PASSWORD || 'SuperSecretPassword',
	EMAIL_SERVICE: env.EMAIL_SERVICE || 'gmail',
	MAILGUN_DOMAIN: env.MAILGUN_DOMAIN || 'mydomain',
	MAILGUN_SECRET: env.MAILGUN_SECRET || 'mysecret'
};

export default config;
