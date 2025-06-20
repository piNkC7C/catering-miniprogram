import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import devConfig from './dev'
import prodConfig from './prod'

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport = {
    // sass: {
    //   data: '@import "@nutui/nutui-react-taro/dist/styles/variables.scss";'
    // },
    projectName: 'tao-miniprogram',
    date: '2025-5-12',
    // designWidth: 750,
    // deviceRatio: {
    //   640: 2.34 / 2,
    //   750: 1,
    //   375: 2,
    //   828: 1.81 / 2
    // },
    // 
    designWidth(input) {
      // 配置 NutUI 375 尺寸
      if (typeof input === 'object' && input && 'file' in input && typeof input.file === 'string') {
        if (input.file.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
          return 375
        }
      }
      // 全局使用 Taro 默认的 750 尺寸
      return 750
    },
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      828: 1.81 / 2,
      375: 2 / 1,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [
      '@tarojs/plugin-http', 
      '@tarojs/plugin-html'
    ],
    defineConstants: {
      LOCATION_APIKEY: JSON.stringify('PJ3BZ-BOPWZ-IPHXC-76G2M-OTHXS-FGF4B'),
    },
    copy: {
      patterns: [
      ],
      options: {
      }
    },
    framework: 'react',
    // 在 Taro 配置文件中关闭 prebundle 及 cache解决小程序项目运行时出现「找不到模板」的错误提示
    compiler: {
      type: 'webpack5',
      prebundle: {
        enable: false,
        exclude: ['@nutui/nutui-react-taro', '@nutui/icons-react-taro'],
      },
    },
    cache: {
      enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
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
      postcss: {
        pxtransform: {
          enable: true,
          config: {
            // 包含 `nut-` 的类名选择器中的 px 单位不会被解析
            selectorBlackList: ['nut-']
          }
        },
        url: {
          enable: true,
          config: {
            limit: 1024 // 设定转换尺寸上限
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      webpackChain(chain) {
        // 检查是否为生产环境
        const isProduction = process.env.NODE_ENV === 'production'
        
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
        
        // 配置代码分割和 Tree Shaking（修复空白页面问题）
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
        
        // 在生产环境中禁用过度优化
        if (isProduction) {
          // 禁用代码分割以避免空白页面问题
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

        // 添加 Bundle Analyzer（可选，用于分析包大小）
        if (process.env.ANALYZE) {
          const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
          chain.plugin('analyzer').use(BundleAnalyzerPlugin)
        }
      }
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js'
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
      }
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  }
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
