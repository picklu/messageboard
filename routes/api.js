/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';


var expect = require('chai').expect;
var bcrypt = require('bcrypt');

var controllers = require('../controllers/handlers');

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

module.exports = function (app) {

  app.route('/api/threads/:board')
    .get(async function (req, res) {
      const board = req.params.board;
      const result = await controllers.getThreads(board);

      console.log('== get result ==>', result);

      if (result && result.error) {
        res.json([]);
      }
      else if (result) {
        res.json([].concat(result));
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
      console.log('== insert result ==>', result);

      res.redirect(`/b/${board}/`);
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
