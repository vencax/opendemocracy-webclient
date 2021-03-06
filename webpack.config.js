require('dotenv').config()
const path = require('path')
const Webpack = require('webpack')
const {getIfUtils, removeEmpty} = require('webpack-config-utils')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env = {
  dev: true
}) => {
  const {ifProd} = getIfUtils(env)
  const babelOptions = {
    presets: ['react', ['es2015', {'modules': false}]],
    plugins: [
      'transform-object-rest-spread',
      'transform-decorators-legacy',
      'transform-class-properties'
    ]
  }
  if (!env.dev) {
    babelOptions.plugins.push('transform-react-remove-prop-types')
  }
  const conf = new HtmlWebpackPlugin({
    perPage: process.env.PERPAGE || 15,
    siteName: process.env.SITENAME || 'OPEN voting',
    apiUrl: process.env.API_URL,
    authUrl: process.env.AUTH_URL,
    prefix: env.dev ? '/' : '',
    inject: false,
    template: 'index.template.html'
  })
  console.log('api-url:', process.env.API_URL)
  const config = {
    devtool: ifProd('hidden-source-map', 'inline-source-map'),
    entry: path.resolve('./js/main.js'),
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules(?!(\\|\/)react-mobx-admin|(\\|\/)fb-like-discussions|(\\|\/)mobx-router)/,
          loader: 'babel-loader',
          options: babelOptions
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
        }, {
          from: path.resolve('./bootstrap_comments.css'),
          to: path.resolve('./build/bootstrap_comments.css')
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
