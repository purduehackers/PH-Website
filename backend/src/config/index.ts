require('dotenv').config();

declare var CONFIG: any;

CONFIG = {
	PORT: process.env.PORT || 5000,
	DB: process.env.DB || 'mongodb://localhost:27017/PH',
	SECRET: process.env.SECRET || 'my-secret',
	EXPIRES_IN: process.env.EXPIRES_IN || 10000,
	NODE_ENV: process.env.NODE_ENV || 'development'
};
