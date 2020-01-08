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

    suite('POST', function () {

      test('Test POST /api/threads/board', function (done) {
        chai.request(server)
          .post('/api/threads/test')
          .send({
            delete_password: 'pass123',
            text: 'A test thread'
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
