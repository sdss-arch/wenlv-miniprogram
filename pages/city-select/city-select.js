const app = getApp()

Page({
  data: {
    provinces: [
      {
        name: '河北省',
        cities: ['邯郸市', '石家庄市']
      }
    ],
    selectedProvince: '',
    selectedCity: '',
    availableCities: []
  },

  onLoad: function() {
    this.setData({
      selectedProvince: this.data.provinces[0].name,
      availableCities: this.data.provinces[0].cities
    })
  },

  onProvinceChange: function(e) {
    const index = e.detail.value
    const province = this.data.provinces[index]
    this.setData({
      selectedProvince: province.name,
      availableCities: province.cities,
      selectedCity: ''
    })
  },

  onCityChange: function(e) {
    const index = e.detail.value
    const city = this.data.availableCities[index]
    this.setData({
      selectedCity: city
    })
  },

  confirmCity: function() {
    const { selectedProvince, selectedCity } = this.data
    
    if (!selectedCity) {
      wx.showToast({
        title: '请选择城市',
        icon: 'none'
      })
      return
    }
    
    const cityData = {
      province: selectedProvince,
      city: selectedCity,
      fullName: `${selectedProvince}${selectedCity}`
    }
    
    wx.setStorageSync('selectedCity', cityData)
    
    this.updateUserCity(cityData)
  },

  updateUserCity: function(cityData) {
    const openid = wx.getStorageSync('openid')
    
    if (!openid) {
      wx.switchTab({
        url: '/pages/index/index'
      })
      return
    }
    
    wx.cloud.callFunction({
      name: 'updateUserCity',
      data: {
        city: cityData
      },
      success: res => {
        if (res.result && res.result.success) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      },
      fail: () => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    })
  }
})