interface SocialMedia {
	name: string;
	url: string;
}

export type GradeInNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type Grade = 'mi' | 'mts' | 'ma';

export interface TeacherRoleInTechnoNatura {
	teacher: boolean;
	grade: GradeInNumber;
	isVerified: boolean;
}

export interface StaffRoleInTechnoNatura {
	staff: boolean;
	role: string;
	isVerified: boolean;
}

export interface StudentRoleInTechnoNatura {
	student: boolean;
	grade: GradeInNumber;
	startPeriod: number;
}

export type AlumniRoleInTechnoNatura = Array<{
	grade: Grade;
	startPeriod: number;
}>;

export interface UserInterface {
	isAccountVerified: boolean;
	active: boolean; // shows if the student is alumni or not

	fullName: string;
	username: string;
	email: string;
	password: string;
	avatar: string;

	banner: string;
	bio: string;
	status: {
		emoji: string;
		text: string;
	};

	dream: string;
	hobbies: Array<string>;
	gender: 'male' | 'female';

	follows: Array<string>;
	followers: Array<string>;

	roles: Array<string>;
	socialMedias: Array<SocialMedia>;

	points: number;

	accountCreated: Date;
	birthDate: Date;

	roleInTechnoNatura:
		| TeacherRoleInTechnoNatura
		| StudentRoleInTechnoNatura
		| StaffRoleInTechnoNatura;
	alumni: AlumniRoleInTechnoNatura;

	badges: Array<string>;
}
