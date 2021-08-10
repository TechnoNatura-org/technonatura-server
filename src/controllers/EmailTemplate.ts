export default function EmailTemplate(content: string) {
	return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
  <head>
    <!-- Compiled with Bootstrap Email version: 1.0.0.alpha4 -->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
            <style type="text/css">
            body,table,td{font-family:Helvetica,Arial,sans-serif !important}.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:150%}a{text-decoration:none}*{color:inherit}a[x-apple-data-detectors],u+#body a,#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}img{-ms-interpolation-mode:bicubic}table:not([class^=s-]){font-family:Helvetica,Arial,sans-serif;mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;border-collapse:collapse}table:not([class^=s-]) td{border-spacing:0px;border-collapse:collapse}@media screen and (max-width: 600px){.max-w-48,.max-w-48>tbody>tr>td{max-width:192px !important;width:100% !important}.max-w-56,.max-w-56>tbody>tr>td{max-width:224px !important;width:100% !important}.max-w-96,.max-w-96>tbody>tr>td{max-width:384px !important;width:100% !important}.w-lg-80,.w-lg-80>tbody>tr>td{width:auto !important}.w-full,.w-full>tbody>tr>td{width:100% !important}.w-32,.w-32>tbody>tr>td{width:128px !important}.pt-4:not(table),.pt-4:not(.btn)>tbody>tr>td,.pt-4.btn td a,.py-4:not(table),.py-4:not(.btn)>tbody>tr>td,.py-4.btn td a{padding-top:16px !important}.pb-4:not(table),.pb-4:not(.btn)>tbody>tr>td,.pb-4.btn td a,.py-4:not(table),.py-4:not(.btn)>tbody>tr>td,.py-4.btn td a{padding-bottom:16px !important}*[class*=s-lg-]>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-6>tbody>tr>td{font-size:24px !important;line-height:24px !important;height:24px !important}.s-10>tbody>tr>td{font-size:40px !important;line-height:40px !important;height:40px !important}}

          </style>
</head>

${content}

</html>`;
}
