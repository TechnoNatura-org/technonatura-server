/*
 * =================== MTS TECHNONATURA SERVER =================
 *
 * This API Script under MIT LICENSE
 * What is this for ? This is REST API for MTS Technonatura arduino database, user make app and saved the app to db.
 *
 * (c) 2021 by MTS-Technonatura, made with 💖 by Aldhan
 * =============================================================
 */

interface Errors {
  desc: string;
  name: string;
}

// handle errors
async function handleErrors(err: {
  message: string;
  code: number;
  _message: string;
  keyValue: {
    name?: string;
    email?: string;
  };
}) {
  // @ts-ignore
  let errors: Errors = {};

  if (err.message == 'Only Letters and Numbers are allowed') {
    errors.name = err.message;
  }

  // duplicate username error
  if (err.code === 11000 && err.keyValue.name) {
    errors.name = 'that username is already registered';
  }

  // validation errors
  if (
    err._message &&
    (err._message.includes('ArduinoApp validation failed') ||
      err._message.includes('sensor validation failed'))
  ) {
    // @ts-ignore
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      if (properties.message) {
        // @ts-ignore
        errors[properties.path] = properties.message;
      }
    });
  }

  return errors;
}

export default handleErrors;
