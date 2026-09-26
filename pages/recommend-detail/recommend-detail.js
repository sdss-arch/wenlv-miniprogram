Page({
  data: {
    recommend: {}
  },

  onLoad: function(options) {
    const { id } = options
    if (id) {
      this.loadRecommendDetail(id)
    }
  },

  loadRecommendDetail: function(id) {
    wx.cloud.callFunction({
      name: 'getRecommendDetail',
      data: { id },
      success: res => {
        if (res.result && res.result.success) {
          this.setData({
            recommend: res.result.data
          })
        }
      },
      fail: err => {
        console.error('获取推荐详情失败', err)
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    })
  },

  previewImage: function(e) {
    const src = e.currentTarget.dataset.src
    const urls = this.data.recommend.images
    wx.previewImage({
      urls: urls,
      current: src
    })
  }
})
