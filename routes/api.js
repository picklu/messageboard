/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB_LOCAL || process.env.DB;
const DB_NAME = process.env.DB_NAME;

var client;

async function closeDBConnection() {
  if (client) {
    await client.close();
    client = undefined;
  }
  return;
}

// connect to the database
async function connectDB() {
  let result;
  if (!client) {
    try {
      client = await MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true });
      result = { db: client.db(DB_NAME) };
    }
    catch (error) {
      result = { error: error };
    }
    finally {
      return result;
    }
  }
  return { error: 'Previous connection was not closed!' };
}

// Create a new thread to a board
async function insertThread(collectionName, data) {

  const dbConn = await connectDB();
  if (dbConn.error) {
    console.log("== db insert data error ==>", dbConn.error);
    return { error: dbConn.error };
  }
  const db = dbConn.db;
  const collection = db.collection(collectionName);
  let result;
  try {
    result = await collection.insertOne(data);
  }
  catch (error) {
    result = { error: error };
  }
  finally {

    await closeDBConnection();
    return result;
  }
}

// Create a new reply to a thread in a board
async function insertReply(collectionName, data) {

  const dbConn = await connectDB();
  if (dbConn.error) {
    console.log("== db insert data error ==>", dbConn.error);
    return { error: dbConn.error };
  }
  const db = dbConn.db;
  const collection = db.collection(collectionName);
  let result;
  try {
    result = await collection.insertOne(data);
  }
  catch (error) {
    result = { error: error };
  }
  finally {

    await closeDBConnection();
    return result;
  }
}

// get all threads in a board
async function getThreads(collectionName) {
  const dbConn = await connectDB();
  if (dbConn.error) {
    return { error: dbConn.error };
  }
  const db = dbConn.db;
  const collection = db.collection(collectionName);
  let result;
  try {
    result = await collection.aggregate([
      {
        $project: {
          _id: 1,
          title: 1,
          commentcount: { $size: '$comments' }
        }
      }
    ]).toArray();
  }
  catch (error) {
    result = { error: error };
  }
  finally {
    await closeDBConnection();
    return result;
  }
}

// get all replies in a thread
async function getReplies(collectionName, id) {
  const dbConn = await connectDB();
  if (dbConn.error) {
    return { error: dbConn.error };
  }
  const db = dbConn.db;
  const collection = db.collection(collectionName);
  let result;
  try {
    result = await collection.findOne({ _id: id });
  }
  catch (error) {
    result = { error: error };
  }
  finally {
    await closeDBConnection();
    return result;
  }
}

// delete a thread in a board
async function deleteThread(collectionName, id) {
  const dbConn = await connectDB();
  if (dbConn.error) {
    return { error: dbConn.error };
  }
  const db = dbConn.db;
  const collection = db.collection(collectionName);
  let result;
  try {
    if (id) {
      result = await collection.findOneAndDelete({ _id: id });
    }
    else {
      result = await collection.deleteMany({});
    }
  }
  catch (error) {
    result = { error: error };
  }
  finally {
    await closeDBConnection();
    return result;
  }
}

// delete a reply of a thread
async function deleteReply(collectionName, id) {
  const dbConn = await connectDB();
  if (dbConn.error) {
    return { error: dbConn.error };
  }
  const db = dbConn.db;
  const collection = db.collection(collectionName);
  let result;
  try {
    if (id) {
      result = await collection.findOneAndDelete({ _id: id });
    }
    else {
      result = await collection.deleteMany({});
    }
  }
  catch (error) {
    result = { error: error };
  }
  finally {
    await closeDBConnection();
    return result;
  }
}


module.exports = function (app) {

  app.route('/api/threads/:board')
    .get(function (req, res) {
      res.json([])
    })

    .post(function (req, res) {

    })

    .put(function (req, res) {

    })

  delete (function (req, res) {

  })

  app.route('/api/replies/:board')
    .get(function (req, res) {

    })

    .post(function (req, res) {

    })

    .put(function (req, res) {

    })

  delete (function (req, res) {

  });

};
