#!/usr/bin/env node
'use strict';

import fs from 'fs';
import http from 'http';
import https from 'https';
import {default as redirectHttps} from 'redirect-https';
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
  static start(application, {
    key,
    certificate,
    greenlock,
    io,
    insecurePort,
    redirectToHttps,
    redirectResponseBody,
    redirectTrustProxy
  } = {}) {
    
    insecurePort = insecurePort || 80;

    let checkFileExists = function(filePath) {
      let stats = fs.lstatSync(filePath);
      return (stats && stats.isFile());
    }

    var server = null;
    let secure = ((key && checkFileExists(key)) || (certificate && checkFileExists(certificate)) || (greenlock && true));

    if (secure) {
      if (!greenlock) {
        if (key && !checkFileExists(key)) {
          throw new Error('{options.key} must be a valid path to a file containing your key');
        } else if (certificate && !checkFileExists(certificate)) {
          throw new Error('{options.certificate} must be a valid path to a file containing your certificate');
        }
      }

      try {
        let serverOptions = null;

        if (greenlock) {
          serverOptions = greenlock.tlsOptions;
        } else {
          serverOptions = {
            'key': fs.readFileSync(key),
            'cert': fs.readFileSync(certificate)
          };
        }

        server = https.createServer(serverOptions, application);
      } catch(error) {
        debug(error);
        debug('Unable to create a https connection.');
        process.exit(1);
      }
    } else {
      server = http.createServer(application);
    }

    // Attach socket.io instance
    if (io) {
      io.attach(server);
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

    let port = application.get('port') || (secure ? 443 : insecurePort);

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

    /**
     * Redirect to HTTPS
     */
    if (secure && redirectToHttps) {
      let redirServer = null;
      let redir = redirectHttps({ port, trustProxy: redirectTrustProxy, body: redirectResponseBody });

      if (greenlock) {
        redirServer = http.createServer(greenlock.middleware(redir));
      } else {
        redirServer = http.createServer();
      }

      redirServer.listen(insecurePort);
    }

    /*
     * Setup the server and listen on the specified port
     */
    server.listen(port);

    // Return the server instance
    return server;
  }

}

/**
 * Export the fully instantiated server.
 */
export default Bootit;
