// server/models/index.js
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017"; // replace with your MongoDB URI if different
const dbName = "awesome-todos"; // replace with your database name

let db; // to hold the connected database

async function connectDB() {
  if (db) return db; // reuse existing connection

  try {
    const client = new MongoClient(uri); // no need for useNewUrlParser or useUnifiedTopology
    await client.connect();
    console.log("Connected to MongoDB");

    db = client.db(dbName);
    return db;
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1); // stop server if DB connection fails
  }
}

module.exports = { connectDB };