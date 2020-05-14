const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        exclude: /\.module\.s[ac]ss$/,
        use: [ 
          {
            loader: 'style-loader'
          },
          { 
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.module\.s[ac]ss$/,
        use: [ 
          {
            loader: 'style-loader'
          },
          { 
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true
            }
          },
          'sass-loader'
        ]
      },
    ]
  },
});