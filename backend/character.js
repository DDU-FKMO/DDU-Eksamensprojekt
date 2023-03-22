const {app} = require("./server.js");
const {getAllExercises, getAllPrograms, createProgram, addExerciseToProgram, addScheduleToProgram, addProgramToUser, getProgramByName} = require("./database.js");

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
	console.log(data);
	res.json(data);
});