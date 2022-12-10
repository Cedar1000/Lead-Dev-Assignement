const { MongoClient } = require('mongodb');

//DB password 1YtFfXMneRPag85J


// Connection URL

const client = new MongoClient(process.env.DB_URL);

// Database Name
const dbName = 'interviewProject';

console.log('running!');
// Use connect method to connect to the server
client.connect().then(() => console.log('Connected successfully to database!'));

module.exports = client.db(dbName);
