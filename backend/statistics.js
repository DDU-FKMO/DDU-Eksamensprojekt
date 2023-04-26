const fetch = require("node-fetch");
const {app} = require("./server.js");
const {getAllSessions, getUserByEmail} = require("./database.js");

//Get Latest Session Statistics
app.get("/statistics/latest/:email", async (req, res) => {
	let email = req.params.email;

	let user = await getUserByEmail(email);
	if (!user) {
		console.log("No such user");
		return res.status(400).send("No such user");
	}

	let sessions = await getAllSessions(email);
	let session = sessions[sessions.length - 1];

	let average = getAverage(sessions, 5);

	let difference = {};
	session.info.forEach((element) => {
		if (average[element.nameOfExercise]) {
			difference[element.nameOfExercise] = element.sets - average[element.nameOfExercise];
		}
	});

	let data = {
		average: average,
		difference: difference,
		session: session
	};

	return res.json(data);
});

//Get Overview Statistics
app.get("/statistics/overview/:email", async (req, res) => {
	let email = req.params.email;

	let user = await getUserByEmail(email);
	if (!user) {
		console.log("No such user");
		return res.status(400).send("No such user");
	}

	console.log("Got user: " + user.username);
	let sessions = await getAllSessions(email);
	console.log("Sessions:", sessions);

	let data = {
		average: getAverage(sessions, 5),
		setsOverTime: getStatistics(sessions, 5),
		sessions: sessions
	};
	return res.json(data);
});

function getStatistics(sessions, amount) {
	let setsOverTime = {};
	if (sessions.length < amount) amount = sessions.length;
	for (let i = sessions.length - amount; i < sessions.length; i++) {
		sessions[i].info.forEach((element) => {
			if (!setsOverTime[element.nameOfExercise]) setsOverTime[element.nameOfExercise] = [];
			sum[element.nameOfExercise].push(element.sets);
		});
	}
	return setsOverTime;
}

function getAverage(sessions, amount) {
	let sum = {};
	let numberOfSessions = {};
	if (sessions.length < amount) amount = sessions.length;
	for (let i = sessions.length - amount; i < sessions.length; i++) {
		sessions[i].info.forEach((element) => {
			if (!sum[element.nameOfExercise]) sum[element.nameOfExercise] = 0;
			sum[element.nameOfExercise] += element.sets;
			numberOfSessions[element.nameOfExercise]++;
		});
	}
	let average = {};
	for (let i = 0; i < sum.length; i++) {
		average[i] = sum[i] / numberOfSessions[i];
	}
	return average;
}
