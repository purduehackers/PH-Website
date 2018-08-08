require('dotenv').config();

const env = process.env;

export default {
	...env,
	PORT: env.PORT || 5000,
	DB: env.DB || 'mongodb://localhost:27017/PH',
	SECRET: env.SECRET || 'my-secret',
	EXPIRES_IN: env.EXPIRES_IN || 10000,
	NODE_ENV: env.NODE_ENV || 'development',
	CREDENTIAL_SECRET: env.CREDENTIAL_SECRET || 'CredentialSecret',
	ORG_NAME: env.ORG_NAME || 'Purdue Hackers',
	EMAIL: env.EMAIL || 'your@email.com',
	EMAIL_PASSWORD: env.EMAIL_PASSWORD || 'SuperSecretPassword',
	EMAIL_SERVICE: env.EMAIL_SERVICE || 'gmail'
};
