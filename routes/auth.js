const express = require("express");

const router = new express.Router();

const User = require("../db/models/user");
const auth = require("../middleware/auth");

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findByCredentials(email, password);
		if (!user) {
			res.status(401).send();
		}
		const token = await user.generateAuthToken();

		res.send({
			user,
			token,
		});
	} catch (error) {
		res.status(400).send({
			message: error.message,
		});
	}
});

router.post("/logout", auth.superAdminAndUserAuth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(
			(token) => token.token !== req.token
		);
		await req.user.save();
		res.status(200).send();
	} catch (error) {
		res.status(400).send("An error occured!");
	}
});

router.post("/logout-all", auth.superAdminAndUserAuth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.status(200).send();
	} catch (error) {
		res.status(400).send("An error occured!");
	}
});

router.post;

module.exports = router;
