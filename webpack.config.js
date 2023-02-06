const path = require('path');
const fs = require('fs');
const Dotenv = require('dotenv-webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackBar = require('webpackbar');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const srcPath = path.resolve(__dirname, 'src');
const buildPath = path.resolve(__dirname, 'build');
const publicPath = path.resolve(__dirname, 'public');

const handleDir = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(publicPath, (err, files) => {
      if (err) {
        reject(`Unable to scan directory: ${err}`);
      }

      resolve(files);
    });
  });
};

module.exports = async (env, args) => {
  const port = args.port;
  const isDev = args.mode === 'development';
  const dirs = await handleDir();

  const copyPluginPatterns = dirs
    .filter((dir) => dir !== 'index.html')
    .map((dir) => {
      return {
        from: dir,
        to: '',
        context: publicPath,
      };
    });

  const basePlugins = [
    new Dotenv(),
    new HTMLWebpackPlugin({
      template: 'public/index.html',
      title: isDev ? 'Development' : 'Production',
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : 'static/css/[name].[contenthash:6].css',
    }),
    new ForkTsCheckerWebpackPlugin(),
    new ESLintPlugin({ extensions: ['ts', 'tsx', 'js', 'jsx'], failOnWarning: false, emitWarning: true }),
    new WebpackBar({ name: 'App' }),
  ];

  const prodPlugin = [
    ...basePlugins,
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: copyPluginPatterns,
    }),
  ];

  return {
    mode: args.mode,
    entry: srcPath,
    output: {
      path: buildPath,
      filename: 'bundle.[hash:6].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
            },
          ],
        },
        {
          test: /\.(s[ac]ss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: isDev },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: isDev },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: isDev,
                postcssOptions: {
                  plugins: ['tailwindcss'],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isDev
                  ? '[path][name].[ext]'
                  : 'static/media/[name].[contenthash:6].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isDev
                  ? '[path][name].[ext]'
                  : 'static/fonts/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: { src: srcPath },
    },
    plugins: isDev ? basePlugins : prodPlugin,
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    devServer: {
      static: {
        directory: publicPath,
      },
      port: port || 8080,
      hot: true,
      historyApiFallback: true,
      open: true,
    },
  };
};
