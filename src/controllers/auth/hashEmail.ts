import CryptoJS from 'crypto-js';

const encryptEmail = (text: string) =>
	CryptoJS.AES.encrypt(
		JSON.stringify(text),
		process.env.HASH_EMAIL_SECRET_KEY || 'sdf',
	).toString();
const decryptEmail = (encryptedEmail: string) =>
	CryptoJS.AES.decrypt(
		encryptedEmail,
		process.env.HASH_EMAIL_SECRET_KEY || 'sdf',
	);

export { encryptEmail, decryptEmail };
