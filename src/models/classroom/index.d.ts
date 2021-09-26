export interface ClassroomInterface {
	owner: string;

	title: string;
	name: string;
	desc: string;

	thumbnail: string;

	grade: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
	gradePeriod: number;

	isTeam: boolean;

	category: 'art' | 'science' | 'engineering' | 'social' | 'entrepreneur';

	branchId: string;
	active: boolean;

	from: number;
	to: number;
}

// export type ProjectPostTeamT = ProjectPostInterface & { isTeam: true };
// export type ProjectPostNotTeamT = ProjectPostInterface & { isTeam: false };

// export type ProjectI = ProjectPostTeamT | ProjectPostNotTeamT;
