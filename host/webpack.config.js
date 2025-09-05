const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: path.resolve(__dirname, 'src/index.tsx'),
  mode: 'development',
  devtool: 'source-map',
  devServer: { port: 3000, historyApiFallback: true, static: false },
  output: { 
    publicPath: 'auto', 
    clean: true,
    uniqueName: 'host'
   },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        mfeA: 'mfeA@http://localhost:3001/remoteEntry.js',
        mfeB: 'mfeB@http://localhost:3002/remoteEntry.js'
      },
      shareScope: 'react18',
      shared: {
        react: { singleton: true, requiredVersion: '^18.3.1', eager: false, strictVersion: false },
        'react-dom': { singleton: true, requiredVersion: '^18.3.1', eager: false, strictVersion: false }
      }
    }),
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public/index.html') })
  ]
};