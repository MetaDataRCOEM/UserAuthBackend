var User = require('../models/user');
var Emp = require('../models/employee');
var jwt = require('jwt-simple');
var config = require('../config/dbconfig');

var functions = {
	addNew: function (req, res) {
		if (!req.body.username || !req.body.password) {
			res.json({ success: false, msg: 'Enter all fields' });
		} else {
			var newUser = User({
				username: req.body.username,
				mseID: req.body.mseID,
				password: req.body.password,
				time: req.body.time,
			});
			newUser.save(function (err, newUser) {
				if (err) {
					res.json({ success: false, msg: 'Failed to save' });
				} else {
					res.json({ success: true, msg: 'Successfully saved' });
				}
			});
		}
	},
	addNewEmp: function (req, res) {
		if (!req.body.username || !req.body.password) {
			res.json({ success: false, msg: 'Enter all fields' });
		} else {
			var newEmp = Emp({
				username: req.body.username,
				empID: req.body.empID,
				password: req.body.password,
			});
			newEmp.save(function (err, newEmp) {
				if (err) {
					res.json({ success: false, msg: 'Failed to save' });
				} else {
					res.json({ success: true, msg: 'Successfully saved' });
				}
			});
		}
	},
	authenticate: function (req, res) {
		User.findOne(
			{
				username: req.body.username,
			},
			function (err, user) {
				if (err) throw err;
				if (!user) {
					res.status(403).send({
						success: false,
						msg: 'Authentication Failed, User not found',
					});
				} else {
					user.comparePassword(
						req.body.password,
						function (err, isMatch) {
							if (isMatch && !err) {
								var token = jwt.encode(user, config.secret);
								res.json({ success: true, token: token });
							} else {
								return res.status(403).send({
									success: false,
									msg: 'Authentication failed, wrong password',
								});
							}
						}
					);
				}
			}
		);
	},
	authenticateEmp: function (req, res) {
		Emp.findOne(
			{
				username: req.body.username,
			},
			function (err, user) {
				if (err) throw err;
				if (!user) {
					res.status(403).send({
						success: false,
						msg: 'Authentication Failed, User not found',
					});
				} else {
					user.comparePassword(
						req.body.password,
						function (err, isMatch) {
							if (isMatch && !err) {
								var token = jwt.encode(user, config.secret);
								res.json({ success: true, token: token });
							} else {
								return res.status(403).send({
									success: false,
									msg: 'Authentication failed, wrong password',
								});
							}
						}
					);
				}
			}
		);
	},
	getinfo: function (req, res) {
		if (
			req.headers.authorization &&
			req.headers.authorization.split(' ')[0] === 'Bearer'
		) {
			var token = req.headers.authorization.split(' ')[1];
			var decodedtoken = jwt.decode(token, config.secret);
			return res.json({
				success: true,
				msg: {
					username: decodedtoken.username,
					mseID: decodedtoken.mseID,
					timeStamp: decodedtoken.time,
				},
			});
		} else {
			return res.json({ success: false, msg: 'No Headers' });
		}
	},
};

module.exports = functions;
