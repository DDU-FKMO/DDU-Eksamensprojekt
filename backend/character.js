const {app} = require("./server.js");
const {getAllExercises, getAllPrograms, gotStreakThisWeek, createProgram, addExerciseToProgram, addScheduleToProgram, addProgramToUser, getProgramByName, getAllSessions, getUserByEmail} = require("./database.js");
const auth = require("./authenticate.js");

//Character muscle groups hit by exercises
app.post("/character/muscleGroups", async (req, res) => {
	//User hit muscle groups
	let userProgram = (await getAllPrograms()).find((program) => program.owner == req.body.username);
	let muscleGroups = [];
	for (let i = 0; i < userProgram.exercises.length; i++) {
		if (muscleGroups.includes(userProgram.exercises[i].muscle) == false) muscleGroups.push(userProgram.exercises[i].muscle);
	}
	//All possible muscle groups
	let allExercises = await getAllExercises();
	let allMuscleGroups = [];
	for (let i = 0; i < allExercises.length; i++) {
		if (allMuscleGroups.includes(allExercises[i].muscle) == false) allMuscleGroups.push(allExercises[i].muscle);
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
app.post("/character/level", auth, async (req, res) => {
	//Get training sessions
	let email = req.body.user.email;
	let user = await getUserByEmail(email);
	if (!user) {
		console.log("No such user");
		return res.status(400).send("No such user");
	}
	
	let sessions = user.programList[0].sessionList;
	//Calculate level
	let level = Math.floor(sessions.length / 5);
	console.log(level);
	//Send data
	return res.json(level);
});

app.post("/character/get-streak", auth, async (req, res) => {
	//Get training sessions
	let email = req.body.user.email;
	let user = await getUserByEmail(email);
	console.log("Got " + user.username);
	//Send data
	let trained = await gotStreakThisWeek(email);
	console.log("Has user trained? " + trained);
	return res.json({streak: user.streak, hasTrained: trained});
});
