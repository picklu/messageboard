var MongoClient = require('mongodb').MongoClient;
const MONGODB_CONNECTION_STRING = process.env.DB_LOCAL || process.env.DB;
const DB_NAME = process.env.DB_NAME;

const controllers = {};

// connect to the database
controllers.connectDB = async function () {
    let result;
    try {
        let client = await MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true });
        result = { client: client, db: client.db(DB_NAME) };
    }
    catch (error) {
        result = { error: error };
    }
    finally {
        return result;
    }
}

// Create a new thread to a board
controllers.insertThread = async function (collectionName, data) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }

    const { client, db } = dbConn;
    const collection = db.collection(collectionName);
    let result;
    try {
        result = await collection.insertOne(data);
    }
    catch (error) {
        result = { error: error };
    }
    finally {
        if (client) {
            await client.close();
        }
        return result;
    }
}

// Create a new reply to a thread in a board
controllers.insertReply = async function (collectionName, threadId, data) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        console.log("== db insert data error ==>", dbConn.error);
        return { error: dbConn.error };
    }

    const { client, db } = dbConn;
    const collection = db.collection(collectionName);
    let result;
    try {
        result = await collection.update(
            { _id: threadId },
            { $addToSet: { replies: data } }
        );
    }
    catch (error) {
        result = { error: error };
    }
    finally {
        if (client) {
            await client.close();
        }
        return result;
    }
}

// get all threads in a board
controllers.getThreads = async function (collectionName, threadLimit, repliesLimit) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }
    const { client, db } = dbConn;
    const collection = db.collection(collectionName);
    let result;
    try {
        result = await collection.aggregate([
            {
                $project: {
                    _id: 1,
                    text: 1,
                    created_on: 1,
                    bumped_on: 1,
                    replies: 1,
                    replycount: { $size: '$replies' }
                }
            }
        ]).sort({ bumped_on: -1 }).limit(threadLimit).toArray();
    }
    catch (error) {
        result = { error: error };
    }
    finally {
        if (client) {
            await client.close();
        }
        return result;
    }
}

// get all replies in a thread
controllers.getReplies = async function (collectionName, id) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }
    const { client, db } = dbConn;
    const collection = db.collection(collectionName);
    let result;
    try {
        result = await collection.findOne({ _id: id });
    }
    catch (error) {
        result = { error: error };
    }
    finally {
        if (client) {
            await client.close();
        }
        return result;
    }
}

// delete a thread in a board
controllers.deleteThread = async function (collectionName, id) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }
    const { client, db } = dbConn;
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
        if (client) {
            await client.close();
        }
        return result;
    }
}

// delete a reply of a thread
controllers.deleteReply = async function (collectionName, id) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }
    const { client, db } = dbConn;
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
        if (client) {
            await client.close();
        }
        return result;
    }
}

module.exports = controllers;