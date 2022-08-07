const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("../mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			minLength: 3,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			minLength: 3,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			minLength: 3,
			trim: true,
			unique: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Email is invalid");
				}
			},
		},
		password: {
			type: String,
			required: true,
			minLength: 8,
			trim: true,
			validate(value) {
				if (value.toLowerCase().includes("password")) {
					throw new Error("Password cannot contain 'password'");
				}
			},
		},
		role: {
			type: String,
			enum: ["USER", "ADMIN", "SUPER_ADMIN"],
			default: "USER",
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

// Hiding private data
userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.tokens;
	delete userObject.password;

	return userObject;
};

// Generate an Auth Token for the User
userSchema.methods.generateAuthToken = async function () {
	const user = this;

	const token = jwt.sign({ _id: user._id.toString() }, "dummyjwtsecret");
	user.tokens = user.tokens.concat({ token });

	await user.save();
	return token;
};

// Find User and Login
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error("User not found!");
	}
	const isValidPass = await bcrypt.compare(password, user.password);

	if (!isValidPass) {
		throw new Error("Incorrect credentials!");
	}

	return user;
};

// Pre Save middleware for hashing password
userSchema.pre("save", async function (next) {
	const user = this; // Normal function are used for `this` binding
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
