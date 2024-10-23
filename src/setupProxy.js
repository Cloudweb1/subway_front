const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {

    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://13.209.3.239:4000/api',
            // target: 'http://127.0.0.1:4000/api',
            // target: `http://${window.location.hostname}:4000/api`,
            changeOrigin: true
        }));
    app.listen(5000);
}