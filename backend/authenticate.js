const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		console.log("Unauthorized");
		return res.writeHead(307, {Location: "/login"}).end(); // redirect
		//return res.status(403).send("Unauthorized; Token required");
	}

	try {
		const decoded = jwt.verify(token, config.JWT_TOKEN);

		req.body.user = decoded;

		console.log("Authentication success by: " + decoded.email);
	} catch (err) {
		console.log("Invalid Token, probably because it expired");
		return res.writeHead(307, {Location: "/login"}).end(); // redirect
		//return res.status(401).send("Invalid Token");
	}

	return next();
};

module.exports = verifyToken;
