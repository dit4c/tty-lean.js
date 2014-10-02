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
    
      args[0] = '\x1b['
        + col
        + 'm['
        + logger.prefix
        + ']\x1b[m '
        + args[0];
      
      if ((level === 'log' && !logger.isatty[1])
          || (level === 'error' && !logger.isatty[2])) {
        args[0] = args[0].replace(/\x1b\[(?:\d+(?:;\d+)*)?m/g, '');
      }
    
      return consoleLike[level].apply(consoleLike, args);
    };
  }
  
  var logger = function() {
    return logger[arguments[0]].apply(logger, slice.call(arguments, 1));
  };

  // Standard Input, Standard output, standard error
  logger.isatty = [isatty(0), isatty(1), isatty(2)];
  
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
