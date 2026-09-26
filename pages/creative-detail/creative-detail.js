Page({
  data: {
    creative: {}
  },

  onLoad: function(options) {
    const { id } = options
    if (id) {
      this.loadCreativeDetail(id)
    }
  },

  loadCreativeDetail: function(id) {
    wx.cloud.callFunction({
      name: 'getCreativeDetail',
      data: { id },
      success: res => {
        if (res.result && res.result.success) {
          this.setData({
            creative: res.result.data
          })
        }
      },
      fail: err => {
        console.error('获取文创详情失败', err)
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    })
  },

  previewImage: function(e) {
    const src = e.currentTarget.dataset.src
    const urls = this.data.creative.images
    wx.previewImage({
      urls: urls,
      current: src
    })
  }
})
