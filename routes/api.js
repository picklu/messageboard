/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';


var expect = require('chai').expect;
var controllers = require('../controllers/handlers');

module.exports = function (app) {

  app.route('/api/threads/:board')
    .get(async function (req, res) {
      const board = req.params.board;
      const result = await controllers.getThreads(board);

      if (result && result.error) {
        res.json([]);
      }
      else if (result && Array.isArray(result)) {
        res.json(result);
      }
    })

    .post(function (req, res) {
      const now = new Date().toISOString();
      const board = req.params.board;
      const data = req.body;
      data.created_on = now;
      data.bumped_on = now;
      data.reported = false;

      res.redirect('/b/' + board + '/');
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
