# tty-lean.js

[![Build Status](https://img.shields.io/travis/dit4c/tty-lean.js.svg?style=flat)](https://travis-ci.org/dit4c/tty-lean.js)
[![Coverage Status](https://img.shields.io/coveralls/dit4c/tty-lean.js.svg?style=flat)](https://coveralls.io/r/dit4c/tty-lean.js)

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

### 256 colors

If tty-lean.js fails to check your terminfo properly, you can force your `TERM`
to `xterm-256color` by setting `"termName": "xterm-256color"` in your config.

## Security

Unlike [tty.js][tty.js], _tty-lean.js_ doesn't handle authorization internally.

Typical deployment options:
 * HTTP Basic authentication using a reverse proxy (like Nginx).
   * Chrome [has issues with Websockets & basic auth][chromium-123862].
 * Cookie-based auth using a reverse proxy.
   * Nginx's [ngx_http_auth_request_module][ngx_http_auth_request_module] makes
     using an external authentication system fairly easy.
   * OpenResty has [EncryptedSessionNginxModule][EncryptedSessionNginxModule].
 * Stand-alone using [SSL Client Authentication][ssl-client-auth] via `https`
   configuration options.

## CLI

- `tty-lean.js --port 3000` - start and bind to port 3000.
- `tty-lean.js --socket tty-lean.sock` - start and bind to Unix socket.
- `tty-lean.js --config ~/my-config.json` - specify config file.

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work. `</legalese>`

## License

MIT. See COPYING for details.

[tty.js]: https://github.com/chjj/tty.js/
[1]: http://invisible-island.net/xterm/ctlseqs/ctlseqs.html#Mouse%20Tracking
[chromium-123862]: https://code.google.com/p/chromium/issues/detail?id=123862
[ngx_http_auth_request_module]: http://nginx.org/en/docs/http/ngx_http_auth_request_module.html
[EncryptedSessionNginxModule]: http://openresty.org/#EncryptedSessionNginxModule
[ssl-client-auth]: http://nategood.com/nodejs-ssl-client-cert-auth-api-rest
