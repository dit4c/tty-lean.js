/* global describe: false, it: false */
var expect = require('chai').expect,
    config = require('../lib/config'),
    path = require('path'),
    fs = require('fs');

describe("config", function() {

  describe('.helper', function() {
    describe('.tryRead()', function() {
      it('can resolve and read files', function(done) {
        var thisFile = __filename.split('/').slice(-1)[0];
        // We now read this file, and look this: "123 FOOBAR 456"
        var contents = config.tryRead(__dirname, thisFile);
        expect(contents).to.match(/\"\d{3} FOOBAR \d{3}\"/);
        done();
      });
    });
    
    describe('.parseResources', function() {
      it('can parse an Xresources file', function(done) {
        var fixtureFile = path.resolve(__dirname, 'fixtures/Xresources');
        fs.readFile(fixtureFile, 'utf8', function(err, text) {
          expect(config.helpers.parseResources(text)).to.deep.equal([ 
            '#000000',
            '#ff6565',
            '#93d44f',
            '#eab93d',
            '#204a87',
            '#ce5c00',
            '#89b6e2',
            '#cccccc',
            '#555753',
            '#ff8d8d',
            '#c8e7a8',
            '#ffc123',
            '#3465a4',
            '#f57900',
            '#46a4ff',
            '#ffffff'
          ]);
          done();
        });
      });
    });
  });

  describe('.checkConfig()', function() {
    it('populates sensible defaults', function(done) {
      var c = config.checkConfig({});
      expect(c.debug).to.be.false;
      expect(c.dir).to.equal('');
      expect(c.https).to.be.a('object');
      expect(c.https.key).to.be.undefined;
      expect(c.https.cert).to.be.undefined;
      expect(c.limitGlobal).to.equal(Infinity);
      expect(c.limitPerUser).to.equal(Infinity);
      expect(c.localOnly).to.be.false;
      expect(c.port).to.be.greaterThan(0).and.lessThan(Math.pow(2,16));
      expect(c.sessionTimeout).to.be.greaterThan(0);
      expect(c.shell).to.equal(process.env.SHELL);
      expect(c.shellArgs).to.deep.equal([]);
      expect(c.term).to.be.a('object');
      expect(c.termName).to.match(/^xterm/);
      expect(c.termName).to.equal(c.term.termName);
      done();
    });
  });

  describe('.xresources', function() {
    it('can parse an Xresources file', function(done) {
      expect(config.xresources).to.be.a('array');
      done();
    });
  });

});