# webpack4Study
webpack4 study
## webpack核心概念
- entry
- output
- loaders
- plugins
# webpack基础-资源解析
## webpack 解析ES6和JSX
## webpack 解析CSS，Less和Sass
## webpack 解析图片和字体
## webpack 文件监听
## webpack 热更新（HMR）
## webpack 文件指纹策略(hash, chunkhash, contenthash)
## webpack HTML，CSS，JavaScript 代码压缩
# webpack进阶-构建项目
## webpack 自动清理构建目录的产物
## webpack PostCSS 插件autoprefixer自动补齐CSS3前缀
## webpack 移动端CSS px自动转换成rem
## webpack 静态资源内联
## webpack 多页面打包方案
## webpack 提取公共资源
## webpack Tree Shaking的使用和原理
## webpack Scope Hoisting的使用和原理
## webpack 代码分割和动态import
## webpack 在webpack中使用ESLint
## webpack 打包基础js库和组件
## webpack 实现SSR打包
## webpack 优化构建时命令行的显示日志
## webpack 构建异常和中断处理

# webpack构建速度和体积优化策略
## webpack 使用内置的stats
```
"build:stats": "webpack --config webpack.prod.js --json > stats.json"
```
## webpack 速度分析 插件 speed-measure-webpack-plugin
分析整个打包总耗时, 包括loader处理，plugin处理的时间

## webpack 体积分析 插件 webpack-bundle-analyzer
1. 分析依赖的第三方模块文件大小
2. 分析业务里面的组件代码大小

## webpack 速度优化-使用高版本的webpack和Node.js
## webpack 速度优化-多进程/多实例： 使用HappyPack解析资源
## webpack 速度优化-多进程/多实例：使用thread-loader解析资源
## webpack 速度优化-多进程/多实例： 并行压缩代码
- 方法1：parallel-uglify-plugin插件
- 方法2：uglifyjs-webpack-plugin 开启 parallel参数 (webpack3)
- 方法3：terser-webpack-plugin 开启 parallel 参数 (webpack4 推荐)
## webpack 速度优化-预编译资源模块 - 使用Dllplugin
思路将react，react-dom，redux，react-redux基础包和业务基础包打包成一个文件
方法：使用DLLPlugin进行分包，DllReferencePlugin对manifest.json引用

## webpack 速度优化-利用缓存提升二次构建速度
缓存思路：
- babel-loader 开启缓存
- terser-webpack-plugin 开启缓存
- 使用cache-loader或hard-source-webpack-plugin

## webpack 速度优化-缩小构建目标，减少文件查找的层次
尽可能少构建模块，减少文件查找
- 优化resolve.modules配置 (减少模块搜索层级)
- 优化resolve.mainFields配置 (package.json中main字段指定的入口文件)
- 优化resolve.extension配置 (文件查找，文件后缀名)
- 合理使用alias (指定查找文件的路径)
## webpack 体积优化-使用Scope Hoisting
## webpack 体积优化-使用Tree Shaking 擦除无用的javaScript 和 CSS
## webpack 体积优化-公共资源分离
## webpack 体积优化-图片压缩
## webpack 体积优化-使用动态Polyfill

# webpack原理
## webpack启动过程
## webpack-cli源码

## ctos项目打包优化记录
1. 问题
打包构建速度慢:  构建时间 7.25 m
打包输出包体积大: 打包出来总体积15.5MB ， 入口文件 2.57MB

2. 分析方法
vue-cli 使用vue-cli-service build --report，添加report参数后会输出由webpack-bundle-analyze-plugin生成的reportl.html在dist目录下

3. 先提升构建速度

4. 分析 
通过vue inspect > output.js 分析使用的loader， plugin，和使用的优化方案
通过分析 report.html 决定哪些包过于大 ，再进行处理
通过speed-measure-webpack-plugin分析构建时间，分析loader处理时间，plugin处理时间
speed 测试  4 mins, 28.025 secs;

5. 已经使用的优化手段
了解vue-loader-plugin做的工作：资源解析，优化设置



splitChunks 分割代码 
1.chunks：all 表示异步引入和同步引用的包都提取成单独的包，async 默认值，表示异步引用的包提取成单独的包，initial 表示将入口点中同步引入的模块、模块中引入的模块进行拆解并单独打包。
2.多次引用的共享的代码要分包分出来，
3.node_modules中的代码要分包分出来 好处：将通用的库的代码改动很少，与应用程序的代码分离，这样有利于浏览器缓存。
4.体积小于30kb的不分出来。

terser-plugin
dll-plugin

6. vue-cli 已经做了的缓存和并行处理
- cache-loader 会默认为 Vue/Babel/TypeScript 编译开启。文件会缓存在 node_modules/.cache 中。
- thread-loader 会在多核 CPU 的机器上为 Babel/TypeScript 转译开启。

