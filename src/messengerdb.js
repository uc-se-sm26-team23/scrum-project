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

// ========================================================================
// Database: 'Messenger'
// Table (Collection): 'user'
// ========================================================================
let users = client.db('Messenger').collection('user');

// ========================================================================
// Database: 'Messenger'
// Table (Collection): 'chat' (Note: For public chat, private chat implementation will likely be different)
// ========================================================================

let public_chat = client.db('Messenger').collection('chat');

// ========================================================================
// Database: 'Messenger'
// Table (Collection): 'privchat' 
// ========================================================================

let priv_chat = client.db('Messenger').collection('privchat');

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

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) return null;


  return user; // return user object if matches
}

// ============================
// Use-Case-10: Register User
// ============================

const register = async (username, password) => {
  console.log(`Debug>messengerdb.js: register username '${username}'`);

  // AC-10.4: Data Layer Independently re-validates format - Don't trust the server
  const usernamePattern = /^\w{3,20}$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  if (typeof username !== 'string' || !usernamePattern.test(username) 
    || typeof password !== 'string' || !passwordPattern.test(password)) {
    return {success: false, message: 'Error: Invalid Username or Password Format!'};
  }

  // AC-10.5: Check if usernmae already exist before inserting into database
  // return document object if exist
  // return null if none
  const existance = await users.findOne( {username: username} )
  if (existance !== null) {
    return {success: false, message: 'Username Already Exists!'};
  }

  // AC-10.6: Hash password before storing.
  const hashedPassword = await bcrypt.hash(password, 10)
  await users.insertOne( {username: username, password: hashedPassword} )

  return {success: true};
};


// ============================
// Use-Case-0x: Edit profile
// ============================
// ============================
// Update Username
// ============================
const updateUsername = async (currentUsername, newUsername) => {
  console.log(`Debug>messengerdb.js: updating username from '${currentUsername}' to '${newUsername}'`);

  const usernamePattern = /^\w{3,20}$/;
  if (typeof newUsername !== 'string' || !usernamePattern.test(newUsername)) {
    return { success: false, message: 'Invalid new username format!' };
  }

  // Check if new username already exists
  const existing = await users.findOne({ username: newUsername });
  if (existing !== null) {
    return { success: false, message: 'Username already taken!' };
  }

  const result = await users.updateOne(
    { username: currentUsername },
    { $set: { username: newUsername } }
  );

  if (result.modifiedCount === 0) {
    return { success: false, message: 'User not found.' };
  }

  return { success: true };
};

// ============================
// Update Password
// ============================
const updatePassword = async (username, oldPassword, newPassword) => {
  console.log(`Debug>messengerdb.js: updating password for '${username}'`);

  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  if (typeof newPassword !== 'string' || !passwordPattern.test(newPassword)) {
    return { success: false, message: 'Invalid new password format!' };
  }

  // Find user by current username
  const user = await users.findOne({ username: username });
  if (!user) {
    return { success: false, message: 'User not found.' };
  }

  // Verify old password using bcrypt
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return { success: false, message: 'Incorrect old password.' };
  }

  // Hash new password and save
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await users.updateOne(
    { username: username },
    { $set: { password: hashedNewPassword } }
  );

  return { success: true };
};


// ============================
// Use-Case-06 v2: Show ALL Users (including Online & Offline)
// ============================
const getAllUsers = async () =>{

  // fetches every registered username from database in below structure:
  // [
  // {username: "test"}, ...
  // ]
  const result = await users.find({}, {projection: {username: 1, _id: 0} }).toArray();

  // loops over each document object and return array that consist registered usernames
  return result.map(u => u.username); // [test, admin, ...]

}

// ============================
// Use-Case-11: Store Messages
// ============================
const storePublicChat = (sender, message)=>{
  console.log("Debug> Storing Public message to MongoDB sender:", sender, " message: ", message);

  //TODO: validate the data
  
  let timestamp = Date.now();
  let chat = {sender: sender, message: message, timestamp: timestamp};
  try{
      public_chat.insertOne(chat);
  }catch{
      console.log("Debug>messengerdb.storePublicChat: error for adding '" + JSON.stringify(chat) + "'\n");
  }
}

const storePrivChat = (sender, receiver, message)=>{
  console.log("Debug> Storing Private Message to MongoDB sender: ", sender, " receiver: ", receiver, "message: ", message);
  //TODO: validate the data

  let timestamp = Date.now();
  let chat = {sender: sender, receiver: receiver, message: message, timestamp: timestamp};
  try {
    priv_chat.insertOne(chat);
  } catch {
    console.log("Debug>messengerdb.storePrivChat: error for adding '" + JSON.stringify(chat) + "'\n");
  }
};

// returns array of public chat objects [{_id, sender, message, timestamp},...]
// [] if nothing
// [] is not nullable
const retrievePublicChat = async () => {
  let public_chat_history = await public_chat.find({}).sort({timestamp:1}).limit(100).toArray();
  if (!public_chat_history || public_chat_history.length === 0) return; 
  return public_chat_history;
}

const retrievePrivateChat = async (username) => {
  let private_chat_history = await priv_chat.find({$or: [{sender: username}, {receiver: username}]}).sort({timestamp:1}).limit(100).toArray();
  if (!private_chat_history || private_chat_history === 0) return;
  return private_chat_history;
}

module.exports = { connect, find , register, updateUsername, 
  updatePassword, storePublicChat, storePrivChat , getAllUsers,
  retrievePublicChat, retrievePrivateChat};
