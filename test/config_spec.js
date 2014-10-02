/* global describe: false, it: false */
var expect = require('chai').expect,
    config = require('../lib/config');

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
    it.skip('can parse an Xresources file', function(done) {
      expect(config.xresources).to.be.a('array');
      done();
    });
  });

});