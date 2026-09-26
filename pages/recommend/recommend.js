Page({
  data: {
    cityName: '',
    recommendList: [],
    loading: false
  },

  onLoad: function() {
    this.loadCityData()
    this.loadRecommendData()
  },

  loadCityData: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (selectedCity) {
      this.setData({
        cityName: selectedCity.city
      })
    }
  },

  loadRecommendData: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (!selectedCity) return

    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getRecommends',
      data: {
        city: selectedCity.city
      },
      success: res => {
        if (res.result && res.result.success) {
          this.setData({
            recommendList: res.result.data || []
          })
        }
      },
      complete: () => {
        this.setData({ loading: false })
      }
    })
  },

  onRecommendTap: function(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/recommend-detail/recommend-detail?id=' + id
    })
  }
})