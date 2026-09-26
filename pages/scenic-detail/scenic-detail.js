Page({
  data: {
    scenic: {}
  },

  onLoad: function(options) {
    const { id } = options
    if (id) {
      this.loadScenicDetail(id)
    }
  },

  loadScenicDetail: function(id) {
    wx.cloud.callFunction({
      name: 'getScenicDetail',
      data: { id },
      success: res => {
        if (res.result && res.result.success) {
          this.setData({
            scenic: res.result.data
          })
        }
      },
      fail: err => {
        console.error('获取景点详情失败', err)
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    })
  },

  previewImage: function(e) {
    const src = e.currentTarget.dataset.src
    const urls = this.data.scenic.images
    wx.previewImage({
      urls: urls,
      current: src
    })
  }
})
