const express = require("express");

const router = new express.Router();

const User = require("../db/models/user");
const auth = require("../middleware/auth");

// Create a new User
router.post("/create", async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		res.status(201).send(user);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Get all Users
router.get("/", auth.superAdminAuth, async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Get a User by ID
router.get("/:id", auth.superAdminAuth, async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).send();
		}
		res.send(user);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Update a User by ID
router.patch("/:id", auth.superAdminAndUserAuth, async (req, res) => {
	const { id } = req.params;
	const updates = Object.keys(req.body);
	const allowedUpdates = ["firstName", "lastName", "password", "role"];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);
	if (!isValidOperation) {
		return res.status(400).send({ error: "Invalid updates!" });
	}
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).send();
		}
		updates.forEach((update) => (user[update] = req.body[update]));
		await user.save();
		res.send(user);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Delete a User by ID
router.delete("/:id", auth.superAdminAuth, async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findByIdAndDelete(id);
		if (!user) {
			return res.status(404).send();
		}
		res.send(user);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
