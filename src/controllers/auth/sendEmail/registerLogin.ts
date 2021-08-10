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
			to: 'aldhaneka@gmail.com', // list of receivers
			subject: 'Hi',
			html: EmailTemplate(`
  <body >
<h1>test 123</h1>
    </body>
    `),
		});
		console.log(sendEmailRes);
	} catch (err) {
		console.error('e');
	}
}
