import * as CryptoJS from 'crypto-js';

const encryptIoTAppToken = (text: string) =>
	CryptoJS.AES.encrypt(
		JSON.stringify(text),
		process.env.HASH_IOT_APP_TOKEN || 'sdf',
	).toString();
const decryptIoTAppToken = (encryptedIoTAppToken: string) =>
	CryptoJS.AES.decrypt(
		encryptedIoTAppToken,
		process.env.HASH_IOT_APP_TOKEN || 'sdf',
	);

export { encryptIoTAppToken, decryptIoTAppToken };
