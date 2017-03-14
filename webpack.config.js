var path = require('path');
var webpack = require('webpack')

module.exports = {
  entry: {
    "MicrosoftAjax": "./src/Index.ts",
    "Test": "./test/Index.ts"
  },
  output: {
    filename: 'out/[name].js',
    library: "Sys",
    libraryTarget: "var"
  },
  plugins : [
    new webpack.optimize.CommonsChunkPlugin( { name: "MicrosoftAjax" } )
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension. 
    extensions: ['.ts', '.tsx', '.js'], // note if using webpack 1 you'd also need a '' in the array as well 
    modules: [ path.resolve( "./src/" ) ]
    /*alias: {
      "src": path.resolve( "./src" )
    }*/
  },
  module: {
    loaders: [ // loaders will work with webpack 1 or 2; but will be renamed "rules" in future 
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader` 
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}