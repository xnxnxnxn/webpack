/*
  webpack.config.js  webpack的配置文件
    作用: 指示 webpack 干哪些活（当你运行 webpack 指令时，会加载里面的配置）

    所有构建工具都是基于nodejs平台运行的~模块化默认采用commonjs。
*/

// resolve用来拼接绝对路径的方法
const { resolve } = require('path');
// html插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // webpack配置
    // 入口起点
    entry: './src/index.js',
    // 输出
    output: {
        // 输出文件吗
        filename: 'built.js',
        // 输出路径
        // __dirname nodejs的变量，代表当前文件的目录绝对路径
        path: resolve(__dirname, 'build')
    },
    // loader的配置
    module: {
        rules: [
            // 详细 loader配置
            // 不同文件必须配置不同loader处理
            {
                // 匹配那些文件
                test: /\.css$/,
                // 使用哪些loader进行处理
                use: [
                    // use数组中loader执行顺序：从右到左，从下到上 依次执行
                    // npm i css-loader style-loader -D 
                    // 创建style标签，将js中的央视资源插入进行，添加到head中生效
                    'style-loader',
                    // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                  'style-loader',
                  'css-loader',
                  // 将less文件编译成css文件
                  // npm i less-loader -D
                  // 需要下载 less-loader和less
                  'less-loader'
                ]
            },
            {   
                // 问题：默认处理不了html中img标签的图片
                // 处理图片资源
                test: /\.(jpg|png|gif)$/,
                // 使用一个loader 
                // npm i url-loader file-loader -D
                // 下载 url-loader file-loader
                loader: 'url-loader',
                // 参数
                options: {
                    // 图片大小小于8kb，就会被base64处理(可以看到打包后的vue图片因为小于8kb就直接转为base64字符串处理)
                    // 优点: 减少请求数量（减轻服务器压力）
                    // 缺点：图片体积会更大（文件请求速度更慢）
                    limit: 8 * 1024,
                    // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
                    // 解析时会出问题：[object Module]
                    // 解决：关闭url-loader的es6模块化，使用commonjs解析
                    esModule: false,
                    // 给图片进行重命名
                    // [hash:10]取图片的hash的前10位
                    // [ext]取文件原来扩展名
                    name: '[hash:10].[ext]'
                }
            },
            {
                test: /\.html$/,
                // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
                //  npm i html-loader -D
                loader: 'html-loader'
            },
            {
                // 打包其他资源(除了html/js/css资源以外的资源)
                exclude: /\.(css|js|html|less|jpg|png|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]'
                }
            } 
        ]
    },
    // plugins的配置
    plugins: [
        // 详细plugins的配置
        // html-webpack-plugin
        // npm i html-webpack-plugin -D
        // 功能：默认会创建一个空的html，自动引入打包输出的所有资源（js/css）
        // 需求：需要有结构的html文件
        new HtmlWebpackPlugin({
            // 复制'./src/index.html'文件 ，自动引入打包输出的所有资源（js/css）
            template: './src/index.html'
        })
    ],
    // 模式
    mode: 'development', // 开发模式
    // mode: 'production'
    // 开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器~~）

    // 特点：只会在内存中编译打包，不会有任何输出
    // 启动devServer指令为：npx webpack-dev-server
    devServer: {
        // 项目构建后路径
        contentBase: resolve(__dirname, 'build'),
        // 启动gzip压缩
        compress: true,
        // 端口号
        port: 3000, 
        // 自动打开浏览器
        open: true
  }
}