const path =require('path')
const htmlWebpackPlugin=require('html-webpack-plugin')

module.exports={
    entry:{
        app:path.resolve(__dirname,'../src/index')
    },
    output:{
        path:path.resolve(__dirname,'../dist/')
    },
    resolve:{
        extensions:['.ts','.js','.jsx','.css','.less']
    },
    modules:{
        rules:[
            {
                test:/\.js|ts$/,
                use:'babel-loader?cacheDirectory=true',
                exclude:/node_modules/
            },
            {
                test:/\.less$/,
                use:['style-loader','css-loader','postcss-loader','less-loader']
            }
        ]
    },
    plugins:[
        new htmlWebpackPlugin({
            template:path.resolve(__dirname,'../public/index.html'),
            minify: {
                html5: true,
                collapseWhitespace: true,
                removeComments: true,
                removeTagWhitespace: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true
              }
        })
    ]
}