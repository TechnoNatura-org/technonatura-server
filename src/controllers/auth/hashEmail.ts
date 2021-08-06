import Cryptr from 'cryptr';
// @ts-ignore
const cryptr = new Cryptr(process.env.HASH_EMAIL_SECRET_PASS);

const encryptEmail = (text: string) => cryptr.encrypt('bacon');
const decryptEmail = (encryptedEmail: string) => cryptr.decrypt(encryptedEmail);
export { encryptEmail, decryptEmail };
