const mongoose = require("mongoose");

// const databaseName = "angara-portal-api";
// const URL = `mongodb+srv://m_saif1999:LX3PEcapIv1Gt6Du@cluster1.s10juvx.mongodb.net/angara-portal-api?retryWrites=true&w=majority`;
const URL = process.env.MONGODB_HOST;

mongoose.connect(
	URL,
	{
		// useCreateIndex: true,   // ! This option is deprecated in mongoose v5.x.x
		useUnifiedTopology: true,
		useNewUrlParser: true,
		autoIndex: true, // NOTE: Unique will have issue if this is set to false
	},
	(err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Connected to MongoDB");
		}
	}
);
