const app = getApp()

Page({
  data: {
    person: {},
    loading: true
  },

  onLoad: function(options) {
    const { id, type } = options
    if (!id || !type) {
      wx.showToast({
        title: '参数错误',
        icon: 'none',
        complete: () => {
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      })
      return
    }

    this.loadPersonDetail(id)
  },

  loadPersonDetail: function(id) {
    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getPersonDetail',
      data: {
        id: id
      },
      success: res => {
        if (res.result && res.result.success) {
          this.setData({
            person: res.result.data,
            loading: false
          })
        } else {
          wx.showToast({
            title: res.result?.message || '人物不存在',
            icon: 'none',
            complete: () => {
              setTimeout(() => {
                wx.navigateBack()
              }, 1500)
            }
          })
        }
      },
      fail: err => {
        console.error('获取人物详情失败:', err)
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        this.setData({ loading: false })
      }
    })
  }
})
