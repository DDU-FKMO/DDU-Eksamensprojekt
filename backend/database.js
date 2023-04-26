require("dotenv").config();
const fetch = require("node-fetch");
const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");

const {User} = require("./models/model_user.js");
const {Program} = require("./models/model_user.js");
const {Exercise} = require("./models/model_user.js");
const {Session} = require("./models/model_user.js");
const {Schedule} = require("./models/model_user.js");
const {Unlock} = require("./models/model_user.js");

//On database connected function
function onDatabaseConnected() {
	console.log("Database connected!");
	refreshExerciseList();
	///addDefaultPrograms();
}

//Export
module.exports = {
	onDatabaseConnected,
	register,
	createProgram,
	addExerciseToProgram,
	createProgramMakeExercise,
	createExercise,
	addProgramToUser,
	getUserByEmail,
	getProgramByName,
	getExerciseByName,
	getAllPrograms,
	getAllExercises,
	getAllSessions,
	updateStreak,
	addScheduleToProgram,
	streakCalculation,
	addSessionToUser,
	gotStreakThisWeek,
	addUnlockToUser,
	createUnlock,
	getUnlockByName,
	equipUnlock
};
//Connect to database
require("./database_connection.js").connection();

//Register new user - denne metode bruges ikke.
async function register(username, email, password) {
	const exists = await getUserByEmail(email);
	if (exists) {
		console.log("exists");
		return false; // eller noget
	}
	let encPass = await bcrypt.hash(password, 10);

	const user = await User.create({
		username,
		email,
		password: encPass,
		streak: 0
	});
	console.log("Created user");
	return user;
}

//Create new program
async function createProgram(programName, owner) {
	const exists = await getProgramByName(programName);
	if (exists) {
		console.log("program already exists");
		return false; // eller noget
	}
	const program = await Program.create({
		programName: programName,
		owner: owner ?? null
	});
	console.log("created program: " + programName);
	return program;
}

//Add exercise to program
async function addExerciseToProgram(programName, exerciseJSON) {
	const exists = await getProgramByName(programName);
	if (!exists) {
		console.log("program does not exists");
		return false; // eller noget
	}
	console.log("program exists, trying to add exercise to program");
	const exerExists = exists[exerciseJSON.name];
	if (exerExists) {
		console.log("exercise already exists");
		return false; // eller noget
	}
	const sucess = await createExercise(exerciseJSON);
	exists.exercises.push(sucess);
	await exists.save();
	console.log("Successfully added exercise to program");
	return sucess;
}

async function createProgramMakeExercise(programName, exerciseJSON) {
	const sucess = createProgram(programName);
	if (sucess) {
		await addExerciseToProgram(programName, exerciseJSON);
		return sucess;
	}
	return false;
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
	await userExists.save();
	console.log("added to user");
	return true;
	//return User.updateOne({email: email}, {"$push":{"programList":data}});
}

//Get user by email
async function getUserByEmail(email) {
	const user = await User.findOne({email: email.toLowerCase()});
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
	return program;
}

//Get all programs
async function getAllPrograms() {
	const program = await Program.find();
	return program;
}

//Get all sessions
async function getAllSessions(userEmail) {
	const user = await getUserByEmail(userEmail);
	if (user) {
		let sessions = [];
		user.programList.forEach((program) => {
			program.sessionList.forEach((session) => {
				sessions.push(session);
			});
		});
		return sessions;
	} else {
		console.log("No such user exists");
		return [];
	}
}

async function addSessionToUser(email, sessionList) {
	let user = await getUserByEmail(email);
	if (!user) {
		console.log("Session: no such user");
		return false;
	}
	// create a session
	let session = await Session.create({
		info: sessionList
	});

	if (!session) {
		consone.log("Session did not get created");
		return false;
	}

	user.programList[0].sessionList.push(session);

	await user.save();
	console.log("Successfully added session to user");
	return session;
}
//Update streak
async function updateStreak(email) {
	// Filipemails
	let user = await getUserByEmail(email);
	if (!user) {
		return false;
	}
	user.streak += 1;
	await user.save();
	console.log("Updatet streak for " + user.username);
	return user.streak;
	//return User.updateOne({"email": email}, {"$inc": {streak: 1}})
}

