// Keys.js - figure out what set of credentials to return
if (process.env.NODE_ENV === 'production') {
  // in prod - return prod credential
  module.exports = require('./prod');
} else {
  // in dev - return dev credentials
  module.exports = require('./dev');
}
