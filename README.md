# webpack4Study

webpack4 study

## webpack 核心概念

- entry
- output
- loaders
- plugins

# webpack 基础-资源解析

## webpack 解析 ES6 和 JSX

## webpack 解析 CSS，Less 和 Sass

## webpack 解析图片和字体

## webpack 文件监听

## webpack 热更新（HMR）

## webpack 文件指纹策略(hash, chunkhash, contenthash)

## webpack HTML，CSS，JavaScript 代码压缩

# webpack 进阶-构建项目

## webpack 自动清理构建目录的产物

## webpack PostCSS 插件 autoprefixer 自动补齐 CSS3 前缀

## webpack 移动端 CSS px 自动转换成 rem

## webpack 静态资源内联

## webpack 多页面打包方案

## webpack 提取公共资源

## webpack Tree Shaking 的使用和原理

## webpack Scope Hoisting 的使用和原理

## webpack 代码分割和动态 import

## webpack 在 webpack 中使用 ESLint

## webpack 打包基础 js 库和组件

## webpack 实现 SSR 打包

## webpack 优化构建时命令行的显示日志

## webpack 构建异常和中断处理

# webpack 构建速度和体积优化策略

## webpack 使用内置的 stats

```bash
"scripts": {
    "build:stats": "webpack --config webpack.prod.js --json > stats.json"
}
```

## webpack 速度分析 插件 speed-measure-webpack-plugin

分析整个打包总耗时, 包括 loader 处理，plugin 处理的时间

## webpack 体积分析 插件 webpack-bundle-analyzer

1. 分析依赖的第三方模块文件大小
2. 分析业务里面的组件代码大小

## webpack 速度优化-使用高版本的 webpack 和 Node.js

## webpack 速度优化-多进程/多实例： 使用 HappyPack 解析资源

## webpack 速度优化-多进程/多实例：使用 thread-loader 解析资源

## webpack 速度优化-多进程/多实例： 并行压缩代码

- 方法 1：parallel-uglify-plugin 插件
- 方法 2：uglifyjs-webpack-plugin 开启 parallel 参数 (webpack3)
- 方法 3：terser-webpack-plugin 开启 parallel 参数 (webpack4 推荐)

## webpack 速度优化-设置externals
使用 html-webpack-externals-plugin 将基础包通过cdn引入，不打入bundle中。
## webpack 速度优化-预编译资源模块 - 使用 Dllplugin

思路将 react，react-dom，redux，react-redux 基础包和业务基础包打包成一个文件
方法：使用 DLLPlugin 进行分包，DllReferencePlugin 对 manifest.json 引用

## webpack 速度优化-利用缓存提升二次构建速度

缓存思路：

- babel-loader 开启缓存
- terser-webpack-plugin 开启缓存
- 使用 cache-loader 或 hard-source-webpack-plugin

## webpack 速度优化-缩小构建目标，减少文件查找的层次
尽可能少构建模块，减少文件查找
比如 babel-loader 不解析 node_modules

- 优化 resolve.modules 配置 (减少模块搜索层级)
- 优化 resolve.mainFields 配置 (package.json 中 main 字段指定的入口文件)
- 优化 resolve.extension 配置 (文件查找，文件后缀名)
- 合理使用 alias (指定查找文件的路径)

## webpack 体积优化-使用 Scope Hoisting

## webpack 体积优化-使用 Tree Shaking 擦除无用的 javaScript 和 CSS

## webpack 体积优化-公共资源分离

## webpack 体积优化-图片压缩

## webpack 体积优化-使用动态 Polyfill

# webpack 原理

## webpack 启动过程

## webpack-cli 源码

# webpack 4 与 webpack 3 差别

1. webpack4 必须安装 webpack-cli
2. webpack4 中设置加了一个 mode 配置，只有两个值 development | production，对不同的环境会提供不同的一些默认配置
3. 拆分单独模块使用 optimization.splitChunks 替代了 CommonsChunkPlugin
4. 提取单个 css 文件使用 MiniCssExtractPlugin 替代 extract-text-webpack-plugin
5. 如果是开发 vue 项目，基础配置文件必须引入 vue-loader/lib/plugin
6. 不在使用 UglifyJsPlugin 压缩 js 文件，而是通过 optimization.minimize 设置为 true 来压缩代码，mode 为 production 时，其默认为 ture
7. 引入了 Tree Shaking，不打包无用代码
8. MiniCssExtractPlugin 仅仅会把 js 中的 css 提取到单独的 css 文件中，但并不会对其进行压缩，压缩 css 需要单独使用 optimize-css-assets-webpack-plugin，并在 optimization 选项中进行配置

```
optimization: {
    minimizer: [
      <!--压缩css-->
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/
      })
    ]
}
```