async function addScheduleToProgram(programName, scheduleData) {
	const program = await getProgramByName(programName);
	if (!program) {
		console.log("program does not exists");
		return false; // eller noget
	}
	program.schedule.days.push(scheduleData);
	program.save();
	return program;
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

async function streakCalculation(email) {
	let user = await getUserByEmail(email);
	if (!user) {
		console.log("no such user");
		return false;
	}
	let schedule = user.programList[0].program.schedule;
	if (!schedule.days) {
		console.log("No schedule");
		return false;
	}

	let sessionList = user.programList[0].sessionList;
	//Sets the number of days checked to the shortest value of the two, to prevent IndexOutOfRange
	let numOfDays = schedule.days.length > sessionList ? sessionList.length : schedule.days.length;

	let prevMonday = new Date();
	let today = new Date();
	prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));

	if (user.programList[0].weekStreaks.length > 0) {
		if (user.programList[0].weekStreaks[user.programList[0].weekStreaks.length - 1].getDate() == prevMonday.getDate()) {
			console.log("User has already fulfilled their streak this week.");
			return true;
		}
	}
	let daysTrained = 0;
	for (let i = 0; i < numOfDays; i++) {
		session = sessionList[sessionList.length - (1 + i)];
		if (session.date.getTime() >= prevMonday.getTime()) {
			console.log(session);
			daysTrained++;
		}
	}

	if (daysTrained >= schedule.days.length) {
		// hvis der er trænet der korrekte antal
		user.programList[0].weekStreaks.push(prevMonday);
		user.streak += 1;
		await user.save();
		return true;
	}

	return false;
}

async function gotStreakThisWeek(email) {
	let user = await getUserByEmail(email);
	let prevMonday = new Date();
	prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));

	if (user.programList[0].weekStreaks.length > 0) {
		if (user.programList[0].weekStreaks[user.programList[0].weekStreaks.length - 1].getDate() == prevMonday.getDate()) {
			console.log("User has already fulfilled their streak this week.");
			return true;
		}
	}
	return false;
}

async function createUnlock(data) {
	const {name, unlockType, content} = data;
	const exists = await getUnlockByName(name);
	if (exists) {
		console.log("unlock already exists");
		return exists;
	}
	const sucess = await Unlock.create({name: name.toLowerCase(), unlockType, content});
	console.log("added unlock");
	return sucess;
}

async function getUnlockByName(name) {
	unlock = await Unlock.findOne({name: name.toLowerCase()});
	return unlock;
}

async function addUnlockToUser(email, unlockName) {
	let user = await getUserByEmail(email);
	if (!user) {
		console.log("Unlock: no such user");
		return false;
	}
	// Get unlock
	unlock = await getUnlockByName(unlockName);
	if (!unlock) {
		console.log("Unlock: no such unlock");
		return false;
	}
	for (let userUnlock of user.unlocks) {
		if (unlock.name.toLowerCase() == userUnlock.name.toLowerCase()) {
			console.log("Already added to user");
			return false;
		}
	}

	user.unlocks.push(unlock);
	await user.save();
	console.log("Added to user");
	return unlock;
}

async function equipUnlock(email, unlockName) {
	let user = await getUserByEmail(email);
	if (!user) {
		console.log("Unlock: no such user");
		return false;
	}

	let status = "User does not own unlock";
	for (userUnlock in user.unlocks) {
		if (userUnlock.name == unlockName) {
			// if user has unlocked
			let index = user.equipment.indexOf(unlockName);
			if (index > -1) {
				// only splice array when item is found
				user.equipment.splice(index, 1); // 2nd parameter means remove one item only
				status = "success";
			} else {
				user.equipment.push(unlockName);
				status = "success";
			}
		}
	}
	await user.save();
	return status;
}

// TESTER STREAK FUNCTION; SKAL NOK BRUGE IGEN
async function asd() {
	//user = await getUserByEmail("Filipemails");
	//user.programList[0].sessionList = [];
	//await user.save();
	//await addSessionToUser("Filipemails", "program1", {"sets": 3, "nameOfExercise":"ArmCurls"});
	//await streakCalculation("Filipemails");
	//await addProgramToUser("Custom program - User", "Filipemails");
	// let data = {};
	// data.content = "background-color: red;";
	// data.name = "red background";
	// data.unlockType = "background";
	// createUnlock(data);
	// await addUnlockToUser("filip@emails.dk", "supercool crown");
	// await addUnlockToUser("filip@emails.dk", "red background");
}
asd();

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
//updateStreak("Filipemails");

//Refresh exercise list
let updateExercises = false;
async function refreshExerciseList() {
	if (!updateExercises) return;
	console.log("Fetching exercises from API");
	for (let i = 0; i < 30; i++) {
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
