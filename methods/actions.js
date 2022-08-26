var User = require('../models/user');
var Emp = require('../models/employee');
var jwt = require('jwt-simple');
var config = require('../config/dbconfig');
const mongoose = require("mongoose");
const db = require('../config/db')

// Replace the uri string with your MongoDB deployment's connection string.
// const uri =
//   "mongodb+srv://RndmCodeGuy20:Shantanu2002@sihtestcluster.84cvxs3.mongodb.net/?retryWrites=true&w=majority";

// async function findAll() {
//   try {
//     await client.connect();
//     // database and collection code goes here
//     // find code goes here
// 	const db = client.db("test");
//     const coll = db.collection("users");
//     // find code goes here
//     const cursor = coll.find();
// 	await cursor.forEach(console.log);
//     // iterate code goes here
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

// function ConnectDB() {
// 	const client = new MongoClient('');
// 	try {
// 		// Connect to the MongoDB cluster
// 		client.connect((err)=>{
// 			db = client.db('test');
// 		// db.collection('users').find().forEach((v, i)=>{console.log(v)} );
// 		});
// 		console.log('Connected successfully to server');
	
// 		// Make the appropriate DB calls
// 		// listDatabases(client);
	
// 	} catch (e) {
// 		console.error(e);
// 	} finally {
// 		client.close();
// 	}
	
// 	// try {
// 	// 	const conn = await mongoose.connect(dbConfig.database, {
// 	// 		useNewUrlParser: true,
// 	// 		useUnifiedTopology: true,
// 	// 		useFindAndModify: false,
// 	// 	});
// 	// 	console.log(`MongoDB Connected: ${conn.connection.host}`);
// 	// } catch (err) {
// 	// 	console.log(err);
// 	// 	process.exit(1);
// 	// }
// };

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
			newEmp.save(function (err,
				 newEmp) {
				if (err) {
					res.json({ success: false, msg: 'Failed to save' });
				} else {
					res.json({ success: true, msg: { status: 'success' } });
				}
			});
		}
	},
	authenticate: function (req, res) {
		console.log('step: 1')
		console.log(req)
		console.log(db.Emps)
		
		if (db.Users.filter(e => e.username === req.body.username && e.password === req.body.password).length > 0) {
			var token = jwt.encode(db.Users.filter(e => e.username === req.body.username && e.password === req.body.password)[0], config.secret);
			console.log('reached')
			return res.json({ success: true, users: db.Users });
		  }
		  else{
			return res.json({ success: false, token: token });
		  }

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
					name: decodedtoken.name,
					username: decodedtoken.username,
					mseID: decodedtoken.mseID,
					timeStamp: decodedtoken.time,
					block: decodedtoken.block,
					panchayat: decodedtoken.panchayat,
					state: decodedtoken.state,
					district: decodedtoken.state,
					attendance: decodedtoken.attendance,
				},
			});
		} else {
			return res.json({ success: false, msg: 'No Headers' });
		}
	},
	addAttend: function (req, res) {
		if (
			req.headers.authorization &&
			req.headers.authorization.split(' ')[0] === 'Bearer' &&
			req.headers.authorization.split(' ')[2] !== ''
		) {
			var token = req.headers.authorization.split(' ')[1];
			var decodedtoken = jwt.decode(token, config.secret);
			return res.json({
				success: true,
				msg: {
					username: decodedtoken.username,
					empID: decodedtoken.empID,
					attendance: decodedtoken.attendance,
				},
			});
		} else {
			return res.json({ success: false, msg: 'No Headers' });
		}
	},
};

module.exports = functions;
