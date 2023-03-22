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
});

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
	date: {type: Date, default: Date.now()},
	info: [
		{
			nameOfExercise: String,
			sets: Number //eller noget
		}
	]
});

const scheduleSchema = new mongoose.Schema({
	days: [
		{
			day: String,
			exercises: [
				{
					name: String,
					sets: Number
				}
			]
		}
	]
});

const programSchema = new mongoose.Schema({
	programName: String,
	exercises: [
		{
			type: exerciseSchema,
			default: {}
		}
	],
	owner: {type: String, default: "Global"},
	schedule: {
		type: scheduleSchema,
		default: {}
	}
});

const userSchema = new mongoose.Schema({
	username: {type: String},
	email: {type: String, unique: true},
	password: {type: String},
	level: {type: Number},
	streak: {type: Number, default: 0},
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
			weekStreaks: [],
			sessionList: [
				{
					type: sessionSchema,
					default: {}
				}
			]
		}
	],
	token: String
});

//module.exports = mongoose.model("user", userSchema);

module.exports = {
	User: mongoose.model("user", userSchema),
	Program: mongoose.model("program", programSchema),
	Exercise: mongoose.model("exercise", exerciseSchema),
	Session: mongoose.model("session", sessionSchema),
	Schedule: mongoose.model("schedule", scheduleSchema)
	//sessionLog: mongoose.model("sessionLog", sessionLogSchema)
};
