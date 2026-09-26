const app = getApp()

Page({
  data: {
    cityName: '',
    activeTab: 'red', // red 或 black
    selectedCategory: '全部',
    searchKeyword: '',
    rankingList: [],
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

    this.loadRankingList(true)
  },

  // 切换榜单
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab
    if (tab === this.data.activeTab) return

    this.setData({
      activeTab: tab,
      page: 1,
      rankingList: [],
      selectedCategory: '全部',
      searchKeyword: ''
    })
    this.loadRankingList(true)
  },

  // 分类切换
  onCategoryTap: function(e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      selectedCategory: category,
      page: 1,
      rankingList: []
    })
    this.loadRankingList(true)
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
      rankingList: []
    })
    this.loadRankingList(true)
  },

  // 加载榜单列表
  loadRankingList: function(refresh = false) {
    if (this.data.loading) return

    const { cityName, activeTab, selectedCategory, searchKeyword, page, pageSize } = this.data

    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getRankingList',
      data: {
        city: cityName,
        type: activeTab, // red 或 black
        category: selectedCategory === '全部' ? '' : selectedCategory,
        keyword: searchKeyword,
        page: page,
        pageSize: pageSize
      },
      success: res => {
        if (res.result && res.result.success) {
          const newList = res.result.data || []
          // 格式化数据
          const formattedList = newList.map(item => {
            // 格式化更新时间
            if (item.updateTime) {
              const date = new Date(item.updateTime)
              item.updateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            }
            return item
          })
          
          this.setData({
            rankingList: refresh ? formattedList : [...this.data.rankingList, ...formattedList],
            hasMore: newList.length === pageSize,
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
        console.error('获取榜单失败:', err)
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

  // 点击卡片
  onCardTap: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/ranking-detail/ranking-detail?id=${id}&type=${this.data.activeTab}`
    })
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      page: 1,
      rankingList: []
    })
    this.loadRankingList(true)
    wx.stopPullDownRefresh()
  },

  // 上拉加载更多
  onReachBottom: function() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadRankingList(false)
    }
  },

  // 跳转到发布红黑榜页面
  goToPublishRanking: function() {
    wx.navigateTo({
      url: '/pages/publish-ranking/publish-ranking'
    })
  },

  // 预览卡片图片
  previewCardImage: function(e) {
    const url = e.currentTarget.dataset.url
    const images = e.currentTarget.dataset.images
    wx.previewImage({
      urls: images,
      current: url
    })
  }
})
