const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const NodeExternals = require('webpack-node-externals');

module.exports = env => {
	return {
		entry: {
			server: ['./src/server/main.js'],
		},
		mode: 'production',
		output: {
			filename: '[name]-bundle.js',
			path: path.resolve(__dirname, '../build'),
		},
		// Default is web, which tells webpack that our env is browser
		target: 'node',
		// this tells webpack that everything that's in node_modules is to be skipped
		externals: NodeExternals(),
		optimization: {
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					vendor: {
						name: 'vendor',
						chunks: 'initial',
						minChunks: 2,
					},
				},
			},
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
						},
					],
				},
				{
					test: /\.css$/,
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: {
							loader: 'css-loader',
							options: {
								minimize: true,
							},
						},
					}),
				},
				{
					test: /\.jpg$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: 'images/[name].[ext]',
								emitFile: false,
							},
						},
					],
				},
				{
					test: /\.md$/,
					use: [
						{
							loader: 'markdown-with-front-matter-loader',
						},
					],
				},
			],
		},
		plugins: [
			new ExtractTextPlugin('[name].css'),
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify(env.NODE_ENV),
				},
			}),
		],
	};
};
