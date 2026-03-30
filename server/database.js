// database.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

let client;

async function connectToMongoDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    console.log();
  }
  return client;
}

function getConnectedClient() {
  if (!client) throw new Error("MongoDB client not connected");
  return client;
}

module.exports = { connectToMongoDB, getConnectedClient };