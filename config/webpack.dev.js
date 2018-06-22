const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	// Point of entry, from where our code is run from
	// we can use multiple files as entry, put them in array and webpack will concatenate them together
	// Here the polyfills will be included in file before our code
	// main: ['core-js/fn/promise', './src/main.js'],
	entry: {
		// We can require packages here, before our entry file
		// They will count like we've already imported them
		main: [
			'babel-runtime/regenerator',
			'react-hot-loader/patch',
			'webpack-hot-middleware/client?reload=true',
			'babel-register',
			'./src/main',
		],
		// typescript entry point
		// ts: ['./src/index.ts'],
		// Polyfills should go above main file they are supposed to enhance
		// polyfills: ['./src/angular-polyfills'],
		// angular: ['./src/angular'],
	},
	resolve: {
		//  Tell webpack that entry files are using specific extensions, so that we can omit them there
		extensions: ['.js', '.ts'],
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
		// We want to use this if we're going to use Angular routing
		historyApiFallback: true,
		// Enable this if we want to have errors displayed on browser page, instead of just console
		overlay: true,
		hot: true,
		stats: {
			// Add colors to the terminal output
			colors: true,
		},
	},
	devtool: 'source-map',
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
				test: /\.ts$/,
				use: [
					{
						loader: 'awesome-typescript-loader',
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
				test: /\.sass$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader' },
					{ loader: 'postcss-loader' },
					{ loader: 'sass-loader' },
				],
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
							name: 'images/[name]-[hash:8].[ext]',
						},
					},
				],
			},
			{
				test: /\.html$/,
				use: [
					/* htmlWebpackPlugin does this for us
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
					*/
					{
						// html loader does the linting and then passes result to other loaders
						// again, reversed module order
						loader: 'html-loader',
						options: {
							// tell webpack that we want to target src attr in img
							attrs: ['img:src'],
						},
					},
				],
			},
			{
				test: /\.pug$/,
				use: [
					{
						loader: 'pug-loader',
					},
				],
			},
			{
				test: /\.hbs$/,
				use: [
					{
						loader: 'handlebars-loader',
					},
				],
			},
		],
	},
	plugins: [
		// This will enable HMR
		new webpack.HotModuleReplacementPlugin(),
		// This plugin will cause the relative path of the module to be displayed when HMR is enabled. Suggested for use in development.
		new webpack.NamedModulesPlugin(),
		// The ContextReplacementPlugin allows you to override the inferred information.
		new webpack.ContextReplacementPlugin(
			// This regex is a way to indicate both Win and Mac versions of directory systems
			// Win uses \, Mac uses /
			/angular(\\|\/)core/,
			path.join(__dirname, './src'),
			{}
		),
		// This will automatically inject script tags into index.html
		new htmlWebpackPlugin({
			template: './src/index.ejs',
			title: "Link's journal",
		}),
	],
};
