const {app} = require("./server.js");
const fetch = require("node-fetch");
const auth = require("./authenticate.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User} = require("./models/model_user.js");
const {getUserByEmail} = require("./database.js");

app.get("/node/auth", auth, async (req, res) => {
	console.log("auth ok");
	return res.status(200).send("Ok!");
});

app.post("/node/register", async (req, res) => {
	try {
		const {username, email, password} = req.body;
		console.log("Attempted registration");

		console.log(req.body);
		if (!(username && password && email)) {
			console.log("All data must be filled");
			return res.status(400).send("All fields must be filled");
		}

		const found = await User.findOne({email});

		if (found) {
			console.log("User exists already");
			return res.status(400).send("A user with this email already exists");
		}

		encPass = await bcrypt.hash(password, 10);

		const user = await User.create({
			username,
			email: email.toLowerCase(),
			password: encPass
		});

		const token = jwt.sign({user_id: user._id, email, username}, process.env.JWT_TOKEN, {
			expiresIn: "72h"
		});

		user.token = token;
		console.log("Succesfully registered user: " + user.username);
		return res.status(201).json(user);
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
});

app.post("/node/login", async (req, res) => {
	console.log("Attempted login:");

	try {
		const {email, password} = req.body;

		if (!(email && password)) {
			console.log("No input: request body: " + req.body.email + req.body.password);
			return res.status(400).send("All input is required");
		}
		console.log("email: " + email);
		const user = await getUserByEmail(email);
		if (user === null) {
			console.log("User not found");
			return res.status(404).send("Invalid credentials");
		}
		let username = user.username;
		console.log("User found: " + username);
		let passwordCorrect = await bcrypt.compare(password, user.password);
		if (user && passwordCorrect) {
			const token = jwt.sign({user_id: user.__id, email, username}, process.env.JWT_TOKEN, {
				expiresIn: "72h"
			});

			user.token = token;
			console.log("User logged in: " + user.username);
			return res.status(200).json(user);
		}
		console.log("Invalid creds");
		return res.status(404).send("Invalid credentials");
	} catch (err) {
		console.log(err);
		return res.status(500).send(err);
	}
});
