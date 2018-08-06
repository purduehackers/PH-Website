import * as nodemailer from 'nodemailer';
import { join } from 'path';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import CONFIG from '../config';

const transport = nodemailer.createTransport({
	service: CONFIG.EMAIL_SERVICE,
	auth: {
		user: CONFIG.EMAIL,
		pass: CONFIG.EMAIL_PASSWORD
	}
});

const resetTemplate = compile(readFileSync(join(__dirname, '../emails', 'reset.hbs'), 'utf8'));

const accountCreatedTemplate = compile(
	readFileSync(join(__dirname, '../emails', 'accountCreated.hbs'), 'utf8')
);

export const sendResetEmail = async (
	{ email, name }: { email: string; name: string },
	resetUrl: string
) => {
	return transport.sendMail({
		from: `"${CONFIG.ORG_NAME}" <${CONFIG.EMAIL}>`, // sender address
		to: email, // list of receivers
		subject: 'Reset your Purdue Hackers account password', // Subject line
		html: resetTemplate({
			name,
			resetUrl
		}),
		attachments: [
			{
				filename: 'logo_square_200.png',
				path: join(__dirname, '../emails', 'logo_square_200.png'),
				cid: 'headerImage'
			}
		]
	});
};

export const sendAccountCreatedEmail = async (
	{ email, name }: { email: string; name: string },
	eventName: string,
	eventDate: string,
	resetUrl: string
) =>
	transport.sendMail({
		from: `"${CONFIG.ORG_NAME}" <${CONFIG.EMAIL}>`,
		to: email,
		subject: 'Reset your Purdue Hackers account password',
		html: accountCreatedTemplate({
			name,
			eventName,
			eventDate,
			resetUrl
		}),
		attachments: [
			{
				filename: 'logo_square_200.png',
				path: join(__dirname, '../emails', 'logo_square_200.png'),
				cid: 'headerImage'
			}
		]
	});
