const path = require('path');

module.exports = {
	// Point of entry, from where our code is run from
	// we can use multiple files as entry, put them in array and webpack will concatenate them together
	// Here the polyfills will be included in file before our code
	// main: ['core-js/fn/promise', './src/main.js'],
	entry: {
		// Bundle
		main: ['./src/main.js'],
	},
	// This is available only since W4
	mode: 'development',
	// target where to output parsed files
	output: {
		// File name | [name] becomes the name of the entry.main
		filename: '[name]-bundle.js',
		// Absolute path | __dirname stands for the current directory
		path: path.resolve(__dirname, '../dist'),
		// Root path
		publicPath: '/',
	},
	devServer: {
		// Everything is served from dist
		contentBase: 'dist',
		// Enable this if we want to have errors displayed on browser page, instead of just console
		overlay: true,
	},
	module: {
		// These are the rules that Webpack use when encounters various file types
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
					},
				],
				exclude: /node_modules/,
			},
			{
				// test indicates the file extension that we want to target
				test: /\.css$/,
				// Here we specify loaders for that filetype
				// This loaders will run in the reverse order
				// style-loader is responsible for injecting css into html
				use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
			},
			{
				// We can target multiple image filetypes with something like this
				// /\.(jpg|gif|png)$/
				test: /\.jpg$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							// Tell webpack how the file should be named
							// We can add hash to the image with something like this
							// name: 'images/[name]-[hash:8].[ext]',
							name: 'images/[name].[ext]',
						},
					},
				],
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							// Chose how the output file should be named
							name: '[name].[ext]',
						},
					},
					{
						// Extract loader tells webpack that this should be separate file
						// not included in main bundle.js
						loader: 'extract-loader',
						options: {
							publicPath: '../',
						},
					},
					{
						// htnl loader does the linting and then passes result to other loaders
						// again, reversed module order
						loader: 'html-loader',
						options: {
							// tell webpack that we want to target src attr in img
							attrs: ['img:src'],
						},
					},
				],
			},
		],
	},
};
