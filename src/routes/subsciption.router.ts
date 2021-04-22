import * as express from 'express';
import {
  subscribe,
  unsubscribe,
} from '../controllers/routes/subscription.controller';
const SubscriptionRouter = express.Router();

SubscriptionRouter.post('/subscribe', subscribe);
SubscriptionRouter.post('/unsubscribe', unsubscribe);

export default SubscriptionRouter;
