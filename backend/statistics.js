const fetch = require("node-fetch");
const {app} = require("./server.js");
const {getAllSessions, getUserByEmail} = require("./database.js");
const auth = require("./authenticate.js");

const amount = 10;

//Get Latest Session Statistics (For log)
app.get("/statistics/latest/:name", auth, async (req, res) => {
	const email = req.body.user.email;
	const name = req.params.name;

	let user = await getUserByEmail(email);
	if (!user) {
		console.log("No such user");
		return res.status(400).send("No such user");
	}

	let sessions = await getAllSessions(email);
	sessions.sort((a, b) => {
		return new Date(b.date) - new Date(a.date);
	});
	console.log(sessions);
	let session = sessions.find((element) => {
		return element.info.find((element) => {
			return element.nameOfExercise == name;
		});
	});
	if (!session) {
		console.log("No such session");
		return res.status(400).send("No such session");
	}
	let data = session.info.find((element) => {
		return element.nameOfExercise == name;
	});

	return res.json(data);
});

//Get all statistics
app.get("/statistics/all", auth, async (req, res) => {
	const email = req.body.user.email;

	let user = await getUserByEmail(email);
	if (!user) {
		console.log("No such user");
		return res.status(400).send("No such user");
	}

	let sessions = await getAllSessions(email);

	let setsOverTime = getSetsOverTime(sessions, amount);
	let repsOverTime = getRepsOverTime(sessions, amount);
	let weightOverTime = getWeightOverTime(sessions, amount);
	let average = getAverage(setsOverTime, repsOverTime, weightOverTime);

	let data = {
		average: average,
		setsOverTime: setsOverTime,
		repsOverTime: repsOverTime,
		weightOverTime: weightOverTime,
		sessions: sessions
	};
	console.log(data);
	return res.json(data);
});

//Get combined average
app.get("/statistics/average", auth, async (req, res) => {
	const email = req.body.user.email;

	let user = await getUserByEmail(email);
	if (!user) {
		console.log("No such user");
		return res.status(400).send("No such user");
	}

	let sessions = await getAllSessions(email);

	let average = getCombinedAverage(sessions, amount);

	return res.json(average);
});

function getSetsOverTime(sessions, amount) {
	let setsOverTime = {};
	if (sessions.length < amount) amount = sessions.length;

	//Add all
	for (let i = 0; i < sessions.length; i++) {
		sessions[i].info.forEach((element) => {
			if (!setsOverTime[element.nameOfExercise]) setsOverTime[element.nameOfExercise] = {};
			if (setsOverTime[element.nameOfExercise][sessions[i].date]) {
				setsOverTime[element.nameOfExercise][sessions[i].date] += element.sets;
			} else {
				setsOverTime[element.nameOfExercise][sessions[i].date] = element.sets;
			}
		});
	}
	//Remove all but last amount
	for (let i in setsOverTime) {
		let keys = Object.keys(setsOverTime[i]);
		keys.sort((a, b) => {
			return new Date(a) - new Date(b);
		});
		for (let j = 0; j < keys.length - amount; j++) {
			delete setsOverTime[i][keys[j]];
		}
	}
	//Return
	return setsOverTime;
}

function getRepsOverTime(sessions, amount) {
	let repsOverTime = {};
	if (sessions.length < amount) amount = sessions.length;

	//Add all
	for (let i = 0; i < sessions.length; i++) {
		sessions[i].info.forEach((element) => {
			if (!repsOverTime[element.nameOfExercise]) repsOverTime[element.nameOfExercise] = {};
			if (repsOverTime[element.nameOfExercise][sessions[i].date]) {
				repsOverTime[element.nameOfExercise][sessions[i].date] += element.reps;
			} else {
				repsOverTime[element.nameOfExercise][sessions[i].date] = element.reps;
			}
		});
	}
	//Remove all but last amount
	for (let i in repsOverTime) {
		let keys = Object.keys(repsOverTime[i]);
		keys.sort((a, b) => {
			return new Date(a) - new Date(b);
		});
		for (let j = 0; j < keys.length - amount; j++) {
			delete repsOverTime[i][keys[j]];
		}
	}
	//Return
	return repsOverTime;
}

function getWeightOverTime(sessions, amount) {
	let weightOverTime = {};
	if (sessions.length < amount) amount = sessions.length;

	//Add all
	for (let i = 0; i < sessions.length; i++) {
		sessions[i].info.forEach((element) => {
			if (!weightOverTime[element.nameOfExercise]) weightOverTime[element.nameOfExercise] = {};
			if (weightOverTime[element.nameOfExercise][sessions[i].date]) {
				weightOverTime[element.nameOfExercise][sessions[i].date] += element.weight;
			} else {
				weightOverTime[element.nameOfExercise][sessions[i].date] = element.weight;
			}
		});
	}
	//Remove all but last amount
	for (let i in weightOverTime) {
		let keys = Object.keys(weightOverTime[i]);
		keys.sort((a, b) => {
			return new Date(a) - new Date(b);
		});
		for (let j = 0; j < keys.length - amount; j++) {
			delete weightOverTime[i][keys[j]];
		}
	}
	//Return
	return weightOverTime;
}

function getAverage(setsOverTime, repsOverTime, weightOverTime) {
	let average = {};

	let sum = {};
	let number = {};

	for (let i in setsOverTime) {
		average[i] = {};
		if (!sum[i]) sum[i] = {sets: 0, reps: 0, weight: 0};
		for (let j in setsOverTime[i]) {
			sum[i].sets += setsOverTime[i][j];
			sum[i].reps += repsOverTime[i][j];
			sum[i].weight += weightOverTime[i][j];
			number[i] = Object.keys(setsOverTime[i]).length;
		}
	}

	for (let i in sum) {
		average[i] = {
			sets: sum[i].sets / number[i],
			reps: sum[i].reps / number[i],
			weight: sum[i].weight / number[i]
		};
	}

	return average;
}

function getCombinedAverage(sessions, amount) {
	if (sessions.length < amount) amount = sessions.length;

	let setSum = 0;
	let repsSum = 0;
	let weightSum = 0;
	let number = 0;

	for (let i = sessions.length - amount; i < sessions.length; i++) {
		sessions[i].info.forEach((element) => {
			setSum += element.sets;
			repsSum += element.reps;
			weightSum += element.weight;
			number++;
		});
	}
	let average = {
		sets: setSum / number,
		reps: repsSum / number,
		weight: weightSum / number
	};

	return average;
}
