const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: path.resolve(__dirname, 'src/bootstrap.tsx'),
  mode: 'development',
  devtool: 'source-map',
  devServer: { port: 3002, historyApiFallback: true, static: path.resolve(__dirname, 'public') },
  output: { publicPath: 'auto', clean: true },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfeB',
      filename: 'remoteEntry.js',
      exposes: {
        './mount': './src/bootstrap',
        './App': './src/AppB'
      },
      shareScope: 'react19',
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0', eager: false },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0', eager: false }
      }
    }),
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public/index.html') })
  ]
};