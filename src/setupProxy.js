const proxy = require('http-proxy-middleware');
// eslint-disable-next-line func-names
module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'https://manhhoang-api.herokuapp.com',
      changeOrigin: true,
    }),
  );
};
