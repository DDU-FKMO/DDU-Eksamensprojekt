const {app} = require("./server.js");
const {getAllExercises, getAllPrograms, gotStreakThisWeek, createProgram, addExerciseToProgram, addScheduleToProgram, addProgramToUser, getProgramByName, getAllSessions, getUserByEmail} = require("./database.js");
const auth = require("./authenticate.js");

//Character muscle groups hit by exercises
app.get("/character/muscleGroups", auth, async (req, res) => {
	const email = req.body.user.email;
	let user = await getUserByEmail(email);
	if (!user) {
		console.log("No such user");
		return res.status(400).send("No such user");
	}
	//All possible muscle groups
	let allExercises = await getAllExercises();
	let allMuscleGroups = [];
	for (let i = 0; i < allExercises.length; i++) {
		if (allMuscleGroups.includes(allExercises[i].muscle) == false) allMuscleGroups.push(allExercises[i].muscle);
	}
	//User hit muscle groups
	if (user.programList.length == 0) {
		console.log("User has no program");
		let data = {};
		for (let i = 0; i < allMuscleGroups.length; i++) {
			data[allMuscleGroups[i]] = false;
		}
		return res.status(200).json(data);
	}
	let userProgram = user.programList[0].program;
	let muscleGroups = [];
	for (let i = 0; i < userProgram.exercises.length; i++) {
		if (muscleGroups.includes(userProgram.exercises[i].muscle) == false) muscleGroups.push(userProgram.exercises[i].muscle);
	}
	//Format data
	let data = {};
	for (let i = 0; i < allMuscleGroups.length; i++) {
		data[allMuscleGroups[i]] = muscleGroups.includes(allMuscleGroups[i]);
	}
	//Send data
	//console.log(data);
	return res.json(data);
});

//Character muscle groups hit by exercises
app.get("/character/level", auth, async (req, res) => {
	//Get training sessions
	const email = req.body.user.email;
	let user = await getUserByEmail(email);
	if (!user) {
		console.log("No such user");
		return res.status(400).sendStatus("No such user");
	}
	if (user.programList.length == 0) return res.status(400).send("User has no program");

	let sessions = user.programList[0].sessionList;
	//Calculate level
	let level = Math.floor(sessions.length / 5);
	console.log(level);
	//Send data
	return res.json(level);
});

app.get("/character/get-streak", auth, async (req, res) => {
	//Get training sessions
	const email = req.body.user.email;
	let user = await getUserByEmail(email);
	console.log("Got " + user.username);
	//Send data
	let trained = await gotStreakThisWeek(email);
	console.log("Has user trained? " + trained);
	return res.json({streak: user.streak, hasTrained: trained});
});

app.get("/character/name", auth, async (req, res) => {
	const email = req.body.user.email;
	let user = await getUserByEmail(email);
	if (!user) {
		console.log("No such user");
		return res.status(400).send("No such user");
	}
	return res.json({name: user.username});
});
