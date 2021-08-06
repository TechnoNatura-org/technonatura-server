const crypto = require('crypto');
var algorithm = 'aes-192-cbc'; //algorithm to use
console.log(process.env);
var password = process.env.HASH_EMAIL_SECRET_PASS;

const key = crypto.scryptSync(
	// @ts-ignore
	password,
	process.env.HASH_EMAIL_SECRET_SALT_KEY,
	24,
); //create key

const iv = crypto.randomBytes(16); // generate different ciphertext everytime
const cipher = crypto.createCipheriv(algorithm, key, iv);
var encrypt = (text) =>
	cipher.update(text, 'utf8', 'hex') + cipher.final('hex'); // encrypted text

const decipher = crypto.createDecipheriv(algorithm, key, iv);

var decrypt = (encryptedEmail) =>
	decipher.update(encryptedEmail, 'hex', 'utf8') + decipher.final('utf8'); //deciphered text

// export { encrypt, decrypt };
