export interface ProjectPostInterface {
	owner: string;

	title: string;
	name: string;
	desc: string;

	content: string;

	thumbnail: string;
	assets: Array<{ url: string; desc: string }>;

	classroomId: string;
	grade: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
	gradePeriod: number;

	// isTeam: boolean;
	// teamId: string;

	category: string;
	tags: string[];
	branch: string;

	created: number;

	stars: Array<string>;

	// draft: boolean;
}

// export type ProjectPostTeamT = ProjectPostInterface & { isTeam: true };
// export type ProjectPostNotTeamT = ProjectPostInterface & { isTeam: false };

// export type ProjectI = ProjectPostTeamT | ProjectPostNotTeamT;
