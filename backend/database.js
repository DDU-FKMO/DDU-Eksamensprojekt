require("dotenv").config();
require("./database_connection.js").connection();
//const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");

const {User} = require("./models/model_user.js");
const {Program} = require("./models/model_user.js");
const {Exercise} = require("./models/model_user.js");
const {Session} = require("./models/model_user.js");


async function register(username, email, password) {
    // encrypt password
    const exists = getUserByEmail();
    if (exists){
        return false // eller noget
    }
const user = await User.create({
	username,
	email,
	password,
    streak: 0,
})

return user
}

async function createProgram(programName) {
    const exists = getProgramByName(programName);
	if (exists) {
		return false; // eller noget
	}
    const program = Program.create({
        programName: programName,
    })
    return program
}

async function addExerciseToProgram(programName,exerciseJSON){
    const exists = getProgramByName(programName);
	if (!exists) {
		return false; // eller noget
	}
     const exerExists = exists[exerciseJSON.name];
		if (!exerExists) {
			return false; // eller noget
		}
    const sucess = Exercise.create({
        exerciseJSON
    })
    return sucess
}

async function addProgramToUser(programName, email){
    const program = getProgramByName(programName);
	if (program) {
		return false; // eller noget
	}
    const userExists = getUserByEmail(email);
	if (userExists) {
		return false; // eller noget
	}
    data = {"program": program};
    return User.updateOne({email: email}, {"$push":{"programList":data}});
}

async function getUserByEmail(email) {
    const user = await User.findOne({"email": email});
    return user
}

async function getProgramByName(name) {
	const program = await Program.findOne({name: name});
	return program;
}

async function updateStreak(email){ // Filipemails
    return User.updateOne({"email": email}, {"$inc": {streak: 1}})
}



updateStreak("Filipemails");