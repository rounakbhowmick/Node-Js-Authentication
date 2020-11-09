const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//Import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

//Connect to DB
mongoose
	.connect(process.env.DB_CONNECTION, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected");
	})
	.catch((error) => {
		console.log(error);
	});

//Middleware
app.use(express.json());
//Route Middlewares
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

//app.listen(5000);
const port = 5000;
app.listen(port, () => {
	console.log(`App ♻ running on port ${port}...`);
});
