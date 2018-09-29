import * as nodemailer from 'nodemailer';
import { Request } from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as jwt from 'jsonwebtoken';
import { compile } from 'handlebars';
import CONFIG from '../config';
import { IEventModel } from '../models/event';
import { IMemberModel } from '../models/member';
import { formatDate } from './';

const transport = nodemailer.createTransport({
	host: 'smtp.sendgrid.net',
	port: 465,
	auth: {
		user: 'apikey',
		pass: CONFIG.SENDGRID_KEY
	}
});

const resetTemplate = compile(
	readFileSync(join(__dirname, '../emails', 'reset.hbs'), 'utf8')
);

const accountCreatedTemplate = compile(
	readFileSync(join(__dirname, '../emails', 'accountCreated.hbs'), 'utf8')
);

const _sendResetEmail = async (
	{ email, name }: { email: string; name: string },
	resetUrl: string
) =>
	transport.sendMail({
		from: `"${CONFIG.ORG_NAME}" <${CONFIG.EMAIL}>`, // sender address
		to: email, // list of receivers
		subject: 'Reset your Purdue Hackers account password', // Subject line
		html: resetTemplate({
			name,
			resetUrl
		}),
		attachments: [
			{
				filename: 'headerImage.png',
				path: join(__dirname, '../emails', 'headerImage.png'),
				cid: 'headerImage'
			}
		]
	});

export const sendResetEmail = async (member: IMemberModel, req: Request) => {
	const token = jwt.sign({ id: member._id }, CONFIG.SECRET, {
		expiresIn: '2 days'
	});
	member.resetPasswordToken = token;
	await member.save();
	const resetUrl = `${req.protocol}://${req.get(
		'host'
	)}/reset?token=${token}`;
	return await _sendResetEmail(member, resetUrl);
};

const _sendAccountCreatedEmail = async (
	{ email, name }: { email: string; name: string },
	eventName: string,
	eventDate: Date,
	resetUrl: string
) =>
	transport.sendMail({
		from: `"${CONFIG.ORG_NAME}" <${CONFIG.EMAIL}>`,
		to: email,
		subject: 'Reset your Purdue Hackers account password',
		html: accountCreatedTemplate({
			name,
			eventName,
			eventDate: formatDate(eventDate),
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

export const sendAccountCreatedEmail = async (
	member: IMemberModel,
	event: IEventModel,
	req: Request
) => {
	const token = jwt.sign({ id: member._id }, CONFIG.SECRET, {
		expiresIn: '2 days'
	});
	member.resetPasswordToken = token;
	await member.save();
	const resetUrl = `${req.protocol}://${req.get(
		'host'
	)}/reset?token=${token}`;
	return await _sendAccountCreatedEmail(
		member,
		event.name,
		event.eventTime,
		resetUrl
	);
};
