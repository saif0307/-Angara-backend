const express = require("express");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 6969;

app.use(
	cors({
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		preflightContinue: false,
		optionsSuccessStatus: 204,
		exposedHeaders:
			"Access-Control-Allow-Method,Access-Control-Allow-Origin,Content-Type,Content-Length",
	})
);

app.get("/", (req, res) => {
	res.send("Testing the server!");
});

app.use(express.json());

app.use("/user", require("./routes/user"));
app.use("/", require("./routes/auth"));

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
