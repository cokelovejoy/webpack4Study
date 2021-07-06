# webpack4Study
webpack4 study
## 代码分割和动态import
## 在webpack中使用ESLint
在构建过程中，检查js代码

## webpack打包基础js库和组件
使用webpack打包自定义的库和组件

# webpack构建速度和体积优化策略

## webpack 内置 stats 输出到json文件
```
"build:stats": "webpack --config webpack.prod.js --json > stats.json"
```
## 速度分析 插件 speed-measure-webpack-plugin
分析整个打包总耗时, 包括loader处理，plugin处理的时间

## 体积分析 插件 webpack-bundle-analyzer
1. 分析依赖的第三方模块文件大小
2. 分析业务里面的组件代码大小

## 速度优化-使用高版本的webpack和Node.js
## 速度优化-多进程/多实例： 使用HappyPack解析资源
## 速度优化-多进程/多实例：使用thread-loader解析资源

## 速度优化-多进程/多实例： 并行压缩
- 方法1：parallel-uglify-plugin插件
- 方法2：uglifyjs-webpack-plugin 开启 parallel参数 (webpack3)
- 方法3：terser-webpack-plugin 开启 parallel 参数 (webpack4 推荐)
## 进一步分包：预编译资源模块 - 使用Dllplugin
思路将react，react-dom，redux，react-redux基础包和业务基础包打包成一个文件
方法：使用DLLPlugin进行分包，DllReferencePlugin对manifest.json引用

## 提升二次构建速度：缓存
缓存思路：
- babel-loader 开启缓存
- terser-webpack-plugin 开启缓存
- 使用cache-loader或hard-source-webpack-plugin

## 缩小构建目标
尽可能少构建模块，减少文件查找
- 优化resolve.modules配置 (减少模块搜索层级)
- 优化resolve.mainFields配置 (package.json中main字段指定的入口文件)
- 优化resolve.extension配置 (文件查找，文件后缀名)
- 合理使用alias (指定查找文件的路径)
