#!/usr/bin/env node

/**
 * tty-lean.js
 * Copyright (c) 2012-2014, Christopher Jeffrey (MIT License)
 * Copyright (c) 2014, The University of Melbourne
 */

process.title = 'tty-lean.js';

var tty = require('../');

var conf = tty.config.readConfig()
  , app = tty.createServer(conf);

app.listen();
