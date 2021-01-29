const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
// Create a new MongoClient
const client = new MongoClient(uri);
// Function to connect to the server
async function connect() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
  } catch(err) {
      console.log('DB Error, Not connected')
  }
}


module.exports = {connect ,client}



