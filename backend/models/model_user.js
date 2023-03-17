const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    name: String,
    type: String,
    muscle: String,
    equipment: String,
    difficulty: String,
    instructions: String,
    weighted: Boolean,
    defaultSets: Number
})

/*
const sessionSchema = new mongoose.Schema({
    name: String, // session name?
    exercises:[{
        type: exerciseSchema,
        default: {}
    }]
})
*/
const sessionSchema = new mongoose.Schema({
	date: {type: Date, defualt: Date.now()},
	info: [
		{
			nameOfExercise: String,
			sets: Number //eller noget
		}
	],/*
	session: {
		type: exerciseSchema,
		default: {}
	}*/
});
/*
const programSchema = new mongoose.Schema({
	programName: String,
        sessions:[{
            type: sessionSchema,
            default: {}
        }],
    workout: {type: Boolean, default: false} // Er det et træningsprogram
});*/

const programSchema = new mongoose.Schema({
	programName: String,
	exercises: [
		{
			type: exerciseSchema,
			default: {}
		}
	],
	//workout: {type: Boolean, default: false} // Er det et træningsprogram
});

const userSchema = new mongoose.Schema({
	username: {type: String},
	email: {type: String, unique: true},
	password: {type: String},
	level: {type: Number},
	streak: {type: Number},
	/*unlocks: {
		unlockName: {type: String},
        exercises: {
            type: exerciseSchema, // ???
            default: {}
        }
	},*/
	programList: [
		{
			program: programSchema,
			sessionList: [
				{
					type: sessionSchema,
					default: {}
				}
			]
		}
	],/*
	logs: [
		{
			type: sessionSchema,
			default: {}
		}
	],*/
	token: String
});

module.exports = {
	user: mongoose.model("user", userSchema),
	program: mongoose.model("program", programSchema),
	exercise: mongoose.model("exercise", exerciseSchema),
	session: mongoose.model("session", sessionSchema),
	//sessionLog: mongoose.model("sessionLog", sessionLogSchema)
};