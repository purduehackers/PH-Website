import * as express from 'express';
import { ObjectId } from 'mongodb';
import { IPermissionModel, Permission } from '../models/permission';
import { Member } from '../models/member';
import { auth, hasPermissions } from '../middleware/passport';
import { successRes, errorRes, to } from '../utils';
export const router = express.Router();

router.get('/', auth(), hasPermissions(['permissions']), async (req, res, next) => {
	const [permissions, error] = await to(
		Permission.find()
			.where('organizer')
			.ne(0)
			.exec()
	);
	if (error) {
		console.error(error.message);
		return errorRes(res, 500, 'Error getting permissions');
	}
	return successRes(res, permissions);
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
	if (!ObjectId.isValid(req.params.id)) return errorRes(res, 400, 'Invalid permision ID');
	const [permission, error] = await to(
		Permission.findById(req.params.id)
			.populate({
				path: 'members.member',
				model: Member
			})
			.populate({
				path: 'members.recordedBy',
				model: Member
			})
			.exec()
	);
	if (error) {
		console.error(error.message);
		return errorRes(res, 500, 'Error getting permission');
	}
	return successRes(res, permission);
});

router.delete('/:id', auth(), hasPermissions(['permissions']), async (req, res, next) => {
	if (!ObjectId.isValid(req.params.id)) return errorRes(res, 400, 'Invalid permision ID');
	const [permission, error] = await to(Permission.findById(req.params.id).exec());
	if (error) {
		console.error(error.message);
		return errorRes(res, 500, 'Error getting permission');
	}
	if (permission) await permission.remove();
	return successRes(res, permission);
});
