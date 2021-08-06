/*
 * =================== MTS TECHNONATURA SERVER =================
 *
 * This API Script under [] LICENSE
 * What is this for ? This is REST API for MTS Technonatura stories feature.
 *
 * (c) 2021 by MTS-Technonatura contributor, made with 💖 by Aldhan
 * =============================================================
 */

import * as express from 'express';

import Blog, { blogPostBaseDocument } from '../../models/Blog/BlogPost.model';

import User, { UserBaseDocument } from '../../models/User/User.model';
import { VerifyAuthToken } from '../checkToken';

declare module 'express-serve-static-core' {
	interface Request {
		id: string;
		user?: UserBaseDocument | null;
	}
}

const storyRouter = express.Router();

storyRouter.post('/', VerifyAuthToken, (req, res) => {
	const {
		title,
		tags,
		content,
	}: {
		title: string;
		tags: Array<string>;
		content: string;
		publish: boolean;
	} = req.body;

	// const tags = Blog.distinct('tags', )

	res.json({ m: 'je' });
});

export default storyRouter;
