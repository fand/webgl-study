const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './docs/'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.md'],
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { test: /\.(glsl|frag|vert)$/, loader: 'raw-loader', exclude: /node_modules/ },
      { test: /\.(glsl|frag|vert)$/, loader: 'glslify-loader', exclude: /node_modules/ },
      { test: /\.md$/, loader: 'raw-loader' },
    ],
  },
  devtool: 'cheap-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'docs'),
  },
  watchOptions: {
    ignored: /.frag$/,
  },
};
