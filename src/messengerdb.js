// =============================================================================
// EECE/CS 3093C Software Engineering — Lab 3
// messengerdb.js — code skeleton provided by Phu Phung
// complete implementation by Team23
// =============================================================================
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uri = "mongodb+srv://slutskcp_db_user:vP1tYvpoOIQcnOwo@cluster0.gsxkdyd.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

async function connect (){
  await client.connect();
  console.log('Debug>messengerdb.js: connected to MongoDB server!');
}

module.exports = { connect };
