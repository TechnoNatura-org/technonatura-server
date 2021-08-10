import { Response } from 'express';

import EmailTemplate from '../../EmailTemplate';
import { transporter } from '../../../EmailTransporter';

export default async function sendRegisterInfo(
	login: boolean,
	email: string,
	username: string,
	system: string,
	platform: {
		description: string;
		name: string;
		os: { family: string };
	},
) {
	try {
		let sendEmailRes = await transporter.sendMail({
			from: '"Aldhaneka<DO NOT REPLY>" <aldhanekadev@gmail.com>', // sender address
			to: email, // list of receivers
			subject: 'Hi',
			html: EmailTemplate(`
  <body style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border: 0;" bgcolor="#ffffff"><table class="body" valign="top" role="presentation" border="0" cellpadding="0" cellspacing="0" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border: 0;" bgcolor="#ffffff">
<h1>test 123</h1>
    </body>
    `),
		});
		console.log(sendEmailRes);
	} catch (err) {
		console.error('e');
	}
}
