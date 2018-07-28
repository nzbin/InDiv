const path = require('path');

module.exports = (env) => {
  const entry = {
    index: './src/index.ts',
    // 'test-ts': './demo/index.ts',
  };

  const output = {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/build/',
  };

  const resolve = {
    extensions: [
      '.js', '.jsx', '.ts', '.tsx',
    ],
  };

  const module = {
    rules: [
      {
        test: [
          /\.js$/, /\.jsx$/,
        ],
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
        ],
      },
      {
        test: [
          /\.ts$/, /\.tsx$/,
        ],
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env'],
            },
          },
          {
            loader: 'awesome-typescript-loader',
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|gif|png)$/,
        loader: 'url-loader',
      }],
  };

  const config = {
    entry,
    output,
    resolve,
    module,
  };
  return config;
};
