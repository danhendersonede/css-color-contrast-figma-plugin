const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

// Get all HTML files from the UI directory
const htmlFiles = fs.readdirSync(path.resolve(__dirname, 'ui'))
  .filter(file => file.endsWith('.html'))
  .map(file => ({
    name: file,
    path: path.resolve(__dirname, 'ui', file)
  }));

// Plugin to ensure webpack watches UI files
class UIWatcherPlugin {
  apply(compiler) {
    compiler.hooks.afterCompile.tap('UIWatcherPlugin', (compilation) => {
      // Add UI directory to watched files
      compilation.contextDependencies.add(path.resolve(__dirname, 'ui'));
    });
  }
}

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  entry: {
    code: './src/code.ts'
  },
  watchOptions: {
    ignored: /node_modules/,
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
    extensions: ['.ts', '.js', '.css'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.WatchIgnorePlugin({
      paths: [/node_modules/],
    }),
    new UIWatcherPlugin(),
    // Create HtmlWebpackPlugin instances for each HTML file
    ...htmlFiles.map(file => new HtmlWebpackPlugin({
      filename: `ui/${file.name}`,
      inject: false,
      templateContent: () => {
        // Read the original HTML
        let html = fs.readFileSync(file.path, 'utf8');
        // Read the CSS file content (now done dynamically)
        const cssContent = fs.readFileSync(path.resolve(__dirname, 'ui/styles.css'), 'utf8');
        // Remove any <link rel="stylesheet" ...> tags
        html = html.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '');
        // Inject the CSS into the <head>
        return html.replace(
          /<head>([\s\S]*?)<\/head>/,
          `<head>$1<style>${cssContent}</style></head>`
        );
      }
    }))
  ],
});