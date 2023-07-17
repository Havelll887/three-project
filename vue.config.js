// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true

// })

// // 引入等比适配插件
// const px2rem = require('postcss-px2rem')

// // 配置基本大小
// const postcss = px2rem({
// 	// 基准大小 baseSize，需要和rem.js中相同
// 	remUnit: 16
// })

// 公共scss样式
const commonScssPath = '~@/common/css/common.scss';

module.exports = {
    css: {
        loaderOptions: {
            sass: {
                additionalData: `@import "${commonScssPath}";`
                // sassOptions: {
                //     outputStyle: 'expanded'
                // }
            },
        }
    }
}