import { Request, Response } from 'express';
import Subscription from '../../models/subscription.model';

const subscribe = async (req: Request, res: Response) => {
  const { email, name } = req.body;

  try {
    const subscriptionUser = new Subscription({ email, name });
    await subscriptionUser.save();

    console.log(subscriptionUser);
    res.status(201).json({ message: 'success' });
  } catch (err) {
    const errors = await handleErrors(err);
    console.log(errors);
    res.status(400).json({ errors });
  }
};

const unsubscribe = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    await Subscription.findOneAndDelete({ email: email });
    res.status(201).json({ message: 'success' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'error occured on server' });
  }
};

interface Errors {
  email: string;
  name: string;
}

// handle errors
async function handleErrors(err: {
  message: string;
  code: number;
  _message: string;
  keyValue: {
    username?: string;
    email?: string;
  };
}) {
  // console.log('ERRRRORORR', err.message);
  // @ts-ignore
  let errors: Errors = {};

  if (err.message == 'Only Letters and Numbers are allowed') {
    errors.name = 'Only Letters and Numbers are allowed';
  }

  // duplicate email error
  if (err.code === 11000 && err.keyValue.email) {
    errors.email = 'that email is already registered';
  }

  // validation errors
  if (err._message && err._message.includes('Subscription validation failed')) {
    // console.log(err);

    // @ts-ignore
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      console.log(properties.path);
      if (properties.message != '') {
        // @ts-ignore
        errors[properties.path] = properties.message;
      }
    });
  }

  return errors;
}

export { subscribe, unsubscribe };
