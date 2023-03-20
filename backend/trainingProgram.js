const fetch = require("node-fetch");
const {app} = require("./server.js");
const {getAllExercises, getAllPrograms} = require("./database.js");
const {Exercise, Program} = require("./models/model_user.js");

//Program Recommendations
app.get("/trainingProgram/recommend", async (req, res) => {
	let allPrograms = await getAllPrograms();
	let programs = allPrograms.filter((program) => program.programName.includes("Default-") && program.owner == "Global");
	console.log(programs);
	res.json(programs);
});

//Program Suggestions
app.post("/trainingProgram/suggest", async (req, res) => {
	let settings = req.body;
	console.log(settings);

	let allExercises = await getAllExercises();

	let availableExercises = allExercises.filter((exercise) => {
		// Filter out exercises that are not available
		if ((exercise.difficulty = settings.difficulty && settings.muscleGroup.includes(exercise.muscle))) {
			if (settings.equipment.includes(exercise.equipment)) {
				return true;
			} else {
				///return false;
				return true;
			}
		} else {
			return false;
		}
	});

	let programs = [];

	for (let i = 0; i < 3; i++) {
		let program = {
			name: "Suggestion " + (i + 1),
			exercises: [],
			owner: "Auto-generated"
		};

		//Add 3 exercises per training day
		for (let day = 0; day < 3; day++) {
			for (let e = 0; e < 3; e++) {
				let exercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
				program.exercises.push(exercise);
			}
		}
		programs.push(program);
	}

	res.json(programs);
});

//Import user programs
app.get("/trainingProgram/import/:email", async (req, res) => {
	let email = req.params.email;
	console.log(email);

	let user = await getUserByEmail(email);
	let userProgram = user.programList[0];
	res.status(200).json(userProgram);
})