import * as express from 'express';

import { VerifyAuthToken } from '../checkToken';

import User, { UserBaseDocument } from '../../models/User/User.model';
import Project from '../../models/Project/index';
import HandleError from './handleErrors';

import * as cloudinary from 'cloudinary';

const ClassroomRouterAddClass = express.Router();

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}

ClassroomRouterAddClass.post('/', VerifyAuthToken, async (req, res) => {
	let {
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
		projectName,
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
		projectName: string;
	} = req.body;

	if (req.user) {
		const isthere = await Project.findOne({
			owner: req.user.id,
			name: projectName,
		});

		if (isthere) {
			try {
				let thumbnailImage: string = '';
				if (isthere.thumbnail != thumbnail) {
					await cloudinary.v2.config({
						cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
						api_key: process.env.CLOUDINARY_API_KEY,
						api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
						secure: true,
					});
					const uploadedImage = await cloudinary.v2.uploader.upload(thumbnail, {
						folder: 'TN-Project',
						public_id: `THUMBNAIL_${req.user.id}-${classroomId}_${String(
							Date.now(),
						)}`,
					});
					thumbnailImage = uploadedImage.url;
				} else {
					thumbnailImage = thumbnail;
				}

				let finalAssets: Array<{ url: string; desc: string }> = [];

				for (let i = 0; i < assets.length; i++) {
					let rUrl = /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i; // eslint-disable-next-line
					let asset = assets[i];

					if (
						!isthere.assets[i] ||
						(isthere.assets[i] && isthere.assets[i].url != asset.url)
					) {
						if (!rUrl.test(asset.url)) {
							const assetImage = await cloudinary.v2.uploader.upload(
								asset.url,
								{
									folder: 'TN-Project',
									// @ts-ignore
									public_id: `ASSET_${req.user.id}-${name}_${String(
										Date.now(),
									)}`,
								},
							);
							finalAssets.push({
								url: assetImage.url,
								desc: asset.desc,
							});

							continue;
						}
					} else {
						finalAssets.push({ url: asset.url, desc: asset.desc });
					}
				}

				// console.log('finalAssets !!', finalAssets);

				const project = await isthere.updateOne({
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
					thumbnail: thumbnailImage,
				});

				res.json({
					status: 'success',
					message: 'Project successfully modified!',
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
				message: 'Project not found!',
			});
		}
	}
});

export default ClassroomRouterAddClass;
