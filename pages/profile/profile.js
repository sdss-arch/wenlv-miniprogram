const app = getApp()

Page({
  data: {
    userInfo: null,
    cityName: '',
    showCityPicker: false,
    menuList: [
      { id: 1, name: '我的活动', icon: '📅', action: 'myActivities', bgColor: '#E3F2FD' },
      { id: 2, name: '我的攻略', icon: '📝', action: 'myGuides', bgColor: '#E8F5E9' },
      { id: 3, name: '我的收藏', icon: '⭐', action: 'myFavorites', bgColor: '#FFF3E0' },
      { id: 4, name: '我的留言', icon: '💬', action: 'myMessages', bgColor: '#F3E5F5' }
    ]
  },

  onLoad: function() {
    this.loadUserInfo()
    this.loadCityData()
  },

  onShow: function() {
    this.loadUserInfo()
    this.loadCityData()
  },

  loadUserInfo: function() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
  },

  loadCityData: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (selectedCity) {
      this.setData({
        cityName: selectedCity.city
      })
    }
  },

  onMenuTap: function(e) {
    const { action } = e.currentTarget.dataset
    
    const actionMap = {
      'myActivities': () => wx.showToast({ title: '我的活动开发中', icon: 'none' }),
      'myGuides': () => wx.showToast({ title: '我的攻略开发中', icon: 'none' }),
      'myFavorites': () => wx.showToast({ title: '我的收藏开发中', icon: 'none' }),
      'myMessages': () => wx.showToast({ title: '我的留言开发中', icon: 'none' }),
      'about': () => wx.navigateTo({ url: '/pages/about/about' })
    }
    
    if (actionMap[action]) {
      actionMap[action]()
    }
  },

  onChangeCity: function() {
    this.setData({
      showCityPicker: true
    })
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
    wx.showToast({
      title: '已切换到' + city,
      icon: 'none'
    })
  },

  onRefreshUserInfo: function() {
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        if (res.result && res.result.success) {
          wx.setStorageSync('userInfo', res.result.userInfo)
          this.setData({
            userInfo: res.result.userInfo
          })
          wx.showToast({
            title: '刷新成功',
            icon: 'success'
          })
        }
      }
    })
  },

  stopPropagation: function() {}
})
