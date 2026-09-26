// ====================================================================
// 环境配置：优先读取 config/env.js（本地真实配置，不入库），
// 不存在时回退到 config/env.example.js 模板默认值。
// 使用前请复制 config/env.example.js 为 config/env.js 并填入真实值。
// ====================================================================
const envConfig = require('./config/env.example.js')
try {
  Object.assign(envConfig, require('./config/env.js'))
} catch (e) {
  // config/env.js 不存在（如新克隆仓库），使用模板默认配置
}

const mock = require('./utils/mock/index.js')

App({
  onLaunch: function () {
    // 本地缓存可临时覆盖开关，方便真机/开发者工具切换
    let mockEnabled = envConfig.USE_MOCK
    const mockFlag = wx.getStorageSync('mockEnabled')
    if (mockFlag === '1') mockEnabled = true
    if (mockFlag === '0') mockEnabled = false

    if (mockEnabled) {
      // 先安装模拟拦截器，确保后续登录等调用直接走本地数据
      mock.install()
    }

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: envConfig.CLOUD_ENV_ID,
        traceUser: true
      })
    }

    this.checkUserLogin()
  },

  checkUserLogin: function() {
    const userInfo = wx.getStorageSync('userInfo')
    const selectedCity = wx.getStorageSync('selectedCity')

    if (!userInfo) {
      this.silentLogin()
    }

    if (!selectedCity) {
      wx.redirectTo({
        url: '/pages/city-select/city-select'
      })
    }
  },

  silentLogin: function() {
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        if (res.result && res.result.success) {
          wx.setStorageSync('userInfo', res.result.userInfo)
          wx.setStorageSync('openid', res.result.openid)
        }
      },
      fail: err => {
        console.error('登录失败', err)
      }
    })
  },

  globalData: {
    userInfo: null,
    selectedCity: null
  }
})
