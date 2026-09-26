const app = getApp()

Page({
  data: {
    currentTab: 'martyr',
    martyrList: [],
    celebrityList: [],
    filteredMartyrList: [],
    filteredCelebrityList: [],
    loading: false,
    cityName: '',
    searchKeyword: ''
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

    this.loadData()
  },

  loadData: function() {
    this.loadMartyrData()
    this.loadCelebrityData()
  },

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: tab
    })
    // 切换标签时重新应用搜索过滤
    this.applyFilter()
  },

  // 搜索输入
  onSearchInput: function(e) {
    const keyword = e.detail.value
    this.setData({
      searchKeyword: keyword
    })
    this.applyFilter()
  },

  // 搜索确认
  onSearch: function() {
    this.applyFilter()
  },

  // 清除搜索
  clearSearch: function() {
    this.setData({
      searchKeyword: ''
    })
    this.applyFilter()
  },

  // 应用搜索过滤
  applyFilter: function() {
    const { searchKeyword, martyrList, celebrityList } = this.data
    const keyword = searchKeyword.toLowerCase().trim()

    if (!keyword) {
      this.setData({
        filteredMartyrList: martyrList,
        filteredCelebrityList: celebrityList
      })
      return
    }

    const filteredMartyrList = martyrList.filter(item =>
      item.name.toLowerCase().includes(keyword)
    )

    const filteredCelebrityList = celebrityList.filter(item =>
      item.name.toLowerCase().includes(keyword)
    )

    this.setData({
      filteredMartyrList,
      filteredCelebrityList
    })
  },

  loadMartyrData: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (!selectedCity) return

    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getHallOfFame',
      data: {
        city: selectedCity.city,
        type: 'martyr'
      },
      success: res => {
        console.log('烈士数据:', res)
        if (res.result && res.result.success) {
          const martyrList = res.result.data || []
          this.setData({ martyrList })
          this.applyFilter()
        } else {
          wx.showToast({
            title: res.result?.message || '获取数据失败',
            icon: 'none'
          })
        }
      },
      fail: err => {
        console.error('获取烈士数据失败:', err)
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

  loadCelebrityData: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (!selectedCity) return

    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getHallOfFame',
      data: {
        city: selectedCity.city,
        type: 'celebrity'
      },
      success: res => {
        console.log('名人数据:', res)
        if (res.result && res.result.success) {
          const celebrityList = res.result.data || []
          this.setData({ celebrityList })
          this.applyFilter()
        } else {
          wx.showToast({
            title: res.result?.message || '获取数据失败',
            icon: 'none'
          })
        }
      },
      fail: err => {
        console.error('获取名人数据失败:', err)
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

  onPersonTap: function(e) {
    const { id, type } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/person-detail/person-detail?id=${id}&type=${type}`
    })
  },

  // 跳转到发布页面
  goToPublish: function() {
    wx.navigateTo({
      url: '/pages/publish-person/publish-person'
    })
  }
})
