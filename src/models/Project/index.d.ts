export interface ProjectPostInterface {
	owner: string;

	title: string;
	name: string;
	desc: string;

	content: string;

	thumbnail: string;
	assets: [string];

	classroomId: string;
	grade: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
	gradePeriod: number;

	isTeam: boolean;
	teamId: number;

	category: string;
	tags: [string];
	branch: string;

	draft: boolean;
}

// export type ProjectPostTeamT = ProjectPostInterface & { isTeam: true };
// export type ProjectPostNotTeamT = ProjectPostInterface & { isTeam: false };

// export type ProjectI = ProjectPostTeamT | ProjectPostNotTeamT;
