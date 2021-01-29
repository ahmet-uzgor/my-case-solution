const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
// Create a new MongoClient
let client = new MongoClient(uri, { useUnifiedTopology: true });
async function connectToDB() {
  await client.connect().then(() => {
    console.log('MongoDb is Connected')
  }).catch(err => {
    throw new Error('DB Erro')
  })
};

module.exports = { client, connectToDB }





