require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
var cookieParser = require("cookie-parser");

//Setup server settings
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 1000 // limit each IP to 100 requests per windowMs
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use(express.static("../frontend/dist"));

//CSP
app.use(function (req, res, next) {
	res.setHeader("Content-Security-Policy", "default-src 'self'; frame-src *");
	next();
});

//Index page
app.get("/", (req, res) => {
	res.sendFile("../frontend/dist/index.html");
});

//Setup server
const http = require("http");
///const https = require('https');

// Certificate
/**const privateKey = fs.readFileSync('/etc/letsencrypt/live/test.stevnbak.dk/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/test.stevnbak.dk/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/test.stevnbak.dk/chain.pem', 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
};*/

//Start server
///const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);

/**httpsServer.listen(443, () => {
    console.log('listening on *:443');
});*/

httpServer.listen(5000, () => {
	console.log("listening on *:5000");
});

//Export app
module.exports = {
	app: app
};

//Load database
require("./database.js");

//Load logic
require("./trainingProgram.js");
require("./character.js");
require("./login.js");
require("./unlocks.js");
require("./statistics.js");
require("./youtubeapi.js");

//Redirect everything else to index
app.use("/*", express.static("../frontend/dist/index.html"));
