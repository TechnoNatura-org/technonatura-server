import * as CryptoJS from 'crypto-js';

const encryptIoTAppToken = (text: string) =>
	CryptoJS.AES.encrypt(
		JSON.stringify(text),
		process.env.HASH_EMAIL_SECRET_KEY || 'sdf',
	).toString();
const decryptIoTAppToken = (encryptedIoTAppToken: string) =>
	CryptoJS.AES.decrypt(
		encryptedIoTAppToken,
		process.env.HASH_EMAIL_SECRET_KEY || 'sdf',
	);

export { encryptIoTAppToken, decryptIoTAppToken };
