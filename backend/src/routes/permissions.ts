import * as express from 'express';
import { IPermissionModel, Permission } from '../models/permission';
import { auth, hasPermissions } from '../middleware/passport';
import { successRes, errorRes } from '../utils';
export const router = express.Router();

router.get('/', auth(), hasPermissions(['permissions']), async (req, res, next) => {
	try {
		const permissions = await Permission.find().exec();
		return successRes(res, permissions);
	} catch (error) {
		console.error(error.message);
		return errorRes(res, 500, error.message);
	}
});

router.post('/', auth(), hasPermissions(['permissions']), async (req, res, next) => {
	try {
		const { name, description } = req.body;
		if (!name) return errorRes(res, 400, 'Permission must have a name');
		if (!description) return errorRes(res, 400, 'Permission must have a description');
		const permission = new Permission({
			name,
			description
		});
		await permission.save();
		return successRes(res, permission);
	} catch (error) {
		console.error(error.message);
		return errorRes(res, 500, error.message);
	}
});

router.get('/:id', auth(), hasPermissions(['permissions']), async (req, res, next) => {
	try {
		const permission = await Permission.findById(req.params.id).exec();
		return successRes(res, permission);
	} catch (error) {
		console.error(error.message);
		return errorRes(res, 500, error.message);
	}
});

router.delete('/:id', auth(), hasPermissions(['permissions']), async (req, res, next) => {
	try {
		const permission = await Permission.findById(req.params.id).exec();
		await permission.remove();
		return successRes(res, permission);
	} catch (error) {
		console.error(error.message);
		return errorRes(res, 500, error.message);
	}
});
