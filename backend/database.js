require("dotenv").config();
require("./database_connection.js").connection();
//const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");

const User = require("./models/model_user.js");


async function cre () {
const user = await User.create({
	userName: "FIlip",
	email: "Filipemailsss",
	password: "Filippassword"
})}

async function adsd () {
    const user = await User.findOne({"email": "Filipemailsss"});
    console.log(user)
}


//cre();


adsd();
