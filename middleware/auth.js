const jwt = require("jsonwebtoken");
const User = require("../db/models/user");

const secret = process.env.API_KEY_SECRET;

const auth = {
	async superAdminAuth(req, res, next) {
		try {
			const token = req.header("Authorization").replace("Bearer ", "");
			const decoded = jwt.verify(token, secret);
			const user = await User.findOne({
				_id: decoded._id,
				"tokens.token": token,
			});
			if (user) {
				if (user.role === "SUPER_ADMIN") {
					req.user = user;
					req.token = token;
					next();
				} else {
					res.status(404).send({
						message: "Unauthorized admin auth!",
					});
				}
			} else {
				res.status(403).send({
					message: "Invalid Credentials!",
				});
			}
		} catch (error) {
			res.status(403).send({
				message: "Invalid Credentials!",
			});
		}
	},

	async superAdminAndUserAuth(req, res, next) {
		try {
			const token = req.header("Authorization").replace("Bearer ", "");
			const decoded = jwt.verify(token, secret);
			const user = await User.findOne({
				_id: decoded._id,
				"tokens.token": token,
			});

			if (user) {
				if (user.role === "SUPER_ADMIN" || user.role === "USER") {
					req.user = user;
					req.token = token;
					next();
				} else {
					res.status(404).send({
						message: "Unauthorized admin auth!",
					});
				}
			} else {
				res.status(403).send({
					message: "Invalid Credentials!",
				});
			}
		} catch (error) {
			res.status(403).send({
				message: "Invalid Credentials!",
			});
		}
	},
};

module.exports = auth;
