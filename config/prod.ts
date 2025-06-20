import type { UserConfigExport } from "@tarojs/cli";

export default {
  mini: {
    // 开启主包优化
    optimizeMainPackage: {
      enable: true,
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
