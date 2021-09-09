export interface AuthAppRulesI {
	email: boolean;
	project: boolean;
	IoTApp: boolean;
	story: boolean;
	team: boolean;
}

export interface AuthAppInterface {
	name: string;
	desc: string;

	own: string;

	token: {
		token: string;
		tokenCreated: number;
	};

	users: Array<string>;

	rules: AuthAppRulesI;

	dateAdded: number;
}
