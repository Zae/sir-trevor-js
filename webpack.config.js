const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  // entry: './src/index.js',
  entry: {
    'sir-trevor': './src/index.js',
    css: './src/sass/main.scss'
  },
  // entry: {
  //   'sir-trevor': ['./src/index.js', './src/sass/main.scss']
  // },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].standalone.js',
    library: 'SirTrevor',
    libraryTarget: 'umd',
    libraryExport: "default",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.scss$/,
        use: [
          // fallback to style-loader in development
          // process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'sir-trevor.css',
    }),
  ],
  externals: {
    jquery: 'jQuery'
  }
};
