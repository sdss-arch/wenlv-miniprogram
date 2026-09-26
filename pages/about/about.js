Page({
  data: {

  },

  onLoad: function() {

  },

  // 复制客服电话
  copyPhone: function() {
    wx.setClipboardData({
      data: '18031012843',
      success: () => {
        wx.showToast({
          title: '电话已复制',
          icon: 'success'
        })
      }
    })
  },

  // 复制邮箱
  copyEmail: function() {
    wx.setClipboardData({
      data: '3527645569@qq.com',
      success: () => {
        wx.showToast({
          title: '邮箱已复制',
          icon: 'success'
        })
      }
    })
  }
})
