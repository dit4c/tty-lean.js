/* global describe: false, it: false, before: false, after: false */
var expect = require('chai').expect,
    server = require('../lib/tty-lean'),
    request = require('supertest'),
    phantom = require('phantom');

describe("client", function() {
  var config = {
        log: true,
        shell: "sh"
      },
      testServer = server(config),
      app = testServer.server;
  var port;
  
  before(function() {
    app.listen(50000);
  })    
  
  after(function(done) {
    app.on('close', done);
    app.close();
  });
  
  
  // This probably doesn't work because of:
  // http://stackoverflow.com/questions/25613551/socketio-phantomjs-emit-not-working
  it('serves the HTML UI', function(done) {
    var url = 'http://localhost:'+app.address().port+'/';
    phantom.create(function (ph) {
      ph.createPage(function (page) {
        
        function waitFor(testFunc, execFunc) {
          setTimeout(function() {
            testFunc(function(result) {
              if (result) {
                execFunc();
              } else {
                waitFor(testFunc, execFunc);
              }
            });
          }, 100);
        }
        
        function consoleTest() {
          page.evaluate(function () {
            // Click the tilde
            var el = document.querySelector('[class="tab"][title^="new"]');
            var point = (function() {
              var rect = el.getBoundingClientRect()
              return {
                x: rect.left + rect.width/2,
                y: rect.top + rect.height/2
              };
            }());
            (function() {
              var evObj = document.createEvent('Events');
              evObj.initEvent('click', true, false);
              el.dispatchEvent(evObj);
            }());
            return {
              point: point,
              href: window.location.href
            };
          }, function (data) {
            // Check URL contains a random ID
            expect(data.href).to.contain(url);
            expect(data.href).to.match(/\#[a-z0-9]+$/);
            waitFor(function(cb) {
              // Look for shell prompt
              page.get('plainText', function(text) {
                cb(text.indexOf('$') !== -1);
              });
            }, function() {
              // Check session is open
              var sessionId, session;
              try {
                expect(Object.keys(testServer.sessions).length).to.equal(1);
                sessionId = Object.keys(testServer.sessions)[0];
                session = testServer.sessions[sessionId];
                expect(Object.keys(session.terms).length).to.equal(1);
              } catch(e) {
                page.close();
                ph.exit();
                done(e);
              }
              // Take screenshot
              page.render("screenshots/uname-00.png");
              // Type command, taking screenshots between keys
              'uname\n'.split('').forEach(function(char, i) {
                page.sendEvent('keypress', char);
                page.render("screenshots/uname-0"+i+".png");
              });
              page.get('plainText', function() {});
              setTimeout(function() {
                page.render("screenshots/uname-99.png");
                page.get('plainText', function(text) {
                  expect(text).to.match(/\$\s+uname/m);
                  expect(text).to.match(/Linux/m);
                  page.close();
                  ph.exit();
                  done();
                });
              }, 1000);
            });
          });
        }
        
        page.onConsoleMessage(function(msg) {
          console.log('CONSOLE: ' + msg);
        });
        page.set('onError', function (msg, trace) {
          console.log(msg, trace);
        });
        
        page.set('viewportSize', { width: 800, height: 600 });
        
        page.set('onLoadStarted', function () {
          function waitForLoad(callback) {
            waitFor(function(cb) {
              page.evaluate(function() {
                return window.tty.socket && window.tty.socket.connected;
              }, cb);
            }, callback);
          }
          // We use this rather than onLoadFinished, because onLoadFinished
          // doesn't trigger when using XHR polling.
          waitForLoad(consoleTest);
        });
        
        page.open(url);
      });
    });
    
  });
  
  
});