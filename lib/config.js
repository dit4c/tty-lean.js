/**
 * tty-lean.js: config.js
 * Copyright (c) 2012-2014, Christopher Jeffrey (MIT License)
 * Copyright (c) 2014, The University of Melbourne
 */

var path = require('path')
  , fs = require('fs')
  , logger = require('./logger')(console)
  , _ = require('lodash')
  , exists = fs.existsSync;

/**
 * Options
 */

var options;

/**
 * Read Config
 */

function readConfig(file) {
  var home = process.env.HOME
    , conf = {}
    , dir
    , json;

  if (file || options.config) {
    file = path.resolve(process.cwd(), file || options.config);
    dir = path.dirname(file);
    json = options.config;
  } else {
    dir = process.env.TTYJS_PATH || path.join(home, '.tty-lean.js');
    json = path.join(dir, 'config.json');
  }

  if (exists(dir) && exists(json)) {
    if (!fs.statSync(dir).isDirectory()) {
      json = dir;
      dir = home;
    }

    conf = JSON.parse(fs.readFileSync(json, 'utf8'));
  } else {
    if (!exists(dir)) {
      fs.mkdirSync(dir, 0700);
    }

    fs.writeFileSync(json, JSON.stringify(conf, null, 2));
    fs.chmodSync(json, 0600);
  }

  // expose paths
  conf.dir = dir;
  conf.json = json;

  // flag
  conf.__read = true;

  return checkConfig(conf);
}

function checkConfig(conf) {
  if (typeof conf === 'string') {
    return readConfig(conf);
  }

  conf = _.clone(conf || {});

  if (conf.config) {
    var file = conf.config;
    delete conf.config;
    _.merge(conf, readConfig(file));
  }

  // flag
  if (conf.__check) return conf;
  conf.__check = true;

  // merge options
  _.merge(conf, options.conf);

  // directory and config file
  conf.dir = conf.dir || '';
  conf.json = conf.json || '';

  // https
  conf.https = conf.https || conf.ssl || conf.tls || {};
  conf.https = !conf.https.disabled && {
    key: tryRead(conf.dir, conf.https.key || 'server.key') || conf.https.key,
    cert: tryRead(conf.dir, conf.https.cert || 'server.crt') || conf.https.cert
  };

  // port
  conf.port = conf.port || 8080;

  // hostname
  conf.hostname; // '0.0.0.0'

  // shell, process name
  if (conf.shell && ~conf.shell.indexOf('/')) {
    conf.shell = path.resolve(conf.dir, conf.shell);
  }
  conf.shell = conf.shell || process.env.SHELL || 'sh';

  // arguments to shell, if they exist
  conf.shellArgs = conf.shellArgs || [];

  // static directory
  conf.static = tryResolve(conf.dir, conf.static || 'static');

  // limits
  conf.limitPerUser = conf.limitPerUser || Infinity;
  conf.limitGlobal = conf.limitGlobal || Infinity;

  // local
  conf.localOnly = !!conf.localOnly;

  // sync session
  conf.syncSession; // false

  // session timeout
  if (typeof conf.sessionTimeout !== 'number') {
    conf.sessionTimeout = 10 * 60 * 1000;
  }

  // log
  conf.log; // true

  // cwd
  if (conf.cwd) {
    conf.cwd = path.resolve(conf.dir, conf.cwd);
  }

  // socket.io
  conf.io; // null

  // term
  conf.term = conf.term || {};

  conf.termName = conf.termName || conf.term.termName || terminfo();
  conf.term.termName = conf.termName;

  conf.term.termName; // 'xterm'
  conf.term.geometry; // [80, 24]
  conf.term.visualBell; // false
  conf.term.popOnBell; // false
  conf.term.cursorBlink; // true
  conf.term.scrollback; // 1000
  conf.term.screenKeys; // false
  conf.term.colors; // []
  conf.term.programFeatures; // false

  conf.debug = conf.debug || conf.term.debug || false;
  conf.term.debug = conf.debug; // false

  // check legacy features
  checkLegacy(conf);

  return conf;
}

