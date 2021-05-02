/*
 * =================== MTS TECHNONATURA SERVER =================
 *
 * This API Script under MIT LICENSE
 * What is this for ? This is REST API to contact MTS Technonatura Admin, send message from [paste link here] and send it to [api link], we saved the message to database
 *
 * (c) 2021 by MTS-Technonatura, made with 💖 by Aldhan
 * =============================================================
 */

import * as express from 'express';
import Contact from '../models/contact.model';

const ContactRouter = express.Router();

ContactRouter.post('/', async (req, res) => {
  const { email, message, name } = req.body;
  const contact = new Contact({
    name: name,
    email: email,
    message: message,
  });

  try {
    await contact.save();

    res.status(200).json({ message: 'sent!' });
  } catch (err) {
    const errors = await handleErrors(err, {
      email,
      message,
      name,
    });
    console.log(errors);

    res.status(500).json({ errors });
  }
});

interface SignupBody {
  email: string;
  message: string;
  name: string;
}

interface Errors {
  email: string;
  message: string;
  name: string;
}

// handle errors
async function handleErrors(
  err: {
    message: string;
    code: number;
    _message: string;
    keyValue: {
      username?: string;
      email?: string;
    };
  },
  SignupBody?: SignupBody,
) {
  console.log('ERRRRORORR', err.message);
  // @ts-ignore
  let errors: Errors = {};

  if (err.message == 'Only Letters and Numbers are allowed') {
    errors.name = err.message;
  }

  // validation errors
  if (err._message && err._message.includes('Contact validation failed')) {
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

export default ContactRouter;
