# Bootit

A bootstrap module which will start a HTTP(s) server for an express application

---

## Introduction

The package exports methods that can be used to quickly bootstrap a HTTP or HTTPS server for express applications.

## Basic usage

Respondent requires 1 parameter. The path to the root directory of your configuration files.

```JavaScript
const App = require('./app');
const Bootit = require('bootit');

let server = Bootit.start(app);
```

The `start` method takes 2 parameters. The first parameter is the express application instance, the second are some options that you may wish to pass.

#### options

`options.key` - Path to the file containing your SSL/TLS key

`options.certificate` - Path to the file containing your SSL/TLS certificate

`options.io` - Socket.io instance to attach to the server

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

Bootit makes use of [mocha]() and [chai]() in order to conduct it's unit tests, thus contributions
should be made with unit tests relevant to your work.

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
