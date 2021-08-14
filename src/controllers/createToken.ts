import * as jwt from 'jsonwebtoken';

interface UserTypes {
	email: string;
	username: string;
	password: string;
	_id: string;
}

export enum tokenForTypes {
	auth,
	ApiApp,
	arduinoApp,
}

interface ArduinoAppTypes {
	ownerID: number;
	appID: number;
}

// max age
const maxAge = 3 * 24 * 60 * 60 * 60;
const createToken = (
	n: Partial<ArduinoAppTypes> | Partial<UserTypes>,
	tokenFor: tokenForTypes,
) => {
	switch (tokenFor) {
		case tokenForTypes.auth:
			console.log('auth!');
			return jwt.sign({ ...n }, process.env.AUTH_SECRET_TOKEN || 'authSecret', {
				expiresIn: '1y',
			});

			break;

		case tokenForTypes.arduinoApp:
			return jwt.sign(
				{ ...n },
				process.env.ARDUINO_APP_SECRET_TOKEN || 'arduinoSecret',
				{
					expiresIn: '5y',
				},
			);
			break;

		case tokenForTypes.ApiApp:
			break;

		default:
			break;
	}
};

export default createToken;
