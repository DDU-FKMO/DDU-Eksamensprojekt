const fetch = require("node-fetch");
const {app} = require("./server.js");
const {getAllSessions, getUserByEmail} = require("./database.js");
const auth = require("./authenticate.js");

let amount = 5;

//Get Latest Session Statistics
app.get("/statistics/latest", auth, async (req, res) => {
	const email = req.body.user.email;

	let user = await getUserByEmail(email);
	if (!user) {
		console.log("No such user");
		return res.status(400).send("No such user");
	}

	let sessions = await getAllSessions(email);
	let session = sessions[sessions.length - 1];

	let average = getAverage(sessions, amount);

	let difference = {};
	session.info.forEach((element) => {
		if (average[element.nameOfExercise]) {
			difference[element.nameOfExercise] = {
				sets: element.sets - average[element.nameOfExercise].sets,
				weight: element.weight - average[element.nameOfExercise].weight
			};
		}
	});

	let data = {
		average: average,
		difference: difference,
		session: session
	};

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

	console.log("Got user: " + user.username);
	let sessions = await getAllSessions(email);

	let data = {
		average: getAverage(sessions, amount),
		setsOverTime: getSetsOverTime(sessions, amount),
		weightOverTime: getWeightOverTime(sessions, amount),
		sessions: sessions
	};
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

	console.log("Got user: " + user.username);
	let sessions = await getAllSessions(email);

	let setSum = 0;
	let weightSum = 0;
	let number = 0;
	if (sessions.length < amount) amount = sessions.length;
	for (let i = sessions.length - amount; i < sessions.length; i++) {
		sessions[i].info.forEach((element) => {
			setSum += element.sets;
			weightSum += element.weight;
			number++;
		});
	}
	let average = {
		sets: setSum / number,
		weight: weightSum / number
	};

	return res.json(average);
});

function getSetsOverTime(sessions, amount) {
	let setsOverTime = {};
	if (sessions.length < amount) amount = sessions.length;
	for (let i = sessions.length - amount; i < sessions.length; i++) {
		console.log(sessions[i], i);
		sessions[i].info.forEach((element) => {
			if (!setsOverTime[element.nameOfExercise]) setsOverTime[element.nameOfExercise] = [];
			setsOverTime[element.nameOfExercise].push(element.sets);
		});
	}
	return setsOverTime;
}

function getWeightOverTime(sessions, amount) {
	let weightOverTime = {};
	if (sessions.length < amount) amount = sessions.length;
	for (let i = sessions.length - amount; i < sessions.length; i++) {
		console.log(sessions[i], i);
		sessions[i].info.forEach((element) => {
			if (!weightOverTime[element.nameOfExercise]) weightOverTime[element.nameOfExercise] = [];
			weightOverTime[element.nameOfExercise].push(element.weight);
		});
	}
	return weightOverTime;
}

function getAverage(sessions, amount) {
	let setSum = {};
	let weightSum = {};
	let numberOfSessions = {};
	if (sessions.length < amount) amount = sessions.length;
	for (let i = sessions.length - amount; i < sessions.length; i++) {
		sessions[i].info.forEach((element) => {
			if (!setSum[element.nameOfExercise]) setSum[element.nameOfExercise] = 0;
			if (!weightSum[element.nameOfExercise]) weightSum[element.nameOfExercise] = 0;
			if (!numberOfSessions[element.nameOfExercise]) numberOfSessions[element.nameOfExercise] = 0;
			setSum[element.nameOfExercise] += element.sets;
			weightSum[element.nameOfExercise] += element.weight;
			numberOfSessions[element.nameOfExercise]++;
		});
	}
	let average = {};
	for (let i in setSum) {
		average[i] = {
			sets: setSum[i] / numberOfSessions[i],
			weight: weightSum[i] / numberOfSessions[i]
		};
	}
	return average;
}
