import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import * as GoogleCloudStorage from '@google-cloud/storage';
import * as Multer from 'multer';
import { IMemberModel, Member } from '../models/member';
export * from './email';

const storage = GoogleCloudStorage({
	projectId: 'purduehackers-212319',
	keyFilename: 'purduehackers.json'
});

const bucket = storage.bucket('purduehackers');

export const multer = Multer({
	storage: Multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
	}
});

export const successRes = (res: Response, response: any) =>
	res.json({ status: 200, response });

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

const dateToString = date =>
	new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		weekday: 'short'
	});

export const formatDate = date => {
	if (!date) return 'Current';
	const str = dateToString(date);
	return str !== 'Invalid Date' ? str : 'Current';
};

export function to<T, U = any>(
	promise: Promise<T>,
	errorExt?: object
): Promise<[T | null, U | null]> {
	return promise
		.then<[T, null]>((data: T) => [data, null])
		.catch<[null, U]>(err => {
			if (errorExt) Object.assign(err, errorExt);

			return [null, err];
		});
}

export const uploadToStorage = async (
	file: Express.Multer.File,
	folder: string,
	user: IMemberModel
) => {
	if (!file) return 'No image file';
	else if (
		folder === 'pictures' &&
		!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)
	)
		return `File: ${file.originalname} is an invalid image type`;
	else if (folder === 'resume' && !file.originalname.match(/\.(png|PNG)$/))
		return `File: ${file.originalname} is an invalid image type`;

	const fileName = `${folder}/${user.email.replace('@', '_')}`;
	const fileUpload = bucket.file(fileName);

	return new Promise<string>((resolve, reject) => {
		const blobStream = fileUpload.createWriteStream({
			metadata: {
				contentType: file.mimetype,
				cacheControl: 'no-cache, max-age=0'
			}
		});

		blobStream.on('error', error => {
			console.error(error);
			reject('Something is wrong! Unable to upload at the moment.');
		});

		blobStream.on('finish', () => {
			// The public URL can be used to directly access the file via HTTP.
			fileUpload.getMetadata().then(meta => resolve(meta['0'].mediaLink));
		});

		blobStream.end(file.buffer);
	});
};
