const dbConfig = require('./dbconfig');
const {MongoClient} = require('mongodb');

var Users = []
var Emps = []

function ConnectDB() {
	const client = new MongoClient('mongodb+srv://RndmCodeGuy20:Shantanu2002@sihtestcluster.84cvxs3.mongodb.net/?retryWrites=true&w=majority');
	try {
		// Connect to the MongoDB cluster
		client.connect((err)=>{
			const db = client.db('test');
		db.collection('users').find().forEach((v, i)=>{Users.push(v)} );
		db.collection('emps').find().forEach((v, i)=>{Emps.push(v)} );
		console.log('data fetched')
		});
		console.log('Connected successfully to server');
	
		// Make the appropriate DB calls
		// listDatabases(client);
	
	} catch (e) {
		console.error(e);
	} finally {
		client.close();
	}
	
	// try {
	// 	const conn = await mongoose.connect(dbConfig.database, {
	// 		useNewUrlParser: true,
	// 		useUnifiedTopology: true,
	// 		useFindAndModify: false,
	// 	});
	// 	console.log(`MongoDB Connected: ${conn.connection.host}`);
	// } catch (err) {
	// 	console.log(err);
	// 	process.exit(1);
	// }
};

module.exports.ConnectDB = ConnectDB
module.exports.Users = Users
module.exports.Emps = Emps