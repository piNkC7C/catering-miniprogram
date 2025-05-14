// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true
    }]
  ],
  // plugins: [
  //   [
  //     'import',
  //     {
  //       libraryName: '@nutui/nutui-react',
  //       camel2DashComponentName: false,
  //       customName: (name, file) => {
  //         return `@nutui/nutui-react-taro/dist/es/packages/${name.toLowerCase()}`
  //       },
  //       // 自动加载 scss 样式文件
  //       customStyleName: (name) =>
  //         `@nutui/nutui-react-taro/dist/es/packages/${name.toLowerCase()}/style`,
  //       // 自动加载 css 样式文件
  //       // customStyleName: (name) => `@nutui/nutui-react-taro/dist/es/packages/${name.toLowerCase()}/style/css`

  //       // JMAPP 主题
  //       // 自动加载 scss 样式文件
  //       // customStyleName: (name) => `@nutui/nutui-react-taro/dist/es/packages/${name.toLowerCase()}/style-jmapp`,
  //       // 自动加载 css 样式文件
  //       // customStyleName: (name) => `@nutui/nutui-react-taro/dist/es/packages/${name.toLowerCase()}/style-jmapp/css`

  //       // jkrf 端主题
  //       // 自动加载 scss 样式文件
  //       // customStyleName: (name) => `@nutui/nutui-react-taro/dist/es/packages/${name.toLowerCase()}/style-jkrf`,
  //       // 自动加载 css 样式文件
  //       // customStyleName: (name) => `@nutui/nutui-react-taro/dist/es/packages/${name.toLowerCase()}/style-jkrf/css`
  //     },
  //     'nutui-react',
  //   ],
  // ],
}
