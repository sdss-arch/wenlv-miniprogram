const app = getApp()

Page({
  data: {
    guide: {},
    loading: true,
    isFavorited: false
  },

  onLoad: function(options) {
    const { id } = options
    if (!id) {
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

    this.loadGuideDetail(id)
    this.checkFavorite(id)
  },

  // 加载攻略详情
  loadGuideDetail: function(id) {
    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getGuideDetail',
      data: {
        id: id
      },
      success: res => {
        if (res.result && res.result.success) {
          const guide = res.result.data
          // 格式化日期
          if (guide.createTime) {
            const date = new Date(guide.createTime)
            guide.createTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
          }
          this.setData({
            guide: guide,
            loading: false
          })
          // 增加浏览量
          this.incrementViewCount(id)
        } else {
          wx.showToast({
            title: res.result?.message || '攻略不存在',
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
        console.error('获取攻略详情失败:', err)
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        this.setData({ loading: false })
      }
    })
  },

  // 增加浏览量
  incrementViewCount: function(id) {
    wx.cloud.callFunction({
      name: 'incrementViewCount',
      data: {
        id: id
      }
    })
  },

  // 检查是否已收藏
  checkFavorite: function(id) {
    const favorites = wx.getStorageSync('favorites') || []
    this.setData({
      isFavorited: favorites.includes(id)
    })
  },

  // 切换收藏状态
  toggleFavorite: function() {
    const { guide, isFavorited } = this.data
    let favorites = wx.getStorageSync('favorites') || []

    if (isFavorited) {
      favorites = favorites.filter(item => item !== guide._id)
      wx.showToast({
        title: '取消收藏',
        icon: 'none'
      })
    } else {
      favorites.push(guide._id)
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      })
    }

    wx.setStorageSync('favorites', favorites)
    this.setData({ isFavorited: !isFavorited })
  },

  // 分享
  shareGuide: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  // 预览图片
  previewImage: function(e) {
    const url = e.currentTarget.dataset.url
    const images = this.data.guide.images || []
    wx.previewImage({
      current: url,
      urls: images
    })
  },

  // 分享配置
  onShareAppMessage: function() {
    const { guide } = this.data
    return {
      title: guide.title,
      path: `/pages/guide-detail/guide-detail?id=${guide._id}`,
      imageUrl: guide.coverImage
    }
  },

  onShareTimeline: function() {
    const { guide } = this.data
    return {
      title: guide.title,
      query: `id=${guide._id}`,
      imageUrl: guide.coverImage
    }
  }
})
