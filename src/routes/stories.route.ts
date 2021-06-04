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

import User, { UserBaseDocument } from '../models/User.model';
import { VerifyAuthToken } from '../controllers/checkToken';

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
storyRouter.post('/post', VerifyAuthToken, (req, res) => {
  const { title: string, tags, content } = req.body;

  res.json({ m: 'je' });
});

export default storyRouter;
