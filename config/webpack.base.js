const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');

const rootDir = __dirname + "/.."
module.exports = {

    entry: path.resolve(rootDir, "src/ui/index.tsx"),

    output:{
        path: path.resolve(rootDir, "dist/ui/"),
        filename:"[name].js"
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: path.resolve(rootDir, "config/tsconfig.ui.json")
                        }
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/ui/index.html'
        })
    ],
};