const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {

    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:4000/api',
            changeOrigin: true
        }));
    app.listen(3000);
}