const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		console.log("Unauthorized")
		return res.writeHead(307, {Location: '/login?reason=not-logged-in'}).end(); // redirect
		//return res.status(403).send("Unauthorized; Token required");
	}

	try {
		const decoded = jwt.verify(token, config.JWT_TOKEN);

		req.body.user = decoded;
	} catch (err) {
		return res.writeHead(307, {Location: "/login?reason=invalid-token"}).end(); // redirect
		//return res.status(401).send("Invalid Token");
	}

	return next();
};

module.exports = verifyToken;
