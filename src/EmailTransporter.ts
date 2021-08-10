import * as nodemailer from 'nodemailer';

// create reusable transporter object using the default SMTP transport
export let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // true for 465, false for other ports
	auth: {
		user: process.env.ETHEREAL_EMAIL, // generated ethereal user
		pass: process.env.ETHEREAL_PASS, // generated ethereal password
	},
});
