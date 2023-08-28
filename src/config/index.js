/**
 * 环境配置：
 * 开发环境
 * 测试环境
 * 线上环境
 */

// 当前的环境，取不到默认开发环境
const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
    // 线上环境
    development: {
        baseApi: '/api',
        mockApi: 'https://www.fastmock.site/mock/a16b17233e253ffe50e9f27bb831c115/api',
    },
    text: {
        baseApi: '//test.future.com/api',
        mockApi: 'https://www.fastmock.site/mock/a16b17233e253ffe50e9f27bb831c115/api',
    },
    pro: {
        baseApi: '//future.com/api',
        mockApi: 'https://www.fastmock.site/mock/a16b17233e253ffe50e9f27bb831c115/api',
    }
}

export default {
    env,
    mock: true,
    ...EnvConfig[env]
}