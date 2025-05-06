const net = require('net');

/**
 * Find a free port starting from the provided port
 * @param {number} startingPort - Port to start searching from
 * @param {Function} callback - Callback function(err, port)
 */
function findFreePort(startingPort, callback) {
  const server = net.createServer();
  
  function tryPort(port) {
    server.once('error', error => {
      if (error.code === 'EADDRINUSE') {
        // Port is in use, try the next one
        tryPort(port + 1);
      } else {
        // Other error occurred
        server.close();
        callback(error);
      }
    });
    
    server.once('listening', () => {
      // Found a free port
      const foundPort = server.address().port;
      server.close();
      callback(null, foundPort);
    });
    
    server.listen(port, '0.0.0.0');
  }
  
  tryPort(startingPort);
}

module.exports = findFreePort;
