require("dotenv").config();
const fetch = require("node-fetch");
const bcrypt = require("bcryptjs");
const fs = require("fs");
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
	///refreshExerciseList();
	///createExerciseList();
	addDefaultPrograms();
}

//Export
module.exports = {
	onDatabaseConnected,
	register,
	createProgram,
	deleteProgram,
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
		console.log("program with name '" + programName + "' already exists");
		return false; // eller noget
	}
	const program = await Program.create({
		programName: programName,
		owner: owner ?? null
	});
	console.log("created program: " + programName);
	return program;
}

//Delete program
async function deleteProgram(programName, owner) {
	const exists = await getProgramByName(programName);
	if (!exists) {
		console.log("program with name '" + programName + "' doesn't exist");
		return false; // eller noget
	}
	await Program.findOneAndRemove({programName: programName, owner: owner});
	return true;
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
async function createExercise(exerciseJSON, replace) {
	const exists = await getExerciseByName(exerciseJSON.name);
	if (exists) {
		if (replace) {
			console.log("exercise already exists, replacing it");
			const success = await Exercise.findOneAndReplace({name: exerciseJSON.name}, exerciseJSON);
			return success;
		}
		console.log("Exercise already exists");
		return exists;
	} else {
		console.log("Creating new exercise");
		const sucess = await Exercise.create({name: exerciseJSON.name, type: exerciseJSON.type, muscle: exerciseJSON.muscle, equipment: exerciseJSON.equipment, difficulty: exerciseJSON.difficulty, instructions: exerciseJSON.instructions, weighted: exerciseJSON.weighted, defaultSets: exerciseJSON.defaultSets});
		return sucess;
	}
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
	if (userExists.programList[0] == null) {
		userExists.programList[0] = {program: program, sessionList: [], weekStreaks: []};
	} else {
		userExists.programList[0].program = program;
	}
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
	console.log("Successfully added session to user; Checking streak:");
	await streakCalculation(email);
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

	if (user.programList.length == 0) return false;

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
	const sucess = await Unlock.create({name, unlockType, content});
	console.log("added unlock");
	return sucess;
}

async function getUnlockByName(name) {
	unlock = await Unlock.findOne({name});
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
		if (unlock.name == userUnlock.name) {
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
	for (userUnlock of user.unlocks) {
		if (userUnlock.name == unlockName) {
			// if user has unlocked
			let index = user.equipment.indexOf(unlockName);
			if (index > -1) {
				// only splice array when item is found
				console.log("Removing: " + unlockName);
				user.equipment.splice(index, 1); // 2nd parameter means remove one item only
				status = "success";
				break;
			} else {
				console.log("Adding: " + unlockName);
				user.equipment.push(unlockName);
				status = "success";

				for (item of user.unlocks) {
					// deequip
					// only one of item type can be equipped
					let index = user.equipment.indexOf(item.name);
					if (item.name != unlockName && userUnlock.unlockType == item.unlockType && index > -1) {
						console.log("Removing: " + item.name);
						user.equipment.splice(index, 1); // 2nd parameter means remove one item only
						status = "success";
					}
				}
				break;
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
	//await Unlock.deleteMany({unlockType: "background"});
	//await addProgramToUser("Custom program - User", "Filipemails");
	//  let data = {};
	// data.content = "background-color: blue;";
	// data.name = "blue background";
	// data.unlockType = "background";
	// await createUnlock(data);
	// await addUnlockToUser("filip@emails.dk", "blue background");
	// await addUnlockToUser("filip@emails.dk", "red background");
	// let colors = {
	// 	red: "#ff0000",
	// 	blue: "#0e4c73",
	// 	icyBlue: "#398cbf",
	// 	green: "#0abf04",
	// 	natureGreen: "#65a603",
	// 	yellow: "#ffea2a",
	// 	purple: "#8850bf",
	// 	pink: "#bf1564"
	// };
	// let data = {};
	//
	// await addUnlockToUser("filip@emails.dk", "red background");
	// for (let theme of Object.keys(colors)){
	// await addUnlockToUser("filip@emails.dk", theme);
	// }
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
	//Add new ones
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
					exercise.defaultSets = Math.floor(Math.random() * 10) + 4;
					exercise.weighted = false;
					if (exercise.type == "strength" || exercise.type == "powerlifting" || exercise.type == "olympic_weightlifting") {
						exercise.weighted = true;
					}
					createExercise(exercise);
				});
			})
			.catch((error) => {
				console.error(error);
			});
	}
}

async function createExerciseList() {
	let exerciseList = await Exercise.find({});
	let exerciseListNames = [];
	exerciseList.forEach((exercise) => {
		exerciseListNames.push(exercise.name);
	});

	fs.writeFileSync("exerciseList.json", JSON.stringify(exerciseListNames));
}

//Add default programs
async function addDefaultPrograms() {
	for (let i = 1; i <= 2; i++) {
		const exists = await getProgramByName("Default-" + i, "global");
		if (exists) continue;

		const program = await createProgram("Default-" + i, "global");

		//Default exercise names
		let exercises = [];
		if (i == 1)
			exercises = [
				["Decline barbell bench press", "Barbell Bench Press - Medium Grip", "Dumbbell Bench Press", "Seated triceps press", "Kneeling cable crunch"],
				["Barbell Deadlift", "One-Arm Dumbbell Row", "Close-Grip Front Lat Pulldown", "Barbell Curl", "Calf Press On The Leg Press Machine"],
				["Barbell back squat to box", "Leg Press", "Lying Leg Curls", "Seated Calf Raise"]
			];
		else if (i == 2)
			exercises = [
				["Barbell Bench Press - Medium Grip", "Dumbbell Bench Press", "Kneeling cable crunch"],
				["Barbell Deadlift", "One-Arm Dumbbell Row", "Close-Grip Front Lat Pulldown", "Calf Press On The Leg Press Machine"],
				["Close-grip bench press", "Side Lateral Raise", "Dumbbell front raise to lateral raise", "Hanging leg raise"],
				["Barbell back squat to box", "Leg Press", "Lying Leg Curls", "Seated Calf Raise"]
			];
		//Add exercises to program
		let days = ["Monday", "Wednesday", "Friday", "Thursday"];
		for (let j = 0; j < exercises.length; j++) {
			let scheduleData = {
				day: days[j],
				exercises: []
			};

			for (let h = 0; h < exercises[j].length; h++) {
				const exercise = await getExerciseByName(exercises[j][h]);
				if (exercise) {
					await addExerciseToProgram(program.programName, exercise);
					scheduleData.exercises.push({
						name: exercise.name,
						sets: exercise.defaultSets
					});
				}
			}

			await addScheduleToProgram(program.programName, scheduleData);
		}
	}
}
