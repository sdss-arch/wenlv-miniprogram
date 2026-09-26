Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  data: {
    provinces: [
      {
        name: '河北省',
        cities: ['邯郸市', '石家庄市']
      }
    ],
    provinceIndex: 0,
    cityIndex: -1,
    selectedProvince: '',
    selectedCity: '',
    availableCities: []
  },

  lifetimes: {
    attached: function() {
      this.setData({
        selectedProvince: this.data.provinces[0].name,
        availableCities: this.data.provinces[0].cities,
        provinceIndex: 0
      })
    }
  },

  methods: {
    stopPropagation: function() {
      // 阻止冒泡
    },

    close: function() {
      this.triggerEvent('close')
    },

    onProvinceChange: function(e) {
      const index = e.detail.value
      const province = this.data.provinces[index]
      this.setData({
        provinceIndex: index,
        selectedProvince: province.name,
        availableCities: province.cities,
        selectedCity: '',
        cityIndex: -1
      })
    },

    onCityChange: function(e) {
      const index = e.detail.value
      const city = this.data.availableCities[index]
      this.setData({
        cityIndex: index,
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

      // 保存到本地存储
      wx.setStorageSync('selectedCity', {
        province: selectedProvince,
        city: selectedCity
      })

      this.triggerEvent('confirm', {
        province: selectedProvince,
        city: selectedCity
      })

      this.close()
    }
  }
})