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
			sets: {type: Number, default: 0}, //eller noget
			weight: {type: Number, default: 0},
			reps: {type: Number, default: 0}
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

//types of unlocks: skins, background themes,
const unlockSchema = new mongoose.Schema({
	name: {type: String, default: "Cute and funny costume"},
	unlockType: {type: String, default: ""},
	content: {type: String, default: ""}
});

const userSchema = new mongoose.Schema({
	username: {type: String},
	email: {type: String, unique: true},
	password: {type: String},
	level: {type: Number},
	streak: {type: Number, default: 0},
	unlocks: [
		{
			type: unlockSchema,
			default: {}
		}
	],
	equipment: {type: [String], default: []},
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
	Schedule: mongoose.model("schedule", scheduleSchema),
	Unlock: mongoose.model("unlock", unlockSchema)
};
