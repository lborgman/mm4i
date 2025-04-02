const path = require('path');

module.exports = {
  entry: './rxdb-setup.js',
  output: {
    filename: 'rxdb-setup-webpack.js',
    path: path.resolve(__dirname, './')
  },
  mode: 'development',
  devtool: 'inline-source-map' // This embeds the source map directly in the JS file
};