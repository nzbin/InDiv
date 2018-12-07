const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    'app': './demo/index.ts',
    // 'app-js': './demo/index.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },

  devtool: 'inline-source-map',

  resolve: {
    extensions: [
      '.js', '.jsx', '.ts', '.tsx',
    ],
    alias: {
      "@indiv": path.resolve(__dirname, 'packages'),
    },
  },

  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],

  module: {
    rules: [{
      test: [
        /\.js$/, /\.jsx$/,
      ],
      exclude: [path.resolve(__dirname, 'node_modules')],
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            'dynamic-import-webpack',
          ],
        },
      },
      ],
    }, 
    {
      test: [
        /\.ts$/,/\.tsx$/,
      ],
      exclude: [path.resolve(__dirname, 'node_modules')],
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
            plugins: [
              '@babel/plugin-syntax-dynamic-import',
              'dynamic-import-webpack',
            ],
          },
        },
        "awesome-typescript-loader",
      ],
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true,
          },
        }],
        fallback: 'style-loader',
      }),
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true,
          },
        }, {
          loader: 'less-loader',
          options: {
            paths: [
              path.resolve(__dirname, 'node_modules'),
              path.resolve(__dirname, 'web/styles'),
            ],
            javascriptEnabled: true,
          },
        }],
        fallback: 'style-loader',
      }),
    }],
  }
};
