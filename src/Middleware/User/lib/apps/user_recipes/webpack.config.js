const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {

	return {
		mode: argv.mode,
		entry: './src/index.js',
		output: {
			path: path.resolve(__dirname, './dist'), // the bundle output path
			filename: 'user_recipes.build.js', // the name of the bundle
			publicPath: '/',
			/*publicPath: '/wp-content/plugins/sv-grillfuerst-user-recipes/src/Middleware/User/lib/apps/user_recipes/dist/',*/
		},
		plugins: [
			new Dotenv({path: path.resolve(__dirname, `./.env.${argv.mode}`)}),
			new HtmlWebpackPlugin({
				template: './src/index.html', // to import index.html file inside index.js
			}),
		],
		devServer: {
			static: {
				directory: path.join(__dirname, 'dist'),
				publicPath: '/',
			},
			port: 3050, // you can change the port
			open: true,
			hot: true,
			compress: true,
			historyApiFallback: true,
		},
		optimization: {
			minimize: true
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
					},
				},
				{
					test: /\.(sa|sc|c)ss$/, // styles files
					use: ['style-loader', 'css-loader', 'postcss-loader'],
				},
				{
					test: /\.(jpg|png|eot|ttf|svg)$/i,
					type: 'asset/resource',
					
					generator: {
						filename: 'assets/images/[name][ext]',
					},
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/i,
					type: 'asset/resource',
					
					generator: {
						filename: 'assets/fonts/[name][ext]',
					},
				},
			
			],
		}
	}
};