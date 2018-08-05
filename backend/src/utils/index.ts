import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import * as GoogleCloudStorage from '@google-cloud/storage';
import { IMemberModel, Member } from '../models/member';

const storage = GoogleCloudStorage({
	projectId: 'purduehackers-212319',
	keyFilename: 'purduehackers.json'
});

const bucket = storage.bucket('purduehackers');
bucket.makePublic();

export const successRes = (res: Response, response: any) => res.json({ status: 200, response });

export const errorRes = (res: Response, status: number, error: any) =>
	res.status(status).json({
		status,
		error
	});

export const hasPermission = (user: IMemberModel, name: string) =>
	user.permissions.some(per => per.name === name || per.name === 'admin');

export const isAdmin = (user: IMemberModel) => hasPermission(user, 'admin');

export const memberMatches = (user: IMemberModel, id: ObjectId | string) =>
	user &&
	(hasPermission(user, 'admin') ||
		user._id === id ||
		(typeof user._id.equals === 'function' && user._id.equals(id)));

export const escapeRegEx = (str: string) =>
	str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

export function to<T, U = any>(
	promise: Promise<T>,
	errorExt?: object
): Promise<[T | null, U | null]> {
	return promise.then<[T, null]>((data: T) => [data, null]).catch<[null, U]>(err => {
		if (errorExt) Object.assign(err, errorExt);

		return [null, err];
	});
}

export const uploadToStorage = (file: Express.Multer.File, folder: string, user: IMemberModel) =>
	new Promise<string>((resolve, reject) => {
		if (!file) reject('No image file');
		else if (folder === 'pictures' && !file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
			reject(`File: ${file.originalname} is an invalid image type`);
		else if (folder === 'resume' && !file.originalname.match(/\.(png|PNG)$/))
			reject(`File: ${file.originalname} is an invalid image type`);
		else {
			const fileName = `${folder}/${user.email.replace('@', '_')}`;
			const fileUpload = bucket.file(fileName);

			const blobStream = fileUpload.createWriteStream({
				metadata: {
					contentType: file.mimetype
				}
			});

			blobStream.on('error', error => {
				console.error(error);
				reject('Something is wrong! Unable to upload at the moment.');
			});

			blobStream.on('finish', async () => {
				// The public URL can be used to directly access the file via HTTP.
				resolve(`https://storage.googleapis.com/purduehackers/${fileName}`);
			});

			blobStream.end(file.buffer);
		}
	});
