const app = getApp()

Page({
  data: {
    type: 'red', // red 或 black
    shopName: '',
    category: '',
    categoryIndex: 0,
    categories: ['餐饮', '住宿', '景点', '美食', '购物', '其他'],
    satisfaction: '',
    reason: '',
    images: [],
    submitting: false,
    canSubmit: false
  },

  onLoad: function() {
    this.checkCity()
    this.checkCanSubmit()
  },

  // 检查城市选择
  checkCity: function() {
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
    }
  },

  // 选择榜单类型
  selectType: function(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ type })
  },

  // 店名输入
  onShopNameInput: function(e) {
    this.setData({ shopName: e.detail.value })
    this.checkCanSubmit()
  },

  // 分类选择
  onCategoryChange: function(e) {
    const index = e.detail.value
    this.setData({
      categoryIndex: index,
      category: this.data.categories[index]
    })
    this.checkCanSubmit()
  },

  // 满意度输入
  onSatisfactionInput: function(e) {
    let value = e.detail.value
    // 限制在0-100之间
    if (value > 100) value = 100
    if (value < 0) value = 0
    this.setData({ satisfaction: value })
    this.checkCanSubmit()
  },

  // 满意度滑块变化
  onSatisfactionChange: function(e) {
    this.setData({ satisfaction: e.detail.value.toString() })
    this.checkCanSubmit()
  },

  // 理由输入
  onReasonInput: function(e) {
    this.setData({ reason: e.detail.value })
    this.checkCanSubmit()
  },

  // 选择图片
  chooseImage: function() {
    const remainCount = 3 - this.data.images.length
    wx.chooseMedia({
      count: remainCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFiles = res.tempFiles
        tempFiles.forEach(file => {
          this.uploadImage(file.tempFilePath)
        })
      }
    })
  },

  // 上传图片
  uploadImage: function(filePath) {
    wx.showLoading({ title: '上传中...' })

    const cloudPath = `rankings/${Date.now()}-${Math.random().toString(36).substr(2, 6)}.jpg`
    
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success: res => {
        const images = this.data.images
        images.push(res.fileID)
        this.setData({ images })
        wx.hideLoading()
      },
      fail: err => {
        console.error('上传失败:', err)
        wx.hideLoading()
        wx.showToast({ title: '上传失败', icon: 'none' })
      }
    })
  },

  // 删除图片
  deleteImage: function(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.images
    images.splice(index, 1)
    this.setData({ images })
  },

  // 检查是否可以提交
  checkCanSubmit: function() {
    const { shopName, category, satisfaction, reason } = this.data
    const canSubmit = shopName.trim() && category && satisfaction !== '' && reason.trim()
    this.setData({ canSubmit })
  },

  // 提交表单
  submitForm: function() {
    if (!this.data.canSubmit || this.data.submitting) return

    const selectedCity = wx.getStorageSync('selectedCity')
    if (!selectedCity) {
      wx.showToast({ title: '请先选择城市', icon: 'none' })
      return
    }

    // 验证满意度范围
    const satisfaction = parseFloat(this.data.satisfaction)
    if (isNaN(satisfaction) || satisfaction < 0 || satisfaction > 100) {
      wx.showToast({ title: '满意度必须在0-100之间', icon: 'none' })
      return
    }

    this.setData({ submitting: true })

    const { type, shopName, category, reason, images } = this.data

    wx.cloud.callFunction({
      name: 'publishRanking',
      data: {
        city: selectedCity.city,
        type: type,
        shopName: shopName.trim(),
        category: category,
        satisfaction: satisfaction,
        reason: reason.trim(),
        images: images
      },
      success: res => {
        if (res.result && res.result.success) {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            complete: () => {
              setTimeout(() => wx.navigateBack(), 1500)
            }
          })
        } else {
          wx.showToast({
            title: res.result?.message || '发布失败',
            icon: 'none'
          })
          this.setData({ submitting: false })
        }
      },
      fail: err => {
        console.error('发布失败:', err)
        wx.showToast({ title: '网络错误', icon: 'none' })
        this.setData({ submitting: false })
      }
    })
  }
})
