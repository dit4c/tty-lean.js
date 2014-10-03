/* global describe: false, it: false, before: false, after: false */
var expect = require('chai').expect,
    server = require('../lib/tty-lean'),
    request = require('supertest'),
    phantom = require('phantom');

describe("client", function() {
  var config = {
        localOnly: true,
        log: true,
        shell: "sh"
      },
      testServer = server(config),
      app = testServer.server;
  var port;
  
  before(function() {
    app.listen(0);
  })    
  
  after(function(done) {
    app.on('close', done);
    app.close();
  });
  
  it('serves the HTML UI', function(done) {
    var url = 'http://localhost:'+app.address().port+'/';
    phantom.create(function (ph) {
      ph.createPage(function (page) {
        page.onConsoleMessage(function(msg) {
          console.log('CONSOLE: ' + msg);
        });
        page.set('viewportSize', { width: 800, height: 600 });
        page.open(url, function (status) {
          expect(status).to.equal('success');
          console.log(testServer.sessions);
          page.render("test1.png");
          page.evaluate(function() { console.log('test'); });
          // Check that a hash exists
          page.evaluate(function () {
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
            try {
              console.log(data);
              expect(data.href).to.contain(url);
              expect(data.href).to.match(/\#[a-z0-9]+$/);
              setTimeout(function() {
                page.render("test2.png");
                console.log(testServer.sessions);
                ph.exit();
                done();
              }, 1000);
            } catch(e) {
              done(e);
            } finally {
            }
          });
        });
      });
    });
    
  });
  
  
});