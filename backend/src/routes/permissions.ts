import * as express from 'express';
import { ObjectId } from 'mongodb';
import { IPermissionModel, Permission } from '../models/permission';
import { Member } from '../models/member';
import { auth, hasPermissions } from '../middleware/passport';
import { successRes, errorRes, to, addMemberToPermission } from '../utils';
export const router = express.Router();

// TODO: Add logic to delete permissons from members document when deleting a permission
router.get('/', auth(), hasPermissions(['permissions']), async (req, res) => {
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

router.post('/', auth(), hasPermissions(['permissions']), async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) return errorRes(res, 400, 'Permission must have a name');
		if (!description)
			return errorRes(res, 400, 'Permission must have a description');
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

router.get(
	'/:id',
	auth(),
	hasPermissions(['permissions']),
	async (req, res) => {
		if (!ObjectId.isValid(req.params.id))
			return errorRes(res, 400, 'Invalid permision ID');
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
	}
);

router.delete(
	'/:id',
	auth(),
	hasPermissions(['permissions']),
	async (req, res) => {
		if (!ObjectId.isValid(req.params.id))
			return errorRes(res, 400, 'Invalid permision ID');
		const [permission, error] = await to(
			Permission.findById(req.params.id).exec()
		);
		if (error) {
			console.error(error.message);
			return errorRes(res, 500, 'Error getting permission');
		}
		if (permission) await permission.remove();
		return successRes(res, permission);
	}
);

// prettier-ignore
router.post('/:id', auth(), hasPermissions(['permissions']), async (req, res) => {

	const { email } = req.body;
	if (!ObjectId.isValid(req.params.id))
		return errorRes(res, 400, 'Invalid permision ID');

	try {
		let [[member, permission], e] = await to(
			Promise.all([
				Member.findOne({
					$or: [{ name: email }, { email }]
				}).exec(),
				Permission.findById(req.params.id).exec()
			])
		);

		if (!member) return errorRes(res, 400, 'Member not found');
		if (!permission) return errorRes(res, 400, 'Permission not found');
		if (e) {
			console.error(e.message);
			return errorRes(res, 500, e.message);
		}

		[member, permission] = await addMemberToPermission(member, permission, req.user);
		// [[member, permission], e] = await to(
		// 	Promise.all([
		// 		Member.findByIdAndUpdate(
		// 			member._id,
		// 			{
		// 				$push: {
		// 					permissions: permission._id
		// 				}
		// 			},
		// 			{ new: true }
		// 		).exec(),
		// 		Permission.findByIdAndUpdate(
		// 			permission._id,
		// 			{
		// 				$push: {
		// 					members: {
		// 						member: member._id,
		// 						recordedBy: req.user._id,
		// 						dateAdded: new Date()
		// 					}
		// 				}
		// 			},
		// 			{ new: true }
		// 		)
		// 			.populate({
		// 				path: 'members.member',
		// 				model: Member
		// 			})
		// 			.populate({
		// 				path: 'members.recordedBy',
		// 				model: Member
		// 			})
		// 			.exec()
		// 	])
		// );

		// if (e) {
		// 	console.error(e.message);
		// 	return errorRes(res, 500, 'Error adding permission to member');
		// }
		return successRes(res, {
			permission,
			member
		});
	} catch (error) {
		console.error(error.message);
		return errorRes(res, 500, error);
	}
});

// prettier-ignore
router.delete('/:id/member/:memberID', auth(), hasPermissions(['permissions']), async (req, res) => {
		const { id, memberID } = req.params;
		if (!ObjectId.isValid(id)) return errorRes(res, 400, 'Invalid permision ID');
		if (!ObjectId.isValid(memberID)) return errorRes(res, 400, 'Invalid member ID');

		let [[member, permission], e] = await to(
			Promise.all([Member.findById(memberID).exec(), Permission.findById(id).exec()])
		);

		if (!member) return errorRes(res, 400, 'Member not found');
		if (!permission) return errorRes(res, 400, 'Permission not found');
		if (e) {
			console.error(e.message);
			return errorRes(res, 500, e.message);
		}

		[[member, permission], e] = await to(
			Promise.all([
				Member.findByIdAndUpdate(
					member._id,
					{
						$pull: {
							permissions: permission._id
						}
					},
					{ new: true }
				).exec(),
				Permission.findByIdAndUpdate(
					permission._id,
					{
						$pull: {
							members: {
								member: member._id
							}
						}
					},
					{ new: true }
				)
					.populate({
						path: 'members.member',
						model: Member
					})
					.populate({
						path: 'members.recordedBy',
						model: Member
					})
					.exec()
			])
		);

		if (e) {
			console.error(e.message);
			return errorRes(res, 500, 'Error adding member to permission');
		}

		return successRes(res, {
			permission,
			member
		});

	}
);