/**
 * Check Legacy
 */

function checkLegacy(conf) {
  var out = [];

  if (conf.auth) {
    logger.error('`auth` is deprecated, please use `users` instead.');
  }

  if (conf.userScript) {
    out.push(''
      + '`userScript` is deprecated, please place '
      + '`user.js` in `~/.tty-lean.js/static/user.js` instead.');
  }

  if (conf.userStylesheet) {
    out.push(''
      + '`userStylesheet` is deprecated, please '
      + 'place `user.js` in `~/.tty-lean.js/static/user.js` instead.');
  }

  if (conf.stylesheet) {
    out.push(''
      + '`stylesheet` is deprecated, please place '
      + '`user.css` in `~/.tty-lean.js/static/user.css` instead.');
  }

  if (conf.hooks) {
    out.push(''
      + '`hooks` is deprecated, please programmatically '
      + 'hook into your tty-lean.js server instead.');
  }

  if (out.length) {
    out.forEach(function(out) {
      logger.error(out);
    });
    logger.error('Exiting.');
    process.exit(1);
  }
}

/**
 * Terminfo
 */

function terminfo() {
  // tput -Txterm-256color longname
  var terminfoFile = exists('/usr/share/terminfo/x/xterm+256color')
                  || exists('/usr/share/terminfo/x/xterm-256color');

  // Default $TERM
  var TERM = terminfoFile
    ? 'xterm-256color'
    : 'xterm';

  return TERM;
}

/**
 * Parse Arguments
 */

function parseArg() {
  var opt = { conf: {} },
      nom = require("nomnom")
        .script('tty-lean.js')
        .option('port', {
          abbr: 'p',
          default: 8080,
          help: 'Port to listen on'
        })
        .option('socket', {
          help: 'Unix socket to listen on'
        })
        .option('config', {
          abbr: 'c',
          help: 'Configuration file to use'
        })
        .parse();

  if (nom.port) {
    opt.conf.port = nom.port;
  }
  
  if (nom.socket) {
    opt.conf.socket = nom.socket;
  }

  if (nom.config) {
    opt.config = nom.config;
  }

  return opt;
}

options = exports.options = parseArg();

/**
 * Xresources
 */

function parseResources(text) {
  var colors = []
    , defs = {}
    , def
    , color;

  def = /#\s*define\s+((?:[^\s]|\\\s)+)\s+((?:[^\n]|\\\n)+)/g;
  text = text.replace(def, function(__, name, val) {
    name = name.replace(/\\\s/g, '');
    defs[name] = val.replace(/\\\n/g, '');
    return '';
  });

  text = text.replace(/[^\s]+/g, function(name) {
    return defs[name] || name;
  });

  color = /(?:^|\n)[^\s]*(?:\*|\.)color(\d+):([^\n]+)/g;
  text.replace(color, function(__, no, color) {
    if (!colors[no]) colors[no] = color.trim();
  });

  return colors;
}

function readResources() {
  var text = tryRead(process.env.HOME, '.Xresources');
  return text ? parseResources(text) : [];
}

/**
 * Helpers
 */

function tryRequire() {
  try {
    return require(path.resolve.apply(path, arguments));
  } catch (e) {}
}

function tryResolve() {
  var file = path.resolve.apply(path, arguments);
  if (exists(file)) return file;
}

function tryRead() {
  try {
    var file = path.resolve.apply(path, arguments);
    return fs.readFileSync(file, 'utf8');
  } catch (e) {}
}

/**
 * Expose
 */

exports.readConfig = readConfig;
exports.checkConfig = checkConfig;
exports.xresources = readResources();

exports.helpers = {
  parseResources: parseResources,
  tryRequire: tryRequire,
  tryResolve: tryResolve,
  tryRead: tryRead
};

_.merge(exports, exports.helpers);
