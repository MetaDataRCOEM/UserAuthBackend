const dbConfig = require('./dbconfig');
const {MongoClient} = require('mongodb');


function connectDB() {
	try {
		// Connect to the MongoDB cluster
		client.connect((err)=>{
			const db = client.db();
			db.collection('users').find().forEach(printjson);
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

module.exports = connectDB;
