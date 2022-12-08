const { MongoClient } = require('mongodb');

//DB password 1YtFfXMneRPag85J

// Connection URL
const url =
  'mongodb+srv://Cedardaniel:1YtFfXMneRPag85J@cluster0.nuofk14.mongodb.net/test';
const client = new MongoClient(url);

// Database Name
const dbName = 'interviewProject';

console.log('running!');
// Use connect method to connect to the server
client.connect().then(() => console.log('Connected successfully to server'));

module.exports = client.db(dbName);
