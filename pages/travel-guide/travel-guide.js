const app = getApp()

Page({
  data: {
    cityName: '',
    selectedCategory: '全部',
    searchKeyword: '',
    guides: [],
    loading: false,
    page: 1,
    pageSize: 10,
    hasMore: true
  },

  onLoad: function() {
    this.checkCityAndLoad()
  },

  onShow: function() {
    this.checkCityAndLoad()
  },

  checkCityAndLoad: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (!selectedCity) {
      wx.showToast({
        title: '请先选择城市',
        icon: 'none',
        complete: () => {
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/city-select/city-select'
            })
          }, 1500)
        }
      })
      return
    }

    this.setData({
      cityName: selectedCity.city
    })

    this.loadGuides(true)
  },

  // 分类切换
  onCategoryTap: function(e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      selectedCategory: category,
      page: 1,
      guides: []
    })
    this.loadGuides(true)
  },

  // 搜索输入
  onSearchInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    })
  },

  // 搜索确认
  onSearch: function() {
    this.setData({
      page: 1,
      guides: []
    })
    this.loadGuides(true)
  },

  // 加载攻略列表
  loadGuides: function(refresh = false) {
    if (this.data.loading) return

    const { cityName, selectedCategory, searchKeyword, page, pageSize } = this.data

    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getTravelGuides',
      data: {
        city: cityName,
        category: selectedCategory === '全部' ? '' : selectedCategory,
        keyword: searchKeyword,
        page: page,
        pageSize: pageSize
      },
      success: res => {
        if (res.result && res.result.success) {
          const newGuides = res.result.data || []
          this.setData({
            guides: refresh ? newGuides : [...this.data.guides, ...newGuides],
            hasMore: newGuides.length === pageSize,
            page: refresh ? 2 : page + 1
          })
        } else {
          wx.showToast({
            title: res.result?.message || '获取数据失败',
            icon: 'none'
          })
        }
      },
      fail: err => {
        console.error('获取攻略失败:', err)
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      },
      complete: () => {
        this.setData({ loading: false })
      }
    })
  },

  // 点击攻略
  onGuideTap: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/guide-detail/guide-detail?id=${id}`
    })
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      page: 1,
      guides: []
    })
    this.loadGuides(true)
    wx.stopPullDownRefresh()
  },

  // 上拉加载更多
  onReachBottom: function() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadGuides(false)
    }
  },

  // 跳转到发布页面
  goToPublish: function() {
    wx.navigateTo({
      url: '/pages/publish-guide/publish-guide'
    })
  }
})
