import * as express from 'express';
import * as passport from 'passport';
import { AES, enc } from 'crypto-js';
import { ICredentialModel, Credential } from '../models/credential';
import { auth, hasPermissions } from '../middleware/passport';
import { successRes, errorRes } from '../utils';
export const router = express.Router();

router.get('/', auth(), hasPermissions(['credentials']), async (req, res, next) => {
	try {
		const credentials = await Credential.find().exec();
		return successRes(res, credentials);
	} catch (error) {
		console.error(error.message);
		return errorRes(res, 500, error.message);
	}
});

router.post('/', auth(), hasPermissions(['credentials']), async (req, res, next) => {
	try {
		const { site, username, password, description } = req.body;
		if (!site) return errorRes(res, 400, 'Credential must have a site');
		if (!username) return errorRes(res, 400, 'Credential must have a username');
		if (!password) return errorRes(res, 400, 'Credential must have a password');
		const credential = new Credential({
			site,
			username,
			password,
			description
		});
		await credential.save();
		credential.password = AES.decrypt(credential.password, CONFIG.SECRET).toString(enc.Utf8);
		return successRes(res, credential);
	} catch (error) {
		console.error(error);
		return errorRes(res, 500, error);
	}
});

router.get('/:id', auth(), hasPermissions(['credentials']), async (req, res, next) => {
	try {
		const credential = await Credential.findById(req.params.id).exec();
		return successRes(res, credential);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});

router.delete('/:id', auth(), hasPermissions(['credentials']), async (req, res, next) => {
	try {
		const credential = await Credential.findById(req.params.id).exec();
		await credential.remove();
		return successRes(res, credential);
	} catch (error) {
		return errorRes(res, 500, error);
	}
});
