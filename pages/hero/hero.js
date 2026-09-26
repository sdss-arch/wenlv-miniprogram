Page({
  data: {
    cityName: '',
    heroList: [],
    loading: false
  },

  onLoad: function() {
    this.loadCityData()
    this.loadHeroData()
  },

  loadCityData: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (selectedCity) {
      this.setData({
        cityName: selectedCity.city
      })
    }
  },

  loadHeroData: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (!selectedCity) return

    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getHeroes',
      data: {
        city: selectedCity.city
      },
      success: res => {
        if (res.result && res.result.success) {
          this.setData({
            heroList: res.result.data || []
          })
        }
      },
      complete: () => {
        this.setData({ loading: false })
      }
    })
  },

  onHeroTap: function(e) {
    const { id } = e.currentTarget.dataset
    wx.showToast({
      title: '英烈详情开发中',
      icon: 'none'
    })
  }
})