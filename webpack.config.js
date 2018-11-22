var GasPlugin = require("gas-webpack-plugin");
const path = require('path');
module.exports = {
  entry: path.resolve(__dirname,'src','app.ts'),
  output: {
    path: path.resolve(__dirname ,'dist'),
    filename: 'main.gs'
    },
  resolve: {
    extensions: ['.ts', '.js'
        ],
    },
  module: {
    rules: [
            {
      test: /\.ts$/,
      loader: 'ts-loader',
            }
        ]
    },
  plugins: [
    new GasPlugin()
    ]
}
