const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: path.resolve(__dirname, 'src/bootstrap.tsx'),
  mode: 'development',
  devtool: 'source-map',
  devServer: { port: 3001, historyApiFallback: true, static: path.resolve(__dirname, 'public') },
  output: { 
    publicPath: 'auto', 
    clean: true,
    uniqueName: 'mfeA'
  },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfeA',
      filename: 'remoteEntry.js',
      exposes: {
        './mount': './src/bootstrap',   // ✅ Good API
        './App': './src/AppA'            // ❌ Exposed only to demo the bad pattern
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