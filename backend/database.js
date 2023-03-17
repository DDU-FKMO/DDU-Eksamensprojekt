require("dotenv").config();
require("./database_connection.js").connection();
//const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");

//const User = require("./models/model_user.js");
const {User} = require("./models/model_user.js");
const {Program} = require("./models/model_user.js");
const {Exercise} = require("./models/model_user.js");
const {Session} = require("./models/model_user.js");

console.log(User)

async function register(username, email, password) {
    // encrypt password
    const exists = await getUserByEmail(email);
    if (exists){
        console.log("exists")
        return false // eller noget
    }
const user = await User.create({
	username,
	email,
	password,
    streak: 0,
})
console.log("Created user")
return user
}

async function createProgram(programName) {
    const exists = await getProgramByName(programName);
	if (exists) {
        console.log("program exists" + exists)
		return false; // eller noget
	}
    const program = Program.create({
        programName: programName,
    })
    console.log("created program" + programName)
    return program
}

async function addExerciseToProgram(programName,exerciseJSON){
    const exists = await getProgramByName(programName);
	if (!exists) {
        console.log("program does not exists")
		return false; // eller noget
	}
    console.log("exissts, trying to add program")
     const exerExists = exists[exerciseJSON.name];
		if (exerExists) {
            console.log("exercise exists");
			return false; // eller noget
		}
    const sucess = await createExercise(exerciseJSON);
    exists.exercises.push(sucess)
    exists.save();
    console.log("Successfully added exercise to program")
    return sucess
}

async function createExercise(exerciseJSON){
    const sucess = await Exercise.create(
    {   "name": exerciseJSON.name,
		"type": exerciseJSON.type,
		"muscle": exerciseJSON.muscle,
		"equipment": exerciseJSON.equipment,
		"difficulty": exerciseJSON.difficulty,
		"instructions": exerciseJSON.instructions,
		"weighted": exerciseJSON.weighted,
		"defaultSets": exerciseJSON.defaultSets
    });
    console.log("added exercise")
    return sucess
}


async function addProgramToUser(programName, email){
    const program = await getProgramByName(programName);
	if (!program) {
        console.log("No such program exists")
		return false; // eller noget
	}
    const userExists = await getUserByEmail(email);
	if (!userExists) {
        console.log("user does not exist")
		return false; // eller noget
	}
    data = {"program": program};
    userExists.programList.push({"program": program})
    userExists.save()
    console.log("added to user")
    return true
    //return User.updateOne({email: email}, {"$push":{"programList":data}});
}

async function getUserByEmail(email) {
    const user = await User.findOne({"email": email});
   // console.log("Found user: " + user.username)
    return user
}

async function getProgramByName(name) {
	const program = await Program.findOne({"programName": name});
    console.log("fetched " + program.programName)
	return program;
}

async function updateStreak(email){ // Filipemails
    let user = await getUserByEmail(email);
    user.streak += 1;
    user.save();
    return "done"
    //return User.updateOne({"email": email}, {"$inc": {streak: 1}})
}


   // register("Filip", "Filipemails", "123");
    //updateStreak("Filipemails");
    //createProgram("program1");

    data = {"name": "1",
		"type": "1",
		"muscle": "1",
		"equipment": "1",
		"difficulty": "1",
		"instructions":"1",
		"weighted": false,
		"defaultSets":2
    }
    //addExerciseToProgram("program1", data);
    addProgramToUser("program1", "Filipemails");

