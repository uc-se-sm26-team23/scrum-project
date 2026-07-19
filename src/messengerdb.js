// =============================================================================
// EECE/CS 3093C Software Engineering — Lab 3
// messengerdb.js — code skeleton provided by Phu Phung
// complete implementation by Team23
// =============================================================================
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uri = "mongodb+srv://slutskcp_db_user:vP1tYvpoOIQcnOwo@cluster0.gsxkdyd.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);
let users = client.db('Messenger').collection('user');

async function connect (){
  await client.connect();
  console.log('Debug>messengerdb.js: connected to MongoDB server!');
}

// ============================
// Use-Case-9: Authorize User
// ============================
const find = async (username,password)=>{
  let user = null;
  console.log(`Debug>messengerdb.js: find username '${username}'`); // password log is removed
  // Data layer independently re-validates type — defense in depth,
  // same NoSQL-injection guard as register(): reject non-string input
  if (typeof username !== 'string' || typeof password !== 'string') return null;
  // look up by username only — password is never queryable directly, it's hashed
  user = await users.findOne({ username: username });
  if (!user){
    console.log(`Debug>in messengerdb.js, username: '${username}' NOT FOUND`);
    return null;
  };
  console.log(`Debug>in messengerdb.js, username: '${username}' FOUND`);
  // compare the plaintext attempt against the stored bcrypt hash
  /* 
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) return null;
  */

  // Plain-text comparison (DELETE after Applying BCRYPT HASING PW)
  if (user.password !== password) return null;
  return user;
}

// ============================
// Use-Case-11: Store Messages
// ============================
const storePublicChat = (sender, message)=>{
  console.log("DEBUG> Storing Public message to MongoDB");

  //TODO: validate the data
  
  let timestamp = Date.now();
  let chat = {sender: sender, message: message, timestamp: timestamp};
  try{
      mongoclient.db("messenger").collection("public_chat").insertOne(chat);
  }catch{
      console.log("Debug>messengerdb.storePublicChat: error for adding '" + JSON.stringify(chat) + "'\n");
  }
}


module.exports = { connect, find };
