# Bootit

A bootstrap module which will start a HTTP(s) server for an express application

---

## Introduction

The package exports methods that can be used to quickly bootstrap a HTTP or HTTPS server for express applications.

## Basic usage

```JavaScript
const App = require('./app');
const Bootit = require('bootit');

let server = Bootit.start(app);
```

The `start` method takes 2 parameters. The first parameter is the express application instance, the second are some options that you may wish to pass.

#### options

`options.greenlock` - If you're using greenlock, you may pass through it's instance here. Please see the greenlock documentation [here][1].

`options.key` - Path to the file containing your SSL/TLS key

`options.certificate` - Path to the file containing your SSL/TLS certificate

`options.io` - Socket.io instance to attach to the server

`options.redirectToHttps` - If you've decided to enable HTTPS through the use of greenlock or by specifying a key and certificate, you may spin up a server to redirect `non-https` requests to the `https` server.

`options.insecurePort` - If you've enabled the `redirectToHttps` option, then you may specify what port that this redirect server listens on, by default it is set to port `80`.

`options.redirectResponseBody` - This is a HTML string that will be displayed to `non-http` requests that do not get redirected.

`options.redirectTrustProxy` - You can enable reverse proxy support on the redirect server using this option.

#### example usage

```JavaScript
const Path = require('path');
const App = require('./app');
const Bootit = require('bootit');

let server = Bootit.start(app, {
  key: Path.join(__dirname, 'key.pem'),
  certificate: Path.join(__dirname, 'certificate.pem')
});
```

## Contributing

Bootit makes use of [mocha][2] and [chai](3) in order to conduct it's unit tests, thus contributions
should be submitted with unit tests relevant to your work.

## License

Copyright (c) 2017 Kieron Wiltshire

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[1]: https://www.npmjs.com/package/greenlock
[2]: https://www.npmjs.com/package/mocha
[3]: https://www.npmjs.com/package/chai
