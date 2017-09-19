'use strict';

process.noDeprecation = true;
module.exports = config => {
  // exportable modules
  let nodeModules = {};

  // get variables from config
  const {dir, cwd, env} = config;

  // get webpack from ship
  const webpack = require(`${cwd}/node_modules/webpack`);

  // get dependencies
  const {dependencies} = require(`${dir}/package.json`);

  // webpack resolvers
  const resolve = {
    modules: [
      'node_modules/'
    ],
    alias: config.aliases
  };

  const loaders = [
    {
      test: /\.js$/i,
      loader: 'babel-loader',
      exclude: /node_modules/
    },

    {
      test: /\.(ttf|eot|woff|woff2|png|ico|jpg|jpeg|gif|css)$/i,
      loader: 'ignore-loader'
    }
  ];

  // prepare dependencies modules
  Object
    .keys(dependencies)
    .forEach(mod => {
      nodeModules[mod] = `commonjs ${mod}`;
    });

  return {
    name: 'ship-server',
    entry: config.development.server.file,
    target: 'node',
    resolve: resolve,
    devtool: env === 'production' ? 'source-map' : 'eval',
    externals: nodeModules,

    output: {
      path: config.build.server.path,
      filename: config.build.server.file,
      libraryTarget: 'commonjs2'
    },

    module: {
      rules: loaders
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      })
    ]
  };
};
