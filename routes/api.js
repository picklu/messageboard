/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';


var bcrypt = require('bcrypt');
var expect = require('chai').expect;
var ObjectId = require('mongodb').ObjectId;

var controllers = require('../controllers/handlers');
var trace = require('../controllers/helpers').trace;

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
const THREAD_LIMIT = process.env.THREAD_LIMIT || 10;
const REPLIES_LIMIT = process.env.REPLIES_LIMIT || 3;


module.exports = function (app) {

  app.route('/api/threads/:board')
    .get(async function (req, res) {
      const board = req.params.board;
      const result = await controllers.getThreads(board, THREAD_LIMIT, REPLIES_LIMIT);

      if (result && result.error) {
        return res.json([]);
      }
      else if (result) {
        return res.json(result.map(thread => {
          thread.bumped_on = thread.bumped_on[0];
          thread.created_on = thread.created_on[0];
          thread.text = thread.text[0];
          if (thread.replycount === 1 && thread.replies[0]._id == undefined) {
            thread.replies = [];
            thread.replycount = 0;
          }
          return thread;
        }));
      }
    })

    .post(async function (req, res) {
      const now = new Date().toISOString();
      const board = req.params.board;
      const data = {};
      const hash = bcrypt.hashSync(req.body.delete_password, SALT_ROUNDS);
      data.delete_password = hash;
      data.text = req.body.text;
      data.created_on = now;
      data.bumped_on = now;
      data.reported = false;
      data.replies = [];

      const result = await controllers.insertThread(board, data);

      res.redirect(`/b/${board}/`);
    })

    .put(function (req, res) {

    })

  delete (function (req, res) {

  })

  app.route('/api/replies/:board')
    .get(async function (req, res) {
      const board = req.params.board;
      const threadId = ObjectId(req.query.thread_id);
      const result = await controllers.getReplies(board, threadId);
      if (result && result.error) {
        return res.json([]);
      }
      else if (result) {
        return res.json(result);
      }
    })

    .post(async function (req, res) {
      const now = new Date().toISOString();
      const board = req.params.board;
      const data = {};
      const hash = bcrypt.hashSync(req.body.delete_password, SALT_ROUNDS);
      const threadId = ObjectId(req.body.thread_id);
      data._id = ObjectId();
      data.created_on = now;
      data.delete_password = hash;
      data.text = req.body.text;
      data.reported = false;

      const result = await controllers.insertReply(board, threadId, data);

      res.redirect(`/b/${board}/`);
    })

    .put(function (req, res) {

    })

  delete (function (req, res) {

  });

};
