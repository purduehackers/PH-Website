require('dotenv').config();

export default {
	...process.env,
	PORT: process.env.PORT || 5000,
	DB: process.env.DB || 'mongodb://localhost:27017/PH',
	SECRET: process.env.SECRET || 'my-secret',
	EXPIRES_IN: process.env.EXPIRES_IN || 10000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	ORG_NAME: process.env.ORG_NAME || 'Purdue Hackers',
	EMAIL: process.env.EMAIL || 'your@email.com',
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'SuperSecretPassword',
	EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail'
};
