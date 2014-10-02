/* global describe: false, it: false */
var expect = require('chai').expect,
    logger = require('../lib/logger');

describe("logger", function() {

  describe('.log', function() {
    it('is a function', function() {
      expect(logger.log).to.be.a.function;
    });
  });

  describe('.warning', function() {
    it('is a function', function() {
      expect(logger.log).to.be.a.function;
    });
  });

  describe('.error', function() {
    it('is a function', function() {
      expect(logger.log).to.be.a.function;
    });
  });

});