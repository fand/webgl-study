const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './docs/'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { test: /\.(glsl|frag|vert)$/, loader: 'raw-loader', exclude: /node_modules/ },
      { test: /\.(glsl|frag|vert)$/, loader: 'glslify-loader', exclude: /node_modules/ },
    ],
  },
  devtool: 'cheap-eval-source-map',
};
