import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
const server = express();
import AppRoot from '../components/AppRoot';

const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
	const webpack = require('webpack');
	const config = require('../../config/webpack.dev.js');
	const compiler = webpack(config);
	require('webpack-mild-compile')(compiler);

	const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, config.devServer);

	const webpackHotMiddlware = require('webpack-hot-middleware')(compiler, config.devServer);

	server.use(webpackDevMiddleware);
	server.use(webpackHotMiddlware);
}

const expressStaticGzip = require('express-static-gzip');
server.use(
	expressStaticGzip('dist', {
		enableBrotli: true,
	})
);

server.get('*', (req, res) => {
	// const html = ReactDOMServer.renderToString(<div>Hello from SSR!</div>);
	res.send(`
	<html>
		<head>
			<link rel="stylesheet" type="text/css" href="/main.css"/>
			<title>Link!!!</title> 
		</head>
		<body>
			<div id="react-root">
				${ReactDOMServer.renderToString(<AppRoot />)}
			</div>
			<script src="vendors-main-bundle.js"></script>
			<script src="main-bundle.js"></script>
		</body>
	</html>
	`);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT} in ${process.env.NODE_ENV}`);
});
