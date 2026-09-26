const app = getApp()

Page({
  data: {
    cityName: '',
    selectedCategory: '全部',
    searchKeyword: '',
    activities: [],
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

    this.loadActivities(true)
  },

  // 分类切换
  onCategoryTap: function(e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      selectedCategory: category,
      page: 1,
      activities: []
    })
    this.loadActivities(true)
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
      activities: []
    })
    this.loadActivities(true)
  },

  // 加载活动列表
  loadActivities: function(refresh = false) {
    if (this.data.loading) return

    const { cityName, selectedCategory, searchKeyword, page, pageSize } = this.data

    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getActivities',
      data: {
        city: cityName,
        category: selectedCategory === '全部' ? '' : selectedCategory,
        keyword: searchKeyword,
        page: page,
        pageSize: pageSize
      },
      success: res => {
        if (res.result && res.result.success) {
          const newActivities = res.result.data || []
          // 格式化数据
          const formattedActivities = newActivities.map(item => {
            // 格式化时间
            if (item.startTime) {
              const date = new Date(item.startTime)
              item.startTime = `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
            }
            // 处理报名用户头像（最多显示3个）
            if (item.joinUsers && item.joinUsers.length > 0) {
              item.joinUsers = item.joinUsers.slice(0, 3)
            } else {
              item.joinUsers = []
            }
            return item
          })
          
          this.setData({
            activities: refresh ? formattedActivities : [...this.data.activities, ...formattedActivities],
            hasMore: newActivities.length === pageSize,
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
        console.error('获取活动失败:', err)
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

  // 点击活动
  onActivityTap: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/activity-detail/activity-detail?id=${id}`
    })
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      page: 1,
      activities: []
    })
    this.loadActivities(true)
    wx.stopPullDownRefresh()
  },

  // 上拉加载更多
  onReachBottom: function() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadActivities(false)
    }
  },

  // 跳转到发布活动页面
  goToPublishActivity: function() {
    wx.navigateTo({
      url: '/pages/publish-activity/publish-activity'
    })
  }
})
