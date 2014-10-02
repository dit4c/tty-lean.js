/* global describe: false, it: false */
var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require("sinon-chai"),
    expect = chai.expect;
chai.use(sinonChai);

describe("logger", function() {
  
  var newLogger = function() {
    var mockConsole = {
      log: sinon.spy(),
      error: sinon.spy()
    };
    return require('../lib/logger')(mockConsole)
  }
  
  it('is a function', function() {
    expect(newLogger()).to.be.a.function;
  });
  
  it('can take method to call as first argument', function() {
    var logger = newLogger();
    var spies = {
      log: sinon.spy(logger, 'log'),
      warning: sinon.spy(logger, 'warning'),
      error: sinon.spy(logger, 'error'),
    };
    logger('log', 'test');
    expect(spies.log).to.have.been.calledOnce;
    logger('warning', 'test');
    expect(spies.warning).to.have.been.calledOnce;
    logger('error', 'test');
    expect(spies.error).to.have.been.calledOnce;
  });
  
  it('logs objects properly', function() {
    var logger = newLogger(),
        testObj = { a: 1 };
    logger.isatty[1] = false; // Required for consistent call parameters
    logger('log', { a: 1 });
    expect(logger.console.log)
      .to.have.been.calledWith('['+logger.prefix+'] ', testObj);
  });

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