const proxy = require('express-http-proxy');

module.exports = (app) => {
  app.use('/api/proxy', proxy('https://economia.awesomeapi.com.br'));
};
