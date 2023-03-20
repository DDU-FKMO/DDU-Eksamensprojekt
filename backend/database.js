require("dotenv").config();
const fetch = require("node-fetch");
//const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");

const {User} = require("./models/model_user.js");
const {Program} = require("./models/model_user.js");
const {Exercise} = require("./models/model_user.js");
const {Session} = require("./models/model_user.js");
const {Schedule} = require("./models/model_user.js");

//On database connected function
function onDatabaseConnected() {
	console.log("Database connected...");
	refreshExerciseList();
	///addDefaultPrograms();
}

//Export
module.exports = {
	onDatabaseConnected,
	register,
	createProgram,
	addExerciseToProgram,
	createExercise,
	addProgramToUser,
	getUserByEmail,
	getProgramByName,
	getExerciseByName,
	getAllPrograms,
	getAllExercises,
	updateStreak,
	addScheduleToProgram
};
//Connect to database
require("./database_connection.js").connection();

//Regiser new user
async function register(username, email, password) {
	// encrypt password
	const exists = await getUserByEmail(email);
	if (exists) {
		console.log("exists");
		return false; // eller noget
	}
	const user = await User.create({
		username,
		email,
		password,
		streak: 0
	});
	console.log("Created user");
	return user;
}

//Create new program
async function createProgram(programName) {
	const exists = await getProgramByName(programName);
	if (exists) {
		console.log("program exists" + exists);
		return false; // eller noget
	}
	const program = Program.create({
		programName: programName
	});
	console.log("created program" + programName);
	return program;
}

//Add exercise to program
async function addExerciseToProgram(programName, exerciseJSON) {
	const exists = await getProgramByName(programName);
	if (!exists) {
		console.log("program does not exists");
		return false; // eller noget
	}
	console.log("exissts, trying to add program");
	const exerExists = exists[exerciseJSON.name];
	if (exerExists) {
		console.log("exercise exists");
		return false; // eller noget
	}
	const sucess = await createExercise(exerciseJSON);
	exists.exercises.push(sucess);
	exists.save();
	console.log("Successfully added exercise to program");
	return sucess;
}

//Create new exercise
async function createExercise(exerciseJSON) {
	const exists = await getExerciseByName(exerciseJSON.name);
	if (exists) {
		console.log("exercise already exists");
		return exists;
	}
	const sucess = await Exercise.create({name: exerciseJSON.name, type: exerciseJSON.type, muscle: exerciseJSON.muscle, equipment: exerciseJSON.equipment, difficulty: exerciseJSON.difficulty, instructions: exerciseJSON.instructions, weighted: exerciseJSON.weighted, defaultSets: exerciseJSON.defaultSets});
	console.log("added exercise");
	return sucess;
}

//Add program to user
async function addProgramToUser(programName, email) {
	const program = await getProgramByName(programName);
	if (!program) {
		console.log("No such program exists");
		return false; // eller noget
	}
	const userExists = await getUserByEmail(email);
	if (!userExists) {
		console.log("user does not exist");
		return false; // eller noget
	}
	data = {program: program};
	userExists.programList.push({program: program});
	userExists.save();
	console.log("added to user");
	return true;
	//return User.updateOne({email: email}, {"$push":{"programList":data}});
}

//Get user by email
async function getUserByEmail(email) {
	const user = await User.findOne({email: email});
	// console.log("Found user: " + user.username)
	return user;
}

//Get exercise by name
async function getExerciseByName(name) {
	const exer = await Exercise.findOne({name: name});
	if (exer) {
		return exer;
	}
	return null;
}

//Get all exercises
async function getAllExercises() {
	const exer = await Exercise.find({});
	return exer;
}

//Get program by name
async function getProgramByName(name) {
	const program = await Program.findOne({programName: name});
	console.log("fetched " + program.programName);
	return program;
}

//Get all programs
async function getAllPrograms() {
	const program = await Program.find();
	return program;
}

//Update streak
async function updateStreak(email) {
	// Filipemails
	let user = await getUserByEmail(email);
	if (!user) {
		return false;
	}
	user.streak += 1;
	user.save();
	return "done";
	//return User.updateOne({"email": email}, {"$inc": {streak: 1}})
}

async function addScheduleToProgram(programName, scheduleData) {
	const program = await getProgramByName(programName);
	if (!program) {
		console.log("No such program exists");
		return false; // eller noget
	}
	program.schedule.days.push(scheduleData);
	program.save();
	return program;
}

//Refresh exercise list
let updateExercises = false;
async function refreshExerciseList() {
	if (!updateExercises) return;
	console.log("Fetching exercises from API");
	for (let i = 0; i < 1; i++) {
		fetch("https://api.api-ninjas.com/v1/exercises?offset=" + i * 10, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-Api-Key": process.env.NINJA_API
			}
		})
			.then((response) => response.json())
			.then((data) => {
				data.forEach(async (exercise) => {
					const exists = await getExerciseByName(exercise.name);
					if (exists) return;
					exercise.defaultSets = 3;
					exercise.weighted = false;
					if (exercise.type == "strength" || exercise.type == "powerlifting" || exercise.type == "olympic_weightlifting") {
						exercise.weighted = true;
					}
					createExercise(exercise);
				});
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}
}

//Add default programs
async function addDefaultPrograms() {
	for (let i = 1; i < 4; i++) {
		const exists = await getProgramByName("Default-" + i);
		if (exists) return;
		const program = await createProgram("Default-" + i);
		//Default exercise names
		let exercises = [];
		if (i == 1) exercises = [];
		else if (i == 2) exercises = [];
		else if (i == 3) exercises = [];
		//Add exercises to program
		exercises.forEach((exercise) => {
			addExerciseToProgram("Default-" + i, getExerciseByName(exercise));
		});
	}
}

//TEST stuff

// register("Filip", "Filipemails", "123");
//updateStreak("Filipemails");
//createProgram("program1");

// data = {"name": "1",
// 	"type": "1",
// 	"muscle": "1",
// 	"equipment": "1",
// 	"difficulty": "1",
// 	"instructions":"1",
// 	"weighted": false,
// 	"defaultSets":2
// }
//addExerciseToProgram("program1", data);
//addProgramToUser("program1", "Filipemails");
updateStreak("Filipemails");
