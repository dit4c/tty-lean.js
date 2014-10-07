/* global describe: false, it: false, before: false, after: false */
var expect    = require('chai').expect,
    server    = require('../lib/tty-lean'),
    Q         = require('q'),
    istanbul  = require('istanbul'),
    phantom   = require('phantom');

describe("client", function() {
  var config = {
        log: true,
        shell: "sh",
        static: "coverage/client/static"
      },
      testServer = server(config),
      app = testServer.server;
  var port;
  
  // Helper which allows page evals to be performed in a promise chain.
  function evalInPage(page) {
    return function(f) {
      return function() {
        var d = Q.defer();
        page.evaluate(f, d.resolve);
        return d.promise;
      };
    };
  }
  
  
  before(function() {
    app.listen(0);
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
        
        function waitFor(testFunc) {
          var d = Q.defer();
          
          setTimeout(function() {
            testFunc(function(result) {
              if (result) {
                d.resolve();
              } else {
                waitFor(testFunc).done(d.resolve);
              }
            });
          }, 100);
          
          return d.promise;
        }
        
        function consoleTest() {
          Q()
            .then(evalInPage(page)(function() {
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
            }))
            .then(function (data) {
              // Check URL contains a random ID
              expect(data.href).to.contain(url);
              expect(data.href).to.match(/\#[a-z0-9]+$/);
              return waitFor(function(cb) {
                // Look for shell prompt
                page.get('plainText', function(text) {
                  cb(text.indexOf('$') !== -1);
                });
              });
            })
            .then(function() {
              // Check session is open
              var sessionId, session;
              expect(Object.keys(testServer.sessions).length).to.equal(1);
              sessionId = Object.keys(testServer.sessions)[0];
              session = testServer.sessions[sessionId];
              expect(Object.keys(session.terms).length).to.equal(1);
              // Take screenshot
              page.render("screenshots/uname-00.png");
              // Type command, taking screenshots between keys
              'uname\n'.split('').forEach(function(char, i) {
                page.sendEvent('keypress', char);
                page.render("screenshots/uname-0"+i+".png");
              });
              return;
            })
            // Wait for the command to return
            .delay(1000)
            // Check the command ran as expected
            .then(function() {
              var d = Q.defer();
              page.render("screenshots/uname-99.png");
              page.get('plainText', function(text) {
                expect(text).to.match(/\$\s+uname/m);
                expect(text).to.match(/Linux/m);
                d.resolve();
              });
              return d.promise;
            })
            // Get coverage information from testing
            .then(evalInPage(page)(function() {
              return window.__coverage__;
            }))
            // Write coverage information from test
            .then(function(coverage) {
              var d = Q.defer();
              var reporter = new istanbul.Reporter(null, 'coverage/client'),
                  collector = new istanbul.Collector();
              collector.add(coverage);
              reporter.add('lcovonly');
              reporter.write(collector, true, d.resolve);
              return d.promise;
            })
            // Finish up with PhantomJS
            .finally(function() {
              page.close();
              ph.exit();
            })
            // Complete the test
            .done(done, done);
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
            }).then(callback);
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