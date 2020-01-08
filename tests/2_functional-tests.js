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

  suite('API ROUTING FOR /api/threads/:board', function () {
    var threadText = 'A test thread';
    var replyText = 'A test reply';
    var delete_password = 'pass123';
    var threadId;
    var replyId;

    suite('POST', function () {

      test('Test POST /api/threads/board', function (done) {
        chai.request(server)
          .post('/api/threads/test')
          .send({
            delete_password: delete_password,
            text: threadText
          })
          .then(function (res) {
            assert.equal(res.status, 200);
            assert.isArray(res.redirects);
            assert.include(res.redirects.join(''), 'test');
            done();
          })
          .catch(function (error) {
            console.log(e)
          })
      })
    });

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
            threadId = res.body[0]._id;
            assert.isArray(res.body[0].replies);
            assert.equal(res.body[0].text, threadText);
            done();
          })
          .catch(function (error) {
            console.log(e)
          })
      })
    });

    suite('DELETE', function () {

    });

    suite('PUT', function () {

    });


  });

  suite('API ROUTING FOR /api/replies/:board', function () {

    suite('POST', function () {

    });

    suite('GET', function () {

    });

    suite('PUT', function () {

    });

    suite('DELETE', function () {

    });

  });

});
