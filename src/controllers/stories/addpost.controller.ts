/*
 * =================== MTS TECHNONATURA SERVER =================
 *
 * This API Script under [] LICENSE
 * What is this for ? This is REST API for MTS Technonatura stories feature.
 *
 * (c) 2021 by MTS-Technonatura contributor, made with 💖 by Aldhan
 * =============================================================
 */

import express from 'express';

import Blog, { blogPostBaseDocument } from '../../models/Blog/BlogPost.model';
import BlogTag, { blogTagBaseDocument } from '../../models/Blog/blogTag.model';

import User, { UserBaseDocument } from '../../models/User.model';
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
  }: { title: string; tags: Array<string>; content: string } = req.body;

  res.json({ m: 'je' });
});

export default storyRouter;
