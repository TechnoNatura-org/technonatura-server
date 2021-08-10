import EmailTemplate from '../../EmailTemplate';
import { transporter } from '../../../EmailTransporter';

export default async function sendRegisterInfo(
	login: boolean,
	email: string,
	username: string,
	system: string,
	platform: { description: string; name: string; os: { family: string } },
) {
	try {
		let sendEmailRes = await transporter.sendMail({
			from: '"Aldhaneka<DO NOT REPLY>" <aldhanekadev@gmail.com>', // sender address
			to: email, // list of receivers
			subject: !login
				? 'TechnoNatura Dashboard - Berhasil Registrasi TechnoNatura Dashboard!'
				: 'TechnoNatura Dashboard - Seseorang Baru Saja Masuk ke Akun Anda!', // Subject line
			html: EmailTemplate(`
  <body style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border: 0;" bgcolor="#ffffff"><table class="body" valign="top" role="presentation" border="0" cellpadding="0" cellspacing="0" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border: 0;" bgcolor="#ffffff">
<tbody>
    <tr>
      <td valign="top" style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
        
  <table class="bg-black w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" bgcolor="#000000" width="100%">
  <tbody>
    <tr>
      <td style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left" bgcolor="#000000" width="100%">
        
    <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
  <tbody>
    <tr>
      <td align="center" style="line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;">
        <!--[if (gte mso 9)|(IE)]>
          <table align="center" role="presentation">
            <tbody>
              <tr>
                <td width="600">
        <![endif]-->
        <table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
          <tbody>
            <tr>
              <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
                
      <table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
  <tbody>
    <tr>
      <td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;" align="left" width="100%" height="40">
        &#160;
      </td>
    </tr>
  </tbody>
</table>
<table class="ax-center" role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
  <tbody>
    <tr>
      <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
        <img class="w-32" src="https://app.technonatura.vercel.app/static/techno-logo.png" style="height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; width: 128px; border: 0 none;" width="128">
      </td>
    </tr>
  </tbody>
</table>
<table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
  <tbody>
    <tr>
      <td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;" align="left" width="100%" height="40">
        &#160;
      </td>
    </tr>
  </tbody>
</table>
      <table class="ax-center" role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
  <tbody>
    <tr>
      <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
        <img class="max-w-56  rounded-lg" src="https://i.pinimg.com/originals/89/bb/06/89bb06251fb7401e094b1f6d71f3d3f4.gif" style="height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; border-radius: 8px; max-width: 224px; width: 100%; border: 0 none;" width="224">
      </td>
    </tr>
  </tbody>
</table>
<table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
  <tbody>
    <tr>
      <td style="line-height: 40px; font-size: 40px; width: 100%; height: 20px; margin: 0;" align="left" width="100%" height="40">
        &#160;
      </td>
    </tr>
  </tbody>
</table>
      <table class="ax-center" role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
  <tbody>
    <tr>
      <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
        <h1 class="text-white text-center" style="color: #ffffff; padding-top: 0; padding-bottom: 0; font-weight: 500; vertical-align: baseline; font-size: 36px; line-height: 43.2px; margin: 0;" align="center">${
					!login
						? 'Selamat, kamu berhasil melakukan registrasi di TechnoNatura Dashbor!'
						: `Seseorang baru saja masuk ke akun mu pada : ${new Date()}`
				}</h1>

      </td>
    </tr>
  </tbody>
</table>
<table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
  <tbody>
    <tr>
      <td style="line-height: 40px; font-size: 40px; width: 100%; height: 10px; margin: 0;" align="left" width="100%" height="40">
        &#160;
      </td>
    </tr>
  </tbody>
</table>

      <table class="ax-center" role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
  <tbody>
    <tr>
      <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
      ${
				!login
					? ` <p class="max-w-96 lh-lg text-white text-center text-2xl" style="line-height: 2; font-size: 24px; color: #dadada; max-width: 384px; -premailer-width: 384; width: 100%; margin: 0;" align="center">
      Langkah selanjutnya adalah menerima verifikasi oleh <a https://t.me/Aldhaneka>Aldhaneka</a>
      </p>`
					: `${platform.name} ${platform.os.family} – ${platform.description}`
			}  
     

      </td>
    </tr>
  </tbody>
</table>
<table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
  <tbody>
    <tr>
      <td style="line-height: 40px; font-size: 40px; width: 100%; height: 50px; margin: 0;" align="left" width="100%" height="40">
        &#160;
      </td>
    </tr>
  </tbody>
</table>
      <table class="btn btn-yellow-300 rounded-full fw-800 text-5xl py-4 ax-center  w-full w-lg-80" role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="border-radius: 9999px; border-collapse: separate !important; width: 320px; font-size: 48px; line-height: 57.6px; font-weight: 800 !important; margin: 0 auto;" width="320">
  <tbody>
    <tr>
      <td style="line-height: 24px; font-size: 16px; border-radius: 9999px; width: 320px; font-weight: 800 !important; margin: 0;" align="center" bgcolor="#ffda6a" width="320">
      </td>
    </tr>
  </tbody>
</table>

        </a>
      
</td>
    
    </tr>
  </tbody>
</table>
</div>
    <table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
  <tbody>
    <tr>
      <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
        &#160;
      </td>
    </tr>
  </tbody>
</table>
<div class="text-muted text-center" style="color: #718096;" align="center">

Email mu: ${email}
<br>
Username mu: ${username}
<br>

Sistem: ${system}
<br>
os: ${platform.os.family} 
<br>

      Sent with &lt;3 from <a href="https://github.com/aldhanekaa">Aldhanekaa</a> via <a href="https://github.com/technonatura-org/technonatura-server">TechnoNatura Server</a>
    </div>
<table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
  <tbody>
    <tr>
      <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
        &#160;
      </td>
    </tr>
  </tbody>
</table>
  
              </td>
            </tr>
          </tbody>
        </table>
        <!--[if (gte mso 9)|(IE)]>
                </td>
              </tr>
            </tbody>
          </table>
        <![endif]-->
      </td>
    </tr>
  </tbody>
</table>

      </td>
    </tr>
  </tbody>
</table>
    </body>
    `),
		});
	} catch (err) {}
}
