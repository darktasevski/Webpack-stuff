import express from 'express';
import path from 'path';
const webpack = require('webpack');

const config = require('../../config/webpack.dev');

const server = express();
const compiler = webpack(config);

const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, config.devServer);
const webpackHotMiddleware = require('webpack-hot-middleware')(compiler);
const staticMiddleware = express.static('dist');

server.use(webpackDevMiddleware);
server.use(webpackHotMiddleware);
server.use(staticMiddleware);

server.listen(8080, () => {
	console.log('Server has started');
});
