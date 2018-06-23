const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

module.exports = env => {
	return {
		// Point of entry, from where our code is run from
		entry: {
			main: ['./src/main'],
		},
		resolve: {
			//  Tell webpack that entry files are using specific extensions, so that we can omit them there
			extensions: ['.js', '.ts'],
		},
		// target where to output parsed files
		output: {
			// File name | [name] becomes the name of the entry.main
			filename: '[name]-bundle.js',
			// Absolute path | __dirname stands for the current directory
			path: path.resolve(__dirname, '../dist'),
			// Root path
			publicPath: '/',
		},
		devtool: 'source-map',
		devServer: {
			contentBase: 'dist',
			overlay: true,
			stats: {
				colors: true,
			},
		},
		// This is available only since W4
		mode: 'production',
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
					use: [{ loader: MiniCSSExtractPlugin.loader }, { loader: 'css-loader' }],
				},
				{
					test: /\.sass$/,
					use: [
						{ loader: MiniCSSExtractPlugin.loader },
						{
							loader: 'css-loader',
							// We can minify CSS like this, but it's not the optimal solution
							// options: {s
							// 	minimize: true,
							// },
						},
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
					test: /\.md$/,
					use: [
						{
							loader: 'markdown-with-front-matter-loader',
						},
					],
				},
				{
					test: /\.html$/,
					use: [
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
			// This plugin will cause the relative path of the module to be displayed when HMR is enabled. Suggested for use in development.
			new webpack.NamedModulesPlugin(),
			// This will automatically inject script tags into index.html
			new htmlWebpackPlugin({
				template: './src/index.ejs',
				title: "Link's journal",
			}),
			// Minifies CSS and removes duplicate CSS declarations, really nice stuff!
			new OptimizeCSSAssetsPlugin({
				assetNameRegExp: /\.css$/g,
				cssProcessor: require('cssnano'),
				cssProcessorOptions: {
					discardComments: {
						removeAll: true,
					},
				},
				canPrint: true,
			}),
			// Extracts CSS from bundle, and handles it in parallel with js(production only)
			new MiniCSSExtractPlugin({
				// Really useful for production
				filename: '[name]-[contenthash].css',
			}),
			new webpack.DefinePlugin({
				'process.env': {
					// Here we can tell Webpack that we're in production, so that it can optimize our build
					NODE_ENV: JSON.stringify(env.NODE_ENV),
				},
			}),
			// Throws error when using source-maps...
			// new MinifyPlugin(),
			new UglifyJsPlugin(),
			new CompressionPlugin({
				algorithm: 'gzip',
			}),
			new BrotliPlugin(),
		],
	};
};
