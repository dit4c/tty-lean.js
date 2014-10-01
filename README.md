# tty-lean.js

[![Build Status](https://travis-ci.org/dit4c/tty-lean.js.svg?branch=master)](https://travis-ci.org/dit4c/tty-lean.js)

_tty-lean.js_ is a fork of Christopher Jeffrey's [tty.js][tty.js], aimed at
reducing the feature set to produce a more robust terminal.

[tty.js][tty.js] is great, but sometimes you just need a terminal that works
behind a reverse-proxy over dodgy wifi.

## Features

- Tabs for your maximized Terminal window
- Screen/Tmux-like keys (optional)
- Ability to efficiently render programs: vim, mc, irssi, vifm, etc.
- Support for xterm mouse events
- 256 color support
- Persistent sessions

## Install

``` bash
$ npm install tty-lean.js
```

## Configuration

Configuration is stored in `~/.tty-lean.js/config.json` or `~/.tty-lean.js` as a single JSON file. An example configuration file looks like:

``` json
{
  "users": {
    "hello": "world"
  },
  "https": {
    "key": "./server.key",
    "cert": "./server.crt"
  },
  "port": 8080,
  "hostname": "127.0.0.1",
  "shell": "sh",
  "shellArgs": ["arg1", "arg2"],
  "static": "./static",
  "limitGlobal": 10000,
  "limitPerUser": 1000,
  "localOnly": false,
  "cwd": ".",
  "syncSession": false,
  "sessionTimeout": 600000,
  "log": true,
  "io": { "log": false },
  "debug": false,
  "term": {
    "termName": "xterm",
    "geometry": [80, 24],
    "scrollback": 1000,
    "visualBell": false,
    "popOnBell": false,
    "cursorBlink": false,
    "screenKeys": false,
    "colors": [
      "#2e3436",
      "#cc0000",
      "#4e9a06",
      "#c4a000",
      "#3465a4",
      "#75507b",
      "#06989a",
      "#d3d7cf",
      "#555753",
      "#ef2929",
      "#8ae234",
      "#fce94f",
      "#729fcf",
      "#ad7fa8",
      "#34e2e2",
      "#eeeeec"
    ]
  }
}
```

Usernames and passwords can be plaintext or sha1 hashes.

### 256 colors

If tty-lean.js fails to check your terminfo properly, you can force your `TERM`
to `xterm-256color` by setting `"termName": "xterm-256color"` in your config.

## Security

tty-lean.js currently has https as an option as heritage from tty.js. That's likely to change. Reverse proxies work with websockets these days, so there's no real need.

## CLI

- `tty-lean.js --port 3000` - start and bind to port 3000.
- `tty-lean.js --daemonize` - daemonize process.
- `tty-lean.js --config ~/my-config.json` - specify config file.

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work. `</legalese>`

## License

MIT. See COPYING for details.

[tty.js]: https://github.com/chjj/tty.js/
[1]: http://invisible-island.net/xterm/ctlseqs/ctlseqs.html#Mouse%20Tracking
