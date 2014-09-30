/* global describe: false, it: false */
var server = require('../lib/tty-lean'),
    request = require('supertest');

describe("tty-lean", function() {
  var app = server({ log: false }).server;
  
  describe('/', function() {
    it('serves the HTML UI', function(done) {
      request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=UTF-8')
        .expect(200, done);
    });
  });
  
  describe('/favicon.ico', function() {
    it('serves an icon', function(done) {
      request(app)
        .get('/favicon.ico')
        .expect('Content-Type', 'image/x-icon')
        .expect(200, done);
    });
  });
  
  describe('/socket.io', function() {
    it('serves the HTML UI', function(done) {
      request(app)
        .get('/socket.io/?EIO=3&transport=polling&t=1412042433684-0')
        .expect(200, done);
    });
  });
  
});