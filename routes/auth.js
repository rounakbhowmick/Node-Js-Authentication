const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

// const schema = Joi.object({
// 	name: Joi.string().min(6).required(),
// 	email: Joi.string().min(6).required().email(),
// 	password: Joi.string().min(6).required(),
// });

router.post("/register", async (req, res) => {
	//Lets validate data before we make a user.
	const { error } = registerValidation(req.body);
	// const { error } = schema.validate(req.body);
	// console.log(validation);
	if (error) return res.status(400).send(error.details[0].message);

	//Checking if the user is already in database
	const emailExist = await User.findOne({ email: req.body.email });
	if (emailExist) return res.status(400).send("Email already exists");

	//Hash passwords
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	//Create new user
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	});
	try {
		const savedUser = await user.save();
		res.send({ user: user._id });
	} catch (err) {
		res.status(400).send(err);
	}
});

//LOGIN
router.post("/login", async (req, res) => {
	//Lets validate data before we make a user.
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//Checking if the user is already in database
	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Email is not found");
	//Password is correct
	//req.body is the value given by the user(current value)
	//user value is stored value which in db
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) return res.status(400).send("Invalid password");

	//Create and assign a token
	const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
	res.header("auth-token", token).send(token);
	//res.send("Logged in!");
});
module.exports = router;
//55min
