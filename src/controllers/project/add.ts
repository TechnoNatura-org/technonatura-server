import * as express from 'express';

import { VerifyAuthToken } from '../checkToken';

import User, { UserBaseDocument } from '../../models/User/User.model';
import Project from '../../models/Project/index';
import UserProjectModel from '../../models/Project/userProject';

import HandleError from './handleErrors';

import * as cloudinary from 'cloudinary';

const ProjectRouterAddProject = express.Router();

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}

ProjectRouterAddProject.post('/', VerifyAuthToken, async (req, res) => {
	const {
		draft,
		thumbnail,
		category,
		title,
		name,
		desc,
		assets,
		classroomId,
		content,
		tags,
	}: {
		draft: boolean;
		thumbnail: string;
		assets: Array<{ url: string; desc: string }>;
		tags: Array<string>;

		category: string;
		title: string;
		name: string;
		desc: string;

		// isTeam: boolean;
		classroomId: string;
		content: string;
	} = req.body;

	if (req.user) {
		const isthere = await Project.findOne({
			owner: req.user.id,
			classroomId,
		});

		if (!isthere) {
			try {
				await cloudinary.v2.config({
					cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
					api_key: process.env.CLOUDINARY_API_KEY,
					api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
					secure: true,
				});
				const thumbnailImage = await cloudinary.v2.uploader.upload(thumbnail, {
					folder: 'TN-Project',
					public_id: `THUMBNAIL_${req.user.id}-${classroomId}_${String(
						Date.now(),
					)}`,
				});
				let finalAssets: Array<{ url: string; desc: string }> = [];

				for (let asset of assets) {
					let rUrl = /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i; // eslint-disable-next-line

					if (!rUrl.test(asset.url)) {
						const assetImage = await cloudinary.v2.uploader.upload(asset.url, {
							folder: 'TN-Project',
							// @ts-ignore
							public_id: `ASSET_${req.user.id}-${name}_${String(Date.now())}`,
						});
						finalAssets.push({
							url: assetImage.url,
							desc: asset.desc,
						});

						continue;
					}

					finalAssets.push({ url: asset.url, desc: asset.desc });
				}

				console.log('finalAssets !!', finalAssets);

				const project = new Project({
					owner: req.user.id,
					// @ts-ignore
					grade: req.user.roleInTechnoNatura.grade,
					// @ts-ignore
					gradePeriod: req.user.roleInTechnoNatura.startPeriod,
					name,
					title,
					// draft: false,
					category,
					desc,
					content,
					// @ts-ignore
					branch: req.user.roleInTechnoNatura.branch,
					classroomId,
					tags,
					assets: finalAssets,
					thumbnail: thumbnailImage.url,
				});

				await project.save();

				const isThere = await UserProjectModel.findOne({
					userId: req.user.id,
				});
				if (
					!isThere &&
					// @ts-ignore
					req.user.roleInTechnoNatura.student
				) {
					const user = new UserProjectModel({
						userId: req.user.id,
						projects: 1,
					});
					await user.save();
				} else {
					await UserProjectModel.findOne({
						userId: req.user.id,
					}).updateOne({
						$inc: {
							projects: 1,
						},
					});
				}

				res.json({
					status: 'success',
					message: 'project successfully created!',
					project: project,
				});
				return;
			} catch (err) {
				const errors = await HandleError(Object(err), req.body);
				res.json({
					status: 'error',
					message:
						Object.keys(errors).length == 0
							? 'Error occured'
							: 'Error occured on input validation.',
					errMessage: String(err),
					errors: errors,
				});
				return;
			}
		} else {
			res.json({
				status: 'error',
				message: 'You already had project with this classroom assignment.',
			});
		}
	}
});

export default ProjectRouterAddProject;
