const webpack = require('webpack');
const path = require('path');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "url": require.resolve("url"),
    "path": require.resolve("path-browserify"),
    "fs": false,
    "zlib": require.resolve("browserify-zlib"),
    "axios": require.resolve('axios'),
    "process": require.resolve("process/browser")
  })
  
  config.resolve.fallback = fallback;
  
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG)
    })
  ])
  
  return config;
}