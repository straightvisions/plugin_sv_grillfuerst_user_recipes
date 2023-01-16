const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, './dist'), // the bundle output path
		filename: 'login.build.js', // the name of the bundle
		publicPath: '/',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html', // to import index.html file inside index.js
		}),
	],
	devServer: {
		port: 3050, // you can change the port
		open: true,
		hot: true,
		compress: true,
		historyApiFallback: true,
	},
	optimization: {
		minimize: false
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/, // .js and .jsx files
				exclude: /node_modules/, // excluding the node_modules folder
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.(sa|sc|c)ss$/, // styles files
				use: ['style-loader', 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.(png|woff|eot|ttf|svg)$/, // to import images and fonts
				loader: 'url-loader',
				options: { limit: false },
			},
		],
	},
};