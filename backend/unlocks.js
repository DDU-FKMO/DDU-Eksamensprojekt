const {app} = require("./server.js");
const auth = require("./authenticate.js");
//const {User} = require("./models/model_user.js");
const {getUserByEmail, equipUnlock} = require("./database.js");

app.post("/node/equip", auth, async (req, res) => {
	console.log("Trying to equip");
	const unlockName = req.body.unlockName;
	const email = req.body.user.email;

	if (!unlockName){
		console.log("Please include unlock name");
		return res.status(404).send("No name included");
	}

	let status = await equipUnlock(email, unlockName);

	if (status != "success") {
		console.log("Not equipped: " + status);
		return res.status(404).send(status);
	}
	console.log("Successfully equiped");
	return res.status(201).send("ok");
});

app.get("/node/get-unlocks", auth, async (req, res) => {
	console.log("Attempting to get unlocks:");
	const email = req.body.user.email;
	user = await getUserByEmail(email);

	if (!user) {
		console.log("No such user");
		return res.status(500);
	}
	let data = {};
	data.unlocks = user.unlocks;
	data.equipment = user.equipment;
	console.log("unlock fetched");
	return res.status(200).json(data);
});
