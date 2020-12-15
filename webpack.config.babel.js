import path from 'path';
import { AngularCompilerPlugin } from '@ngtools/webpack';
import { DefinePlugin } from 'webpack';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const join = (...args) => path.join(__dirname, ...args);

module.exports = env => {

    const entryResources = [];

    if (JSON.stringify(env.opensource) === "true") {
        entryResources.push('./front/styles/variables.opensource.css');
    }

    entryResources.push(
        './front/styles/layout.css',
        './front/styles/styles.css',
        './front/styles/vpn_styles.css',
        './front/styles/login.css',
        './front/app.ts',
    );

    return {
        entry: entryResources,
        output:
            {
                path: join('./vpnserver/static'),
                filename: "app.bundle.js"
            },
        module:
            {
                rules:
                    [
                        {
                            test: /\.ts$/,
                            use: [
                                {
                                    loader: 'awesome-typescript-loader',
                                    options: { configFileName: join('./front', 'tsconfig.json') }
                                },
                                'angular2-template-loader'
                            ]
                        },
                        {
                        test: /\.html$/,
                        loader: 'html-loader'
                        },
                        {
                            test: /\.(png|jpg|gif|svg)$/,
                            use: {
                                loader: 'url-loader',
                                options: {
                                    limit: 25000
                                }
                            },
                        },
                        {
                            test: /\.css$/,
                            use: [
                                'style-loader',
                                MiniCssExtractPlugin.loader,
                                'css-loader'
                            ]
                        }
                    ]
            },
        resolve: {
            extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
        },
        plugins: [
            new DefinePlugin({
                OPENSOURCE: JSON.stringify(env.opensource) === "true",
            }),
            new MiniCssExtractPlugin({ filename: 'styles.css' }),
            new AngularCompilerPlugin({
                mainPath: join('./front', 'app.ts'),
                platform: 0,
                sourceMap: true,
                tsConfigPath: join('./front', 'tsconfig.json'),
                skipCodeGeneration: true,
                compilerOptions: {},
            })
        ],
        watch: false,
        watchOptions: {
            poll: false //for watch option on linux
        }
    }
};
