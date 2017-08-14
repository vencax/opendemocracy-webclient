require('dotenv').config()
const path = require('path')
const Webpack = require('webpack')
const {getIfUtils, removeEmpty} = require('webpack-config-utils')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const conf = new HtmlWebpackPlugin({
  perPage: process.env.PERPAGE || 15,
  siteName: process.env.SITENAME || 'OPEN voting',
  apiUrl: process.env.API_URL,
  inject: false,
  template: 'index.template.html'
})
console.log('api-url:', process.env.API_URL)

module.exports = (env = {
  dev: true
}) => {
  const {ifProd} = getIfUtils(env)
  const config = {
    devtool: ifProd('hidden-source-map', 'inline-source-map'),
    entry: path.resolve('./js/main.js'),
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules(?!(\\|\/)react-mobx-admin|(\\|\/)fb-similar-discussions|(\\|\/)mobx-router)/,
          loader: 'babel-loader'
        }
      ]
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'main.min.js'
    },
    plugins: removeEmpty([
      conf,
      new Webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: ifProd('"production"', '"development"')
        }
      }),
      new CleanWebpackPlugin(['build'], {
        root: path.resolve('./'),
        verbose: true,
        dry: false
      }),
      new CopyWebpackPlugin([
        {
        //   from: path.resolve('./css'),
        //   to: path.resolve('./build/css')
        // }, {
        //   from: path.resolve('./fonts'),
        //   to: path.resolve('./build/fonts')
        // }, {
          from: path.resolve('./favicon.ico'),
          to: path.resolve('./build/favicon.ico')
        }
      ], {copyUnmodified: true})
    ]),
    externals: {
      'axios': 'axios',
      'mobx': 'mobx',
      'mobx-react': 'mobxReact',
      'react': 'React',
      'react-dom': 'ReactDOM'
    }
  }
  return config
}
