import type { UserConfigExport } from "@tarojs/cli";

export default {
  mini: {
    // 暂时禁用 XML 压缩以避免标签解析问题
    // minifyXML: {
    //   collapseWhitespace: true
    // },
    // 启用样式压缩
    optimizeMainPackage: {
      enable: true,
      exclude: []
    },
    // 简化 Tree Shaking 配置
    commonChunks: ['runtime', 'vendors', 'common'],
    // 生产环境 webpack 配置
    webpackChain(chain) {
      // 生产环境代码分割和 Tree Shaking 配置
      chain.optimization
        .splitChunks({
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 0,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all'
            },
            nutui: {
              test: /[\\/]node_modules[\\/]@nutui[\\/]/,
              name: 'nutui',
              priority: 10,
              chunks: 'all'
            },
            taro: {
              test: /[\\/]node_modules[\\/]@tarojs[\\/]/,
              name: 'taro',
              priority: 5,
              chunks: 'all'
            }
          }
        })
        // 启用 Tree Shaking 但保持更安全的配置
        .usedExports(true)
        // 暂时禁用激进的 sideEffects 设置以避免空白页面问题
        .sideEffects(true)
        
      // 简化代码分割以避免空白页面问题
      chain.optimization.splitChunks({
        cacheGroups: {
          default: false,
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          }
        }
      })
    }
  },
  h5: {
    /**
     * WebpackChain 插件配置
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    webpackChain (chain) {
      // 生产环境优化（修复空白页面问题）
      chain.optimization
        .minimize(true)
        .concatenateModules(true)
        // 改为更安全的 sideEffects 设置
        .sideEffects(true)
        .usedExports(true)
      
      /**
       * 如果 h5 端编译后体积过大，可以使用 webpack-bundle-analyzer 插件对打包体积进行分析。
       * @docs https://github.com/webpack-contrib/webpack-bundle-analyzer
       */
      // chain.plugin('analyzer')
      //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
      /**
       * 如果 h5 端首屏加载时间过长，可以使用 prerender-spa-plugin 插件预加载首页。
       * @docs https://github.com/chrisvfritz/prerender-spa-plugin
       */
      // const path = require('path')
      // const Prerender = require('prerender-spa-plugin')
      // const staticDir = path.join(__dirname, '..', 'dist')
      // chain
      //   .plugin('prerender')
      //   .use(new Prerender({
      //     staticDir,
      //     routes: [ '/pages/index/index' ],
      //     postProcess: (context) => ({ ...context, outputPath: path.join(staticDir, 'index.html') })
      //   }))
    }
  }
} satisfies UserConfigExport
