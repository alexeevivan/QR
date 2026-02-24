const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: "all",
		},
	};

	if (isProd) {
		config.minimizer = [
			new CssMinimizerPlugin(),
			new TerserWebpackPlugin(),
		];
	}

	return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`);

module.exports = {
	context: path.resolve(__dirname, "src"),
	entry: "./js/index.js",
	output: {
		filename: "js/[name].[contenthash].js",
		path: path.resolve(__dirname, "docs"),
		clean: true,
	},
	optimization: optimization(),
	devtool: isDev ? "source-map" : false,
	devServer: {
		static: {
			directory: path.resolve(__dirname, "docs"),
		},
		host: '0.0.0.0',
		port: 3000,
		open: true,
		hot: true,
		allowedHosts: 'all'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html",
			minify: {
				collapseWhitespace: isProd,
			},
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "src/assets/content"),
					to: path.resolve(__dirname, "docs/content"),
				},
			],
		}),
		new MiniCssExtractPlugin({
			filename: "css/[name].[contenthash].css",
		}),
	],
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader",
				],
			},
			{
				test: /\.css$/,   // <--- вот это нужно
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
				],
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/i,
				type: "asset/resource",
				generator: {
					filename: "content/[name][ext]",
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
				generator: {
					filename: "fonts/[name][ext]",
				},
			},
		],
	},
};