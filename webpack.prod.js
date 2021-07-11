const glob = require("glob"); // 处理文件目录
const path = require("path"); // 路径处理
const webpack = require("webpack"); // webpack
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 提取css到一个单独的文件的插件
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); // 压缩由mini-css-extract-plugin插件输出的css文件
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 生成一个html文件
const CleanWebpackPlugin = require("clean-webpack-plugin"); // 自动清除构建目录
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin"); // 分离公共包，如Vue，VueRouter，Vuex，React，ReactDOM，使用cdn引入
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
// ! 多页面打包 生成entry 和 htmlWebpackPlugin 配置
// ! 多页面 注意src下文件组织的格式src/index/index.js ; src/search/index.js
// ! 原则：一个页面内的资源文件放在这个页面自己的文件夹下
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = []; // htmlwebpackplugin 配置，一个文件对应一个配置
  const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js")); // 解析src下面的文件目录，找出多页面入口

  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index]; // webpack4study/src/index/index.js
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    const pageName = match && match[1]; // 多页面的文件名
    entry[pageName] = entryFile;
    // 一个页面对应一个入口文件，对应一个htmlwebpackplugin的配置
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        inlineSource: ".css$",
        template: path.join(__dirname, `src/${pageName}/index.html`), // 模板html
        filename: `${pageName}.html`, // 输出html
        chunks: ["vendors", "commons", pageName], // ! vendors 为当前这个页面需要引入的公共包名 对应了splitChunk 提取的公共包名
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true, // 删除空格
          preserveLineBreaks: false, // 保留换行符
          minifyCSS: true, //  压缩css
          minifyJS: true, // 压缩js
          removeComments: false, // 移除注释
        },
      })
    );
  });
  return {
    entry,
    htmlWebpackPlugins,
  };
};
const { entry, htmlWebpackPlugins } = setMPA();
module.exports = {
  entry: entry, // 打包入口文件， 多页面
  output: {
    // 打包输出文件
    filename: "[name]_[chunkhash:8].js",
    path: path.join(__dirname, "dist"),
  },
  mode: "production",
  module: {
    rules: [
      { test: /\.js$/, use: "babel-loader" }, // 处理js文件
      {
        test: /\.css$/, // 处理css文件
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.less$/, // 处理less文件
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader", // autoprefixer 自动为css3属性增加浏览器前缀
            options: {
              plugins: () => [
                require("autoprefixer")({
                  overrideBrowserslist: ["last 2 versions", ">1%"],
                }),
              ],
            },
          },
          "less-loader",
          {
            loader: "px2rem-loader", // 处理px转换成rem的loader
            options: {
              remUnit: 75,
              remPrecision: 8,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/, // 处理图片
        use: [
          {
            loader: "file-loader",
            options: {
              name: "name_[hash:8].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash:8][ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 插件提取css 到一个css文件
      filename: "[name]_[contenthash:8].css",
    }),
    new OptimizeCssAssetsPlugin({
      // 压缩.css文件，由MiniCssExtractPlugin提取的css文件
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano"),
    }),
    new CleanWebpackPlugin(), // 打包构建前自动清除目录
    // new HtmlWebpackExternalsPlugin({
    //   // 原理：配置中的包，不打包 ，通过script引入到输出的html中。
    //   // 一般分离出公共包如第三方包React，ReactDOM，Vue，Vuex，VueRouter，通过script引入
    //   externals: [
    //     {
    //       module: "react",
    //       entry: "https://11.url.cn/now/lib/16.2.0/react.min.js", // 本地文件或者CDN文件
    //       global: "React",
    //     },
    //     {
    //       module: "react-dom",
    //       entry: "https://11.url.cn/now/lib/16.2.0/react-dom.min.js",
    //       global: "ReactDOM",
    //     },
    //   ],
    // }),
    new FriendlyErrorsWebpackPlugin(),
  ].concat(htmlWebpackPlugins),
  //splitChunks插件作用提取公共代码，防止代码被重复打包，拆分过大的js文件，合并零散的js文件。
  // chunks: 决定提取哪些模块
  //     all:       所有模块打包到同一个文件
  //     initial:   提取同步加载和异步加载模块，如果xxx在项目中异步加载了，也同步加载了，那么xxx这个模块会被提取两次，分别打包到不同的文件中。
  //     默认async: 只提取异步加载的模块出来打包到一个文件中， 异步加载的模块：通过import('xxx')或require(['xxx'],() =>{})加载的模块。
  // optimization: {
  //   splitChunks: {
  //     minSize: 0,
  //     cacheGroups: {
  //       commons: {
  //        test: /(react|react-dom)/,  // 匹配 react react-dom 提取出来，作为公共包
  //        name: 'vendors',            // 打包出来的文件名
  //        chunks: 'all',
  //       }
  //     }
  //   }
  // }
  optimization: {
    splitChunks: {
      minSize: 0, // 生成包的最小体积，默认为 最小30kb，小于30kb不打包，设置为0 ，则只要引用就要打包
      cacheGroups: {
        commons: {
          name: "commons", // 打包出来的文件名, 这个名字需要配置到htmlwebpackplugin的chunks中，才会被引入到html中
          chunks: "all",
          minChunks: 2, // 打包条件引用2次以上就打包，否则不打包
        },
      },
    },
  },
  stats: "errors-only", // 只有出错时才显示日志
};
