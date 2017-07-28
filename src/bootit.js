#!/usr/bin/env node
'use strict';

import fs from 'fs';
import http from 'http';
import https from 'https';
import {default as createDebugger} from 'debug';

const debug = createDebugger('bootit:bootstrap');

/**
 *
 */
class Bootit {

  /**
   * Boostrap an application instance.
   *
   * @param {Application} application
   * @param {object} options
   * @returns {object}
   */
  static start(application, options) {
    options = options || {};

    let checkFileExists = function(filePath) {
      let stats = fs.lstatSync(filePath);
      return (stats && stats.isFile());
    }

    var server = null;
    let secure = ((options.key && checkFileExists(options.key)) || (options.certificate && checkFileExists(options.certificate)));

    if (secure) {
      if (options.key && !checkFileExists(options.key)) {
        throw new Error('{options.key} must be a valid path to a file containing your key');
      } else if (options.certificate && !checkFileExists(options.certificate)) {
        throw new Error('{options.certificate} must be a valid path to a file containing your certificate');
      }

      try {
        server = https.createServer({
          'key': fs.readFileSync(options.key),
          'cert': fs.readFileSync(options.certificate)
        }, application);
      } catch(error) {
        debug(error);
        debug('Unable to create a https connection.');
        process.exit(1);
      }
    } else {
      server = http.createServer(application);
    }

    // Attach socket.io instance
    if (options.io) {
      options.io.attach(server);
    }

    /**
     * EventHandler: listening
     **/
    server.on('listening', function() {
      let addr = server.address();
      let bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;

      server.bootstrapped = true;
      debug('Listening on ' + bind);
    });

    let port = application.get('port') || (secure ? 443 : 80);

    /**
     * EventHandler: error
     */
    server.on('error', function(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

      let bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    server.listen(port);
    return server;
  }

}

/**
 * Export the fully instantiated server.
 */
export default Bootit;
