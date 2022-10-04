const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './dist');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const API_URLS = {
  hpe: 'http://10.8.0.16',
  // hpe: 'http://10.8.0.28',
  adlink: 'http://10.8.0.28',
  test: '',
  remote_demo: 'https://qc-demo.analog.otosense.ai/',
};

const LOCALE_DIRS = {
  remote_demo: '/static/json/demo_locales',
};

module.exports = (env) => {
  console.log({ env });
  return {
    context: sourcePath,
    devtool: 'eval-cheap-module-source-map',
    mode: 'development',
    entry: ['babel-polyfill', './index.tsx'],
    output: {
      path: outPath,
      publicPath: '/',
      filename: 'bundle.js',
    },
    target: 'web',
    resolve: {
      alias: {
        react: path.resolve('node_modules/react'),
        'react-dom': path.resolve('node_modules/react-dom'),
      },
      modules: [sourcePath, 'node_modules'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    externals: {
      fs: true,
    },
    module: {
      rules: [{
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          plugins: [
            ['@babel/plugin-proposal-decorators', {legacy: true}],
            require.resolve('react-refresh/babel'),
          ],
          presets: [
            '@babel/react',
            '@babel/typescript',
            ['@babel/preset-env', {targets: 'defaults'}],
          ],
        },
      }, {
        test: /\.js$/,
        include: sourcePath,
        loader: 'source-map-loader',
        enforce: 'pre',
      }, {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }, {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
      }, {
        test: /\.(jpg|png|gif|svg)$/,
        include: sourcePath,
        use: [
          'file-loader', {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 4,
              },
              pngquant: {
                quality: '75-90',
                speed: 3,
              },
            },
          },
        ],
      }, {
        test: /\.html$/,
        include: sourcePath,
        loader: 'html-loader',
        // }, {
        //     test: /\.json$/,
        //     loader: 'json-loader',
        // }, {
        //     test: /\.(mp4|webm)$/,
        //     loader: 'url-loader',
        //     options: {
        //         limit: 10000,
        //     },
      },

      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        hash: true,
        template: 'index.html',
      }),
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.API_BASE_URL': JSON.stringify(API_URLS[env.target || 'test']),
        WEBPACK_API_BASE_URL: JSON.stringify(API_URLS[env.target || 'test']),
        'process.env.API_PORT': JSON.stringify(env.apiPort || 5000),
        WEBPACK_API_PORT: JSON.stringify(env.apiPort || 5000),
        'process.env.LOCALE_ROOT_DIR': JSON.stringify(LOCALE_DIRS[env.target] || '/static/json/locales'),
      }),
    ],

    devServer: {
      contentBase: sourcePath,
      historyApiFallback: {
        index: '/',
      },
      hot: true,
      disableHostCheck: true,
      stats: {
        warnings: false,
      },
      publicPath: '/',
    },
  };
};
