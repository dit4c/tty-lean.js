/* global describe: false, it: false */
var expect = require('chai').expect,
    sinon = require('sinon');

describe("logger", function() {
  
  var newLogger = function() {
    var mockConsole = {
      log: sinon.spy(),
      error: sinon.spy()
    };
    return require('../lib/logger')(mockConsole)
  }
  

  describe('.log', function() {
    it('is a function', function() {
      expect(newLogger().log).to.be.a.function;
    });
    
    it('logs using console.log', function(done) {
      var logger = newLogger();
      var call;
      logger.log("test", "with", "multiple", "args");
      call = logger.console.log.lastCall;
      expect(call.args[0]).to.contain('['+logger.prefix+']');
      expect(call.args[0]).to.match(/test$/);
      expect(call.args[1]).to.equal("with");
      expect(call.args[2]).to.equal("multiple");
      expect(call.args[3]).to.equal("args");
      done();
    });
    
    it('uses color if stdout is a TTY', function(done) {
      var logger = newLogger();
      var call;
      // A TTY
      logger.isatty[1] = true;
      logger.log("test");
      call = logger.console.log.lastCall;
      expect(call.args[0])
        .to.equal('\u001b[34m['+logger.prefix+']\u001b[m test');
      done();
    });
    
    it('does not use color if stdout is not a TTY', function(done) {
      var logger = newLogger();
      var call;
      // Not a TTY
      logger.isatty[1] = false;
      logger.log("test");
      call = logger.console.log.lastCall;
      expect(call.args[0]).to.equal('['+logger.prefix+'] test');
      done();
    });
  });

  describe('.warning', function() {
    it('is a function', function() {
      expect(newLogger().warning).to.be.a.function;
    });
    
    it('logs using console.error', function(done) {
      var logger = newLogger();
      var call;
      logger.warning("test", "with", "multiple", "args");
      call = logger.console.error.lastCall;
      expect(call.args[0]).to.contain('['+logger.prefix+']');
      expect(call.args[0]).to.match(/test$/);
      expect(call.args[1]).to.equal("with");
      expect(call.args[2]).to.equal("multiple");
      expect(call.args[3]).to.equal("args");
      done();
    });
    
    it('uses color if stderr is a TTY', function(done) {
      var logger = newLogger();
      var call;
      // A TTY
      logger.isatty[2] = true;
      logger.warning("test");
      call = logger.console.error.lastCall;
      expect(call.args[0])
        .to.equal('\u001b[31m['+logger.prefix+']\u001b[m test');
      done();
    });
    
    it('does not use color if stderr is not a TTY', function(done) {
      var logger = newLogger();
      var call;
      // Not a TTY
      logger.isatty[2] = false;
      logger.warning("test");
      call = logger.console.error.lastCall;
      expect(call.args[0]).to.equal('['+logger.prefix+'] test');
      done();
    });
  });

  describe('.error', function() {
    it('is a function', function() {
      expect(newLogger().error).to.be.a.function;
    });
    
    it('logs using console.error', function(done) {
      var logger = newLogger();
      var call;
      logger.error("test", "with", "multiple", "args");
      call = logger.console.error.lastCall;
      expect(call.args[0]).to.contain('['+logger.prefix+']');
      expect(call.args[0]).to.match(/test$/);
      expect(call.args[1]).to.equal("with");
      expect(call.args[2]).to.equal("multiple");
      expect(call.args[3]).to.equal("args");
      done();
    });
    
    it('uses color if stderr is a TTY', function(done) {
      var logger = newLogger();
      var call;
      // A TTY
      logger.isatty[2] = true;
      logger.error("test");
      call = logger.console.error.lastCall;
      expect(call.args[0])
        .to.equal('\u001b[41m['+logger.prefix+']\u001b[m test');
      done();
    });
    
    it('does not use color if stderr is not a TTY', function(done) {
      var logger = newLogger();
      var call;
      // Not a TTY
      logger.isatty[2] = false;
      logger.error("test");
      call = logger.console.error.lastCall;
      expect(call.args[0]).to.equal('['+logger.prefix+'] test');
      done();
    });
  });
  
});