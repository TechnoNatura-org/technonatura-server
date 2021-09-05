import * as schedule from 'node-schedule';
import User from '../models/User/User.model';

export default function GradeJob() {
	const ruleKenaikanKelas = new schedule.RecurrenceRule();
	ruleKenaikanKelas.month = 8;
	ruleKenaikanKelas.hour = 13;
	ruleKenaikanKelas.minute = 18;

	ruleKenaikanKelas.date = 5;

	schedule.scheduleJob(ruleKenaikanKelas, function() {
		console.log('The answer to life, the universe, and everything!');
	});
}
