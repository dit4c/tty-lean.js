/**
 * tty-lean.js: logger.js
 * Copyright (c) 2012-2014, Christopher Jeffrey (MIT License)
 * Copyright (c) 2014, The University of Melbourne
 */

var slice = Array.prototype.slice
  , isatty = require('tty').isatty;

/**
 * Logger
 */

function constructor(consoleLike) {

  function loggingF(col, level) {
    return function() {
      var args = slice.call(arguments);
      
      if (typeof(args[0]) !== 'string') {
        args.unshift('');
      }
    
      if (logger.isatty[level]) {
        // Use color to indicate log level
        args[0] = '\x1b['
          + col
          + 'm['
          + logger.prefix
          + ']\x1b[m '
          + args[0];
      } else {
        // Omit color and log levels
        args[0] = '[' + logger.prefix + '] ' + args[0];
      }
    
      return consoleLike[level].apply(consoleLike, args);
    };
  }
  
  var logger = function() {
    return logger[arguments[0]].apply(logger, slice.call(arguments, 1));
  };

  // See http://en.wikipedia.org/wiki/File_descriptor for more info.
  // console.log   writes to STDOUT (fd 1)
  // console.error writes to STDERR (fd 2)
  logger.isatty = {
    log: isatty(1),
    error: isatty(2)
  };
  
  logger.prefix = 'tty-lean.js';
  
  logger.log = loggingF(34, 'log');
  logger.warning = loggingF(31, 'error');
  logger.error = loggingF(41, 'error');
  
  logger.console = consoleLike;
  
  return logger;
}

/**
 * Expose
 */

module.exports = constructor;
