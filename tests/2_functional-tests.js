/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var { log, trace } = require('../controllers/helpers');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  var threadTexts = ['A test thread 1', 'A test thread 2'];
  var replyTexts = ['A test reply 1', 'A test reply 2'];
  var delete_passwords = ['pass123', 'pass456'];
  var threadIdOne, threadIdTwo;
  var replyIdOne, replyIdTwo;

  suite('API ROUTING FOR /api/threads/:board', function () {

    suite('POST', function () {

      test('Test POST /api/threads/board post two threads', function (done) {

        for (var i = 0; i < 2; i++) {
          chai.request(server)
            .post('/api/threads/test')
            .send({
              delete_password: delete_passwords[i],
              text: threadTexts[i]
            })
            .then(function (res) {
              assert.equal(res.status, 200);
              assert.isArray(res.redirects);
              assert.include(res.redirects.join(''), 'test');
            })
            .catch(function (error) {
              console.log(e)
            })
        }
        done();
      })
    })

    suite('GET', function () {

      test('Test GET /api/threads/board', function (done) {
        chai.request(server)
          .get('/api/threads/test')
          .then(function (res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'bumped_on');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'text');
            assert.property(res.body[0], 'replies');
            assert.notProperty(res.body[0], 'delete_password');
            assert.isArray(res.body[0].replies);
            assert.equal(res.body[0].text, threadTexts[1]); // latest bumped first
            threadIdOne = res.body[0]._id;
            threadIdTwo = res.body[1]._id;
            done();
          })
          .catch(function (error) {
            console.log(error)
          })
      })
    });

    suite('DELETE', function () {

      test('Test DELETE /api/thread/board with a wrong password', function (done) {
        chai.request(server)
          .delete('/api/threads/test')
          .send({
            thread_id: threadIdOne,
            delete_password: 'wrongpass'
          })
          .then(function (res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'incorrect password');
            done();
          })
          .catch(function (error) {
            console.log(error)
          })
      })

      test('Test DELETE /api/thread/board with a correct password', function (done) {
        chai.request(server)
          .delete('/api/threads/test')
          .send({
            thread_id: threadIdOne,
            delete_password: delete_passwords[1]
          })
          .then(function (res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          })
          .catch(function (error) {
            console.log(error)
          })
      })
    });

    suite('PUT', function () {
      test('Test PUT /api/thread/board report a thread', function (done) {
        chai.request(server)
          .put('/api/threads/test')
          .send({
            report_id: threadIdTwo
          })
          .then(function (res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          })
          .catch(function (error) {
            console.log(error)
          })
      })
    });
  });

  suite('API ROUTING FOR /api/replies/:board', function () {

    suite('POST', function () {
      test('Test POST /api/replies/board post two replies', function (done) {
        for (var i = 0; i < 2; i++) {
          chai.request(server)
            .post('/api/replies/test')
            .send({
              thread_id: threadIdTwo,
              delete_password: delete_passwords[i],
              text: replyTexts[i]
            })
            .then(function (res) {
              assert.equal(res.status, 200);
              assert.isArray(res.redirects);
              assert.include(res.redirects.join(''), 'test');
            })
            .catch(function (error) {
              console.log(error)
            })
        }
        done();
      })
    });

    suite('GET', function () {
      test('Test GET /api/replies/board', function (done) {
        chai.request(server)
          .get('/api/replies/test')
          .query({
            thread_id: threadIdTwo
          })
          .then(function (res) {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.property(res.body, 'bumped_on');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'text');
            assert.property(res.body, 'replies');
            assert.notProperty(res.body, 'delete_password');
            assert.isArray(res.body.replies);
            assert.equal(res.body.replies.length, 2);
            assert.property(res.body.replies[0], '_id');
            assert.property(res.body.replies[0], 'created_on');
            assert.property(res.body.replies[0], 'text');
            assert.notProperty(res.body.replies[0], 'delete_password')
            assert.equal(res.body._id, threadIdTwo);
            assert.equal(res.body.text, threadTexts[0]);

            replyIdOne = res.body.replies[0]._id;
            replyIdTwo = res.body.replies[1]._id;

            done();
          })
          .catch(function (error) {
            console.log(error)
          })
      })
    });

    suite('PUT', function () {
      test('Test PUT /api/replies/:board report a reply', function (done) {
        chai.request(server)
          .put('/api/replies/test')
          .send({
            thread_id: threadIdTwo,
            reply_id: replyIdOne
          })
          .then(function (res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          })
          .catch(function (error) {
            console.log(error)
          })
      })
    });

    suite('DELETE', function () {
      test('Test DELETE /api/replies/:board with a wrong password', function (done) {
        chai.request(server)
          .delete('/api/replies/test')
          .send({
            thread_id: threadIdTwo,
            reply_id: replyIdOne,
            delete_password: 'wrongpass'
          })
          .then(function (res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'incorrect password');
            done();
          })
          .catch(function (error) {
            console.log(error)
          })
      })

      test('Test DELETE /api/replies/:board with a correct password', function (done) {
        chai.request(server)
          .delete('/api/replies/test')
          .send({
            thread_id: threadIdTwo,
            reply_id: replyIdOne,
            delete_password: delete_passwords[0]
          })
          .then(function (res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          })
          .catch(function (error) {
            console.log(error)
          })
      })
    });
  });
});