9. webpack4 中 production 模式自带优化项
   Tree Shaking (去除无效的 js 代码)，只对 使用 ES6 导入的 js 代码有效。
   Scope hoisting (作用域提升)，尽可能把打散的模块合并到一个函数中去，只有那些被引用了一次的模块才能被合并，避免造成冗余。只对 使用 ES6 导入的 js 代码有效。
   production 模式下，默认会使用了 SplitChunksPlugin 对 js 代码进行压缩和提取。

## ctos 项目打包优化记录

1. 问题
   打包构建速度慢: 构建时间 7.25 m
   打包输出包体积大: 打包出来总体积 15.5MB ， 入口文件 2.57MB

2. 分析方法
   vue-cli 使用 vue-cli-service build --report，添加 report 参数后会输出由 webpack-bundle-analyze-plugin 生成的 reportl.html 在 dist 目录下

通过 vue inspect > output.js --mode production 分析生产环境使用的 loader， plugin，和使用的优化方案
通过分析 report.html 决定哪些包过于大 ，再进行处理, 处理重复引用的包，提取出来
通过 speed-measure-webpack-plugin 分析构建时间，分析 loader 处理时间，plugin 处理时间
speed 测试 4 mins, 28.025 secs;

3. 已经使用的优化手段
   了解 vue-loader-plugin 做的工作：资源解析，优化设置

splitChunks 分割代码
1.chunks：all 表示异步引入和同步引用的包都提取成单独的包，async 默认值，表示异步引用的包提取成单独的包，initial 表示将入口点中同步引入的模块、模块中引入的模块进行拆解并单独打包。 2.多次引用的共享的代码要分包分出来，
3.node_modules 中的代码要分包分出来 好处：将通用的库的代码改动很少，与应用程序的代码分离，这样有利于浏览器缓存。 4.体积小于 30kb 的不分出来。

terser-plugin
dll-plugin

4. vue-cli 已经做了的缓存和并行处理

- cache-loader 会默认为 Vue/Babel/TypeScript 编译开启。文件会缓存在 node_modules/.cache 中。
- thread-loader 会在多核 CPU 的机器上为 Babel/TypeScript 转译开启。

5. 优化方案

- 减少使用的 loader，css 预处理器 loader，使用了 sass，就不要配置其他的 loader，尽可能只使用一种 css 预处理器。

- 处理图片的 loader，一般会用到 file-loader,url-loader,img-loader. 但是 url-loader 官方声明：url-loader works like file-loader，那就不要再使用 file-loader 来配置(除非图片过大，超出 url-loader 中配置的 limit 值)。

- 动态导入(懒加载)
  webpack 默认是允许 import 语法动态导入的，但是需要 babel 的插件支持，即 在.babelrc 配置文件中添加@babel/plugin-syntax-dynamic-import 插件。
  动态导入的最大好处就是实现了懒加载，用到哪个模块才会加载哪个模块，可以提高 SPA 应用程序的首屏加载速度。

- noParse
  在引入一些第三方模块时，例如 jQuery，element-ui 等，我们知道其内部不会再依赖其他模块，因为我们最终用到的只是一个单独的 js 文件，所以此时 webpack 如果再去解析 jQuery 内部的依赖关系，是非常耗时的。

可以在 webpack 配置文件中的 module 节点下加上 noParse，并配置正则来告诉 webpack，我不需要再去解析这些模块。

```
module: {
    noParse: /jquery|element-ui/
}
注意
element-ui如果 按需引入，注意，这里不能使用 noParse 来做element-ui的优化，因为按需引入的element，内部会有一系列依赖关系，使用noParse，webpack并不会去解析其依赖
```

- IgnorePlugin
  项目中使用了 element-ui 和 moment.js，这两个插件内部都有很多语言包，尤其是 moment.js。而语言包打包时会比较占用空间，而我们的项目只需要中文语言包，这时就应该忽略掉所有的语言包，改为按需引入，从而使得构建效率更高，打包生成的文件更小.

首先找到第三方库中依赖的语言包是什么（在第三方库中 package.json 文件中，找到主入口文件，在入口文件中找到引用的语言包）.

使用 webpack.IgnorePlugin 插件忽略其依赖

```js
plugins: [
    new webpack.IgnorePlugin(/^\.\/locale/, /moment/);
]
```

- 减少文件搜索的范围提高性能
  webpack 通过配置文件，将项目中引入的第三方和公共模块进行提取，每一个提取出的模块都有一个 id，在引用到该模块的主文件中，通过 id 进行映射查找。所以如果能提升文件查找速度，对 webpack 打包性能会有一定提升。

resolve.modules 通过配置，告诉 webpack 在解析模块时应该搜索哪些目录。

```
resolve: {
    modules: [path.resolve(__dirname, 'src', 'node_modules')]
}
```

在配置 loader 时，通过配置 include 和 exclude 更精确指定要处理的目录，这可以减少不必要的遍历，从而减少性能损失。

- 使用 dll 预打包
- 分离第三方库，使用 cdn 引入
