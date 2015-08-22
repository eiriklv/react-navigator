'use strict';

/*eslint-disable*/
let path = require('path')
  , webpack = require('webpack')
  , CommonChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
  , ExtractTextPlugin = require('extract-text-webpack-plugin')
  , autoprefixer = require('autoprefixer-core');

// Simple dev / production switch
  function _env(dev, production) {
    return process.env.BUILD_ENV === 'production' ? production : dev;
  }

  function _path(p) {
    return path.join(__dirname, p);
  }

  let plugins = [
    new CommonChunkPlugin('vendor', 'vendor.bundle.js'),
    new ExtractTextPlugin('styles.css', { allChunks: true }),
  ];

  if (_env(true, false)) {
    plugins.push(new webpack.SourceMapDevToolPlugin( '[file].map', null, '[absolute-resource-path]', '[absolute-resource-path]'));
  }

  module.exports = {
    plugins: plugins,
    debug: _env(true, false),
    entry: {
      app: _path('src/index.js'),
      vendor: ['react','immutable']
    },
    output: {
      path: _path('build'),
      filename: 'bundle.js' //this is the default name, so you can skip it
    },
    module: {
      preLoaders: [
        {
          test: /\.js$/,
          loader: 'source-map',
          exclude:[/node_modules/],
        }
      ],
      loaders: [{
        test: /\.html$/,
        loader: `file?name=[name].html`,
      }, {
        test: /\.js$/,
        loader: 'babel?stage=0&optional[]=runtime&loose=all!eslint',
        exclude:[/node_modules/]
      }, {
        test: /\.css$/,
        loader: _env(
          'style!css?importLoaders=1!postcss',
          ExtractTextPlugin.extract('style', 'css?importLoaders=1!postcss')
        )
      }, {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url?limit=8192'
      }, {
        test: /\.(eot|woff|ttf|svg)$/,
        loader: 'url?limit=8192'
      }]
    },
    postcss: [ autoprefixer({ browsers: ['last 1 version'] }) ],
    externals: _env({
      react: 'React',
      immutable: 'Immutable'
    },{}),
    resolve: {
      alias: { 'react-navigator': _path('../src/index') },
      extensions: ['', '.css', '.react.js', '.js', '.jsx']
    },
    eslint: {
      configFile: _path('.eslintrc'),
      emitError: true
    },
    devServer: {
      contentBase: _path('./src'),
      publicPath: '/',
      stats: { colors: true },
      host: '0.0.0.0',
      inline: true,
      port: '8090',
      quiet: false,
      noInfo: false
    }
  };

/*eslint-enable*/
