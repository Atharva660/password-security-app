const { override } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
  (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "crypto": require.resolve('crypto-browserify'),
      "stream": require.resolve('stream-browserify'),
      "assert": require.resolve('assert'),
      "path": require.resolve('path-browserify')
    };

    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      })
    );

    return config;
  }
);