const fetch = require("node-fetch");
const {app} = require("./server.js");
const {getAllExercises, getUserByEmail, getAllPrograms, createProgram, addExerciseToProgram, addScheduleToProgram, addProgramToUser, getExerciseByName} = require("./database.js");

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
			if (settings.equipment.includes(exercise.equipment) || exercise.equipment == "None" || exercise.equipment == "none") {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	});

	if (availableExercises.length < 9) {
		return res.json({status: "error", message: "Not enough exercises available for your settings."});
	}

	let programs = [];

	for (let i = 0; i < 3; i++) {
		let program = {
			programName: "Suggestion " + (i + 1),
			exercises: [],
			schedule: [],
			owner: "Auto-generated"
		};

		let dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		//Add 3 exercises per training day
		for (let day = 0; day < 3; day++) {
			let scheduleData = {day: dayNames[day * 2], exercises: []};
			for (let e = 0; e < 3; e++) {
				let exercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
				scheduleData.exercises.push({name: exercise.name, sets: exercise.defaultSets});
				if (program.exercises.includes(exercise) == false) program.exercises.push(exercise);
			}
			program.schedule.push(scheduleData);
		}
		programs.push(program);
	}

	res.json(programs);
});

//Select program
app.post("/trainingProgram/select", async (req, res) => {
	let program = req.body;
	console.log(program);
	let createdProgram = await createProgram(program.programName);
	if (createdProgram == false) return res.json({status: "error", message: "Program already exists."});

	for (let exercise of program.exercises) {
		console.log("Adding exercise: " + exercise.name);
		await addExerciseToProgram(program.programName, exercise);
	}
	for (let day of program.schedule) {
		console.log("Adding schedule day");
		await addScheduleToProgram(program.programName, day);
	}

	///addProgramToUser(program.programName, "Email");

	res.json({status: "success"});
});

//Import user programs
app.get("/trainingProgram/import/:email", async (req, res) => {
	let email = req.params.email;
	console.log(email);

	let user = await getUserByEmail(email);
	if (!user) {
		console.log("No such user");
		return res.status(400).send("No such user");
	}
	let userProgram = user.programList[0].program;
	userProgram = Object.create(userProgram);
	// equipment: String,
	// instructions: String,
	try {
		if (userProgram.schedule.days.length == 0) {
			throw new Error("No schedule?");
		}

		for (let day = 0; day < userProgram.schedule.days.length; day++) {
			///console.log(userProgram.schedule.days[day]);
			for (let exercise = 0; exercise < userProgram.schedule.days[day].exercises.length; exercise++) {
				let exerciseInfo = {
					name: userProgram.schedule.days[day].exercises[exercise].name,
					sets: userProgram.schedule.days[day].exercises[exercise].sets,
					equipment: "",
					instructions: ""
				};
				exerData = await getExerciseByName(exerciseInfo.name);
				exerciseInfo.equipment = exerData.equipment;
				exerciseInfo.instructions = exerData.instructions;
			}
		}
	} catch (error) {
		console.log("no schedule: ", error);
		return res.status(404).json(userProgram); //
	}
	//console.log("Schedule days: " + userProgram.schedule.days[0].exercises);
	console.log("Success, sending user program");
	return res.status(200).json(userProgram); //userProgram);
});

//Available Exercises
app.post("/trainingProgram/exercises", async (req, res) => {
	let settings = req.body;
	console.log(settings);

	let allExercises = await getAllExercises();

	let availableExercises = allExercises.filter((exercise) => {
		// Filter out exercises that are not available
		if ((exercise.difficulty = settings.difficulty && settings.muscleGroup.includes(exercise.muscle))) {
			if (settings.equipment.includes(exercise.equipment) || exercise.equipment == "None" || exercise.equipment == "none") {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	});

	res.json(availableExercises);
});
