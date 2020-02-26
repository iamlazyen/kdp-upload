const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const Webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, '..', 'index.js'),
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '..', 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test:/\.css$/,
        use:['vue-style-loader', 'style-loader','css-loader']
      },
      {
        test:/\.scss$/,
        use:[
          'vue-style-loader',
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader', 
          'postcss-loader', 
          'sass-loader'
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [{
          loader: 'url-loader?limit=100000'
        }]
      },
      {
        test:/\.vue$/,
        use:['vue-loader']
      }
    ]
  },

  devServer:{
    port:3000,
    hot:true,
    contentBase:'../dist'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
      chunkFilename: "[id].css",
    }),
    new vueLoaderPlugin(),
    new Webpack.HotModuleReplacementPlugin()
  ]
}