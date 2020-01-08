const MongoClient = require('mongodb').MongoClient;
const MONGODB_CONNECTION_STRING = process.env.DB_LOCAL || process.env.DB;
const DB_NAME = process.env.DB_NAME;

const { log, trace } = require('../controllers/helpers');

const controllers = {};

// connect to the database
controllers.connectDB = async function () {
    let result;
    try {
        let client = await MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true });
        result = { client: client, db: client.db(DB_NAME) };
    }
    catch (error) {
        result = { error };
    }
    finally {
        return result;
    }
}

// Create a new thread to a board
controllers.insertThread = async function (board, data) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }

    const { client, db } = dbConn;
    const collection = db.collection(board);
    let result;
    try {
        result = await collection.insertOne(data);
    }
    catch (error) {
        result = { error };
    }
    finally {
        if (client) {
            await client.close();
        }
        return result;
    }
}

// Create a new reply to a thread in a board
controllers.insertReply = async function (board, threadId, data) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }

    const { client, db } = dbConn;
    const collection = db.collection(board);
    let result;
    try {
        result = await collection.updateOne(
            { _id: threadId },
            { $set: { bumped_on: data.created_on }, $addToSet: { replies: data } }
        );
    }
    catch (error) {
        result = { error };
    }
    finally {
        if (client) {
            await client.close();
        }
        return result;
    }
}

// Report to a thread in a board
controllers.reportToThread = async function (board, threadId) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }

    const { client, db } = dbConn;
    const collection = db.collection(board);
    let result;
    try {
        result = await collection.updateOne(
            { _id: threadId },
            {
                $set: { reported: true }
            }
        );
    }
    catch (error) {
        result = { error };
    }
    finally {
        if (client) {
            await client.close();
        }
        return result;
    }
}

// Report to a reply in a thread of a board
controllers.reportToReply = async function (board, threadId, replyId) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }

    const { client, db } = dbConn;
    const collection = db.collection(board);
    let result;
    try {
        result = await collection.updateOne(
            {
                _id: threadId,
                'replies._id': replyId
            },
            {
                $set: { 'replies.$.reported': true }
            }
        );
    }
    catch (error) {
        result = { error };
    }
    finally {
        if (client) {
            await client.close();
        }
        return result;
    }
}


// get all threads in a board
controllers.getThreads = async function (board, threadLimit, repliesLimit) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }
    const { client, db } = dbConn;
    const collection = db.collection(board);
    let result;
    try {
        result = await collection
            .aggregate([
                {
                    $unwind: {
                        path: '$replies',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        bumped_on: { $addToSet: '$bumped_on' },
                        created_on: { $addToSet: '$created_on' },
                        text: { $addToSet: '$text' },
                        replies: {
                            $push: {
                                _id: '$replies._id',
                                created_on: '$replies.created_on',
                                text: '$replies.text'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        text: 1,
                        created_on: 1,
                        bumped_on: 1,
                        replies: { $slice: ['$replies', 0, repliesLimit] },
                        replycount: { $size: "$replies" }
                    }
                }
            ])
            .sort({ bumped_on: -1 })
            .limit(threadLimit).toArray();
    }
    catch (error) {
        result = { error };
    }
    finally {
        if (client) {
            await client.close();
        }
        return result;
    }
}

// get all replies in a thread
controllers.getReplies = async function (board, threadId) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }
    const { client, db } = dbConn;
    const collection = db.collection(board);
    let result;
    try {
        result = await collection
            .findOne(
                {
                    _id: threadId
                },
                {
                    fields: {
                        delete_password: 0,
                        reported: 0,
                        "replies.delete_password": 0,
                        "replies.reported": 0
                    }
                }
            );
    }
    catch (error) {
        result = { error };
    }
    finally {
        if (client) {
            await client.close();
        }
        return result;
    }
}


// get all replies in a thread
controllers.getThreadPassword = async function (board, threadId) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }
    const { client, db } = dbConn;
    const collection = db.collection(board);
    let result;
    try {
        result = await collection
            .findOne(
                {
                    _id: threadId
                },
                {
                    fields: {
                        _id: 0,
                        bumped_on: 0,
                        created_on: 0,
                        text: 0,
                        reported: 0,
                        replies: 0
                    }
                }
            );
    }
    catch (error) {
        result = { error };
    }
    finally {
        if (client) {
            await client.close();
        }
        return result;
    }
}


// get all replies in a thread
controllers.getRepliesPassword = async function (board, threadId, repliesId) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }
    const { client, db } = dbConn;
    const collection = db.collection(board);
    let result;
    try {
        result = await collection
            .findOne(
                {
                    _id: threadId,
                    'replies._id': repliesId
                },
                {
                    fields: {
                        bumped_on: 0,
                        created_on: 0,
                        text: 0,
                        delete_password: 0,
                        reported: 0,
                        "replies.text": 0,
                        "replies.created_on": 0,
                        "replies.reported": 0
                    }
                }
            );
    }
    catch (error) {
        result = { error };
    }
    finally {
        if (client) {
            await client.close();
        }
        return result;
    }
}

// delete a thread in a board
controllers.deleteThread = async function (board, threadId) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }
    const { client, db } = dbConn;
    const collection = db.collection(board);
    let result;
    try {
        result = await collection.findOneAndDelete({ _id: threadId });
    }
    catch (error) {
        result = { error };
    }
    finally {
        if (client) {
            await client.close();
        }
        return result;
    }
}

// delete a reply of a thread
controllers.deleteReply = async function (board, id) {
    const dbConn = await controllers.connectDB();
    if (dbConn.error) {
        return { error: dbConn.error };
    }
    const { client, db } = dbConn;
    const collection = db.collection(board);
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
        result = { error };
    }
    finally {
        if (client) {
            await client.close();
        }
        return result;
    }
}

module.exports = controllers;