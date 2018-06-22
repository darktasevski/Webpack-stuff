import express from 'express';
const webpack = require('webpack');

const config = require('../../config/webpack.dev');

const server = express();
const compiler = webpack(config);

const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, config.devServer);
const webpackHotMiddleware = require('webpack-hot-middleware')(compiler);

server.use(webpackDevMiddleware);
server.use(webpackHotMiddleware);

const expressStaticGzip = require('express-static-gzip');
server.use(
	'/',
	expressStaticGzip('dist', {
		enableBrotli: true,
	})
);

// const staticMiddleware = express.static('dist');
// server.use(staticMiddleware);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
	console.log(`Server has started on port ${PORT}`);
});
