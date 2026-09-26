Page({
  data: {
    cityName: '',
    scenicList: [],
    allScenicList: [],
    loading: false,
    hasMore: true,
    searchKeyword: '',
    selectedCategory: '全部',
    categories: ['全部', '自然风光', '人文古迹', '主题公园', '博物馆', '其他']
  },

  onLoad: function() {
    this.loadCityData()
    this.loadScenicData()
  },

  onShow: function() {
    this.loadScenicData()
  },

  loadCityData: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (selectedCity) {
      this.setData({
        cityName: selectedCity.city
      })
    }
  },

  loadScenicData: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (!selectedCity) return

    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getScenics',
      data: {
        city: selectedCity.city
      },
      success: res => {
        if (res.result && res.result.success) {
          const list = res.result.data || []
          this.setData({
            allScenicList: list,
            scenicList: list
          })
          this.filterScenicList()
        }
      },
      complete: () => {
        this.setData({ loading: false })
      }
    })
  },

  // 搜索输入
  onSearchInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    })
  },

  // 搜索确认
  onSearch: function() {
    this.filterScenicList()
  },

  // 分类切换
  onCategoryTap: function(e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      selectedCategory: category
    })
    this.filterScenicList()
  },

  // 筛选景点列表
  filterScenicList: function() {
    const { allScenicList, searchKeyword, selectedCategory } = this.data
    let filteredList = allScenicList

    // 按分类筛选
    if (selectedCategory !== '全部') {
      filteredList = filteredList.filter(item => item.category === selectedCategory)
    }

    // 按关键词搜索
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      filteredList = filteredList.filter(item => 
        item.name.toLowerCase().includes(keyword) ||
        (item.brief && item.brief.toLowerCase().includes(keyword))
      )
    }

    this.setData({
      scenicList: filteredList
    })
  },

  onScenicTap: function(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/scenic-detail/scenic-detail?id=' + id
    })
  },

  // 跳转到发布景点页面
  goToPublishScenic: function() {
    wx.navigateTo({
      url: '/pages/publish-scenic/publish-scenic'
    })
  }
})
