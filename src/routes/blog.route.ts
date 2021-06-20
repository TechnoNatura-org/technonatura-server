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

import User, { UserBaseDocument } from '../models/User.model';
import { VerifyAuthToken } from '../controllers/checkToken';
import addPostController from '../controllers/stories/addpost.controller';

declare module 'express-serve-static-core' {
  interface Request {
    id: string;
    user?: UserBaseDocument | null;
  }
}

const storyRouter = express.Router();

storyRouter.get('/post/:id', (req, res) => {});
storyRouter.get('/posts', (req, res) => {
  res.json({ m: 'je' });
});
storyRouter.use('/post', addPostController);

export default storyRouter;
