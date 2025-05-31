const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

// Read the CSS file content
const cssContent = fs.readFileSync(path.resolve(__dirname, 'ui/styles.css'), 'utf8');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  entry: {
    code: './src/code.ts', // Only plugin code
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.css', '.html'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'ui/welcome.html',
      inject: false,
      templateContent: ({ htmlWebpackPlugin }) => {
        // Read the original HTML
        let html = fs.readFileSync(path.resolve(__dirname, 'ui/welcome.html'), 'utf8');
        // Remove any <link rel="stylesheet" ...> tags
        html = html.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '');
        // Inject the CSS into the <head>
        return html.replace(
          /<head>([\s\S]*?)<\/head>/,
          `<head>$1<style>${cssContent}</style></head>`
        );
      }
    })
  ],
});