const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    name: String,
    type: String,
    muscle: String,
    equipment: String,
    difficulty: String,
    instructions: String,
    weighted: Boolean

})

const sessionSchema = new mongoose.Schema({
    name: String,
    exercises:[{
        type: exerciseSchema,
        default: {}
    }]
})

const sessionLogsSchema = new mongoose.Schema({
    date: {type: Date},
    info: [{
        nameOfExercise: String,
        sets: Number, //eller noget
    }],
    session: {
        type: sessionSchema,
        default: {}
    }
})

const userSchema = new mongoose.Schema({
	username: {type: String},
	email: {type: String, unique: true},
	password: {type: String},
	level: {type: Number},
	streak: {type: Number},
	/*unlocks: {
		unlockName: {type: String},
        exercises: {
            type: exerciseSchema,
            default: {}
        }
	},*/
    program: [{
        programName: String,
        sessions:[{
            type: sessionSchema,
            default: {}
        }]
    }],
    logs: [{
        type: sessionLogsSchema,
        default: {}
    }],
    token: String
});

module.exports = mongoose.model("user", userSchema);