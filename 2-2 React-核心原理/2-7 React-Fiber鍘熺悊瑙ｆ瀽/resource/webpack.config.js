const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  // devServer: {
  //   // contentBase: path.join(__dirname, 'template'),
  //   index: 'src/template/index.html'
  // },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // title: '从0到1实现react',
      // // filename: 'adasdasdas.html'
      template: 'src/template/index.html'
    })
  ],
};