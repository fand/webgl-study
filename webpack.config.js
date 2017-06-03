const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    bundle: './src/index.tsx',
    rss: './src/rss.ts',
  },
  output: {
    filename: '[name].js',
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
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'file-loader?name=images/[name].[ext]' },
      { test: /\.(mp3|mp4|wav)$/i, loader: 'file-loader?name=sounds/[name].[ext]' },
    ],
  },
  devtool: 'cheap-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'docs'),
  },
  watchOptions: {
    ignored: /.frag$/,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
