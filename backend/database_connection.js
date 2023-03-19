const mongoose = require("mongoose");
const {onDatabaseConnected} = require("./database.js");

const {MONGO_URI} = process.env;
mongoose.set("strictQuery", false);
exports.connection = () => {
	mongoose
		.connect(MONGO_URI, {
			useUnifiedTopology: true
		})
		.then(() => {
			console.log("Successfully connected to database");
			onDatabaseConnected();
		})
		.catch((error) => {
			console.log("Database connection failed. exiting now...");
			console.error(error);
			process.exit(1);
		});
};
