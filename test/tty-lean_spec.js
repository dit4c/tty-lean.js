/* global describe: false, it: false */
var expect = require('chai').expect,
    server = require('../lib/tty-lean'),
    request = require('supertest');

describe("tty-lean", function() {
  var config = {
        localOnly: true,
        log: false,
        shell: "sh"
      },
      app = server(config).server;
  
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
    it('serves Socket.IO websocket endpoint', function(done) {
      app.listen(0, function() {
        var port = app.address().port,
            socket = require('socket.io-client')('ws://localhost:'+port);
        var ttyId;
        socket.on('connect', function() {
          socket.emit('start', 'd34db33f');
          socket.emit('create', 80, 25, function(err, data) {
            ttyId = data.id;
          });
        });
        socket.once('data', function(id, data) {
          expect(ttyId).to.equal(id);
          // Check we get a shell
          expect(data).to.match(/\$ $/m);
          // When this shell closes, disconnect
          socket.on('kill', function() {
            socket.close();
          });
          // Close the shell by entering "exit"
          socket.emit('data', id, 'exit\r');
        });
        socket.on('disconnect', function() {
          app.on('close', done);
          app.close();
        });
      });
    });
  });
  
});