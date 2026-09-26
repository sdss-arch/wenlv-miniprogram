Page({
  data: {
    cityName: '',
    creativeList: [],
    loading: false
  },

  onLoad: function() {
    this.loadCityData()
    this.loadCreativeData()
  },

  loadCityData: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (selectedCity) {
      this.setData({
        cityName: selectedCity.city
      })
    }
  },

  loadCreativeData: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (!selectedCity) return

    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getCreatives',
      data: {
        city: selectedCity.city
      },
      success: res => {
        if (res.result && res.result.success) {
          this.setData({
            creativeList: res.result.data || []
          })
        }
      },
      complete: () => {
        this.setData({ loading: false })
      }
    })
  },

  onCreativeTap: function(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/creative-detail/creative-detail?id=' + id
    })
  }
})