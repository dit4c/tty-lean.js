/* global describe: false, it: false */
var expect = require('chai').expect,
    server = require('../lib/tty-lean'),
    request = require('supertest');

describe("tty-lean", function() {
  var config = {
        localOnly: true,
        log: false,
        shell: "sh"
      };
  
  describe('/', function() {
    it('serves the HTML UI', function(done) {
      var app = server(config).server;
      request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=UTF-8')
        .expect(200, done);
    });
  });
  
  describe('/favicon.ico', function() {
    it('serves an icon', function(done) {
      var app = server(config).server;
      request(app)
        .get('/favicon.ico')
        .expect('Content-Type', 'image/x-icon')
        .expect(200, done);
    });
  });
  
  describe('/socket.io', function() {
    
    function runSocketTest(app, opts, done) {
      app.listen(0, function() {
        var port = app.address().port,
            socket = require('socket.io-client')('ws://localhost:'+port, opts),
            ttyText = '';
        var ttyId;
        socket.on('connect', function() {
          socket.emit('start', 'd34db33f');
          socket.emit('create', 80, 25, function(err, data) {
            ttyId = data.id;
          });
        });
        socket.on('data', function(id, data) {
          // Check TTY is the one expected
          expect(ttyId).to.equal(id);
          ttyText += data;
          // Check we got a shell
          if (/\$ $/m.test(ttyText)) {
            // When this shell closes, disconnect
            socket.on('kill', function() {
              socket.close();
            });
            // Close the shell by entering "exit"
            socket.emit('data', ttyId, 'exit\r');
          }
        });
        socket.on('disconnect', function() {
          app.on('close', done);
          app.close();
        });
      });
    }
    
    describe('Socket.IO websocket endpoint', function() {
      it('works when restricted to websockets', function(done) {
        runSocketTest(server(config).server, {
          transports: ['websocket']
        }, done);
      });
      
      it('works when restricted to polling', function(done) {
        runSocketTest(server(config).server, {
          transports: ['polling']
        }, done);
      });
    });
    
  });
  
});