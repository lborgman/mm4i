const path = require('path');

module.exports = {
  entry: './rxdb-setup.js',
  output: {
    filename: 'rxdb-setup-webpack.js',
    path: path.resolve(__dirname, './'),
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true
  },
  mode: 'development',
  devtool: 'inline-source-map', // Try inline source map instead
  optimization: {
    minimize: false
  },
  node: {
    __filename: true,
    __dirname: true
  }
};