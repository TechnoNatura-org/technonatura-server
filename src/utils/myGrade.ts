export default function myGrade(gradeInNumber: number) {
	if (gradeInNumber >= 1 && gradeInNumber <= 6) {
		return 'mi';
	}
	if (gradeInNumber >= 7 && gradeInNumber <= 9) {
		return 'mts';
	}
	if (gradeInNumber >= 10 && gradeInNumber <= 12) {
		return 'ma';
	}
}
