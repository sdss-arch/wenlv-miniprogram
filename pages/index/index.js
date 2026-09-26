const app = getApp()

Page({
  data: {
    cityName: '',
    bannerImage: '',
    showCityPicker: false,
    functionList: [
      { id: 1, name: '名人', icon: '/images/menu/名人.png', path: '/pages/celebrity/celebrity' },
      { id: 2, name: '黑红榜', icon: '/images/menu/黑红榜.png', path: '/pages/avoid/avoid' },
      { id: 3, name: '方言库', icon: '/images/menu/方言库.png', path: '/pages/dialect/dialect' },
      { id: 4, name: '文创', icon: '/images/menu/文创.png', path: '/pages/creative/creative' },
      { id: 5, name: '留言', icon: '/images/menu/留言板.png', path: '/pages/message/message' }
    ],
    activities: [],
    travelGuides: [],
    travelGuidesLeft: [],
    travelGuidesRight: [],
    scenicList: []
  },

  onLoad: function() {
    this.checkAndShowCityPicker()
  },

  onShow: function() {
    this.loadCityData()
    // 先尝试从缓存加载
    this.loadFromCache()
    // 并行加载最新数据，提高效率
    Promise.all([
      this.loadActivities(),
      this.loadTravelGuides(),
      this.loadScenicList()
    ]).then(() => {
      // 数据加载完成后保存到缓存
      this.saveToCache()
    })
  },

  // 检查是否需要显示城市选择弹窗
  checkAndShowCityPicker: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (!selectedCity) {
      // 未选择城市，显示弹窗
      this.setData({
        showCityPicker: true
      })
    } else {
      this.loadCityData()
    }
  },

  // 关闭城市选择弹窗
  onCityPickerClose: function() {
    this.setData({
      showCityPicker: false
    })
  },

  // 确认选择城市
  onCityPickerConfirm: function(e) {
    const { city } = e.detail
    this.setData({
      cityName: city
    })
    this.loadBannerImage(city)
    // 重新加载数据
    Promise.all([
      this.loadActivities(),
      this.loadTravelGuides(),
      this.loadScenicList()
    ]).then(() => {
      this.saveToCache()
    })
  },

  // 从缓存加载数据
  loadFromCache: function() {
    const cache = wx.getStorageSync('homeData')
    if (cache && cache.timestamp) {
      // 缓存5分钟内有效
      if (Date.now() - cache.timestamp < 5 * 60 * 1000) {
        this.setData({
          activities: cache.activities || [],
          travelGuides: cache.travelGuides || [],
          travelGuidesLeft: cache.travelGuidesLeft || [],
          travelGuidesRight: cache.travelGuidesRight || [],
          scenicList: cache.scenicList || []
        })
      }
    }
  },

  // 保存数据到缓存
  saveToCache: function() {
    const data = this.data
    wx.setStorageSync('homeData', {
      activities: data.activities,
      travelGuides: data.travelGuides,
      travelGuidesLeft: data.travelGuidesLeft,
      travelGuidesRight: data.travelGuidesRight,
      scenicList: data.scenicList,
      timestamp: Date.now()
    })
  },

  loadCityData: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (selectedCity) {
      this.setData({
        cityName: selectedCity.city
      })
      this.loadBannerImage(selectedCity.city)
    }
  },

  loadBannerImage: function(city) {
    // 固定使用统一的宣传图，不随城市变化
    this.setData({
      bannerImage: '/images/banner/handan.jpg'
    })
  },

  loadActivities: function() {
    return new Promise((resolve) => {
      const selectedCity = wx.getStorageSync('selectedCity')
      if (!selectedCity) {
        resolve()
        return
      }

      wx.cloud.callFunction({
        name: 'getActivities',
        data: {
          city: selectedCity.city,
          limit: 4
        },
        success: res => {
          if (res.result && res.result.success) {
            this.setData({
              activities: res.result.data || []
            })
          }
          resolve()
        },
        fail: () => resolve()
      })
    })
  },

  loadTravelGuides: function() {
    return new Promise((resolve) => {
      const selectedCity = wx.getStorageSync('selectedCity')
      if (!selectedCity) {
        resolve()
        return
      }

      wx.cloud.callFunction({
        name: 'getTravelGuides',
        data: {
          city: selectedCity.city,
          limit: 6
        },
        success: res => {
          if (res.result && res.result.success) {
            const guides = res.result.data || []
            // 分成左右两列
            const left = []
            const right = []
            guides.forEach((item, index) => {
              if (index % 2 === 0) {
                left.push(item)
              } else {
                right.push(item)
              }
            })
            this.setData({
              travelGuides: guides,
              travelGuidesLeft: left,
              travelGuidesRight: right
            })
          }
          resolve()
        },
        fail: () => resolve()
      })
    })
  },

  onFunctionTap: function(e) {
    const { path } = e.currentTarget.dataset
    wx.navigateTo({
      url: path
    })
  },

  onActivityTap: function(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/activity-detail/activity-detail?id=' + id
    })
  },

  onGuideTap: function(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/guide-detail/guide-detail?id=' + id
    })
  },

  loadScenicList: function() {
    return new Promise((resolve) => {
      const selectedCity = wx.getStorageSync('selectedCity')
      if (!selectedCity) {
        resolve()
        return
      }

      wx.cloud.callFunction({
        name: 'getScenics',
        data: {
          city: selectedCity.city,
          limit: 4
        },
        success: res => {
          if (res.result && res.result.success) {
            this.setData({
              scenicList: res.result.data || []
            })
          }
          resolve()
        },
        fail: () => resolve()
      })
    })
  },

  onScenicTap: function(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/scenic-detail/scenic-detail?id=' + id
    })
  },

  goToScenics: function() {
    wx.navigateTo({
      url: '/pages/scenic/scenic'
    })
  },

  goToGuides: function() {
    wx.switchTab({
      url: '/pages/travel-guide/travel-guide'
    })
  },

  goToActivities: function() {
    wx.switchTab({
      url: '/pages/activity/activity'
    })
  }
})