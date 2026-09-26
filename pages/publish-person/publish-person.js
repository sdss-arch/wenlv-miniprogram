const app = getApp()

Page({
  data: {
    personType: 'martyr', // martyr 或 celebrity
    photoUrl: '',
    name: '',
    introduction: '',
    experience: '',
    submitting: false,
    canSubmit: false
  },

  onLoad: function() {
    this.checkCity()
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

  // 选择类型
  selectType: function(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      personType: type
    })
    this.checkCanSubmit()
  },

  // 选择照片
  choosePhoto: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.uploadPhoto(tempFilePath)
      }
    })
  },

  // 上传照片到云存储
  uploadPhoto: function(filePath) {
    wx.showLoading({
      title: '上传中...'
    })

    const cloudPath = `persons/${Date.now()}-${Math.random().toString(36).substr(2, 6)}.jpg`
    
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success: res => {
        this.setData({
          photoUrl: res.fileID
        })
        this.checkCanSubmit()
        wx.hideLoading()
      },
      fail: err => {
        console.error('上传失败:', err)
        wx.hideLoading()
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    })
  },

  // 输入姓名
  onNameInput: function(e) {
    this.setData({
      name: e.detail.value
    })
    this.checkCanSubmit()
  },

  // 输入介绍
  onIntroInput: function(e) {
    this.setData({
      introduction: e.detail.value
    })
    this.checkCanSubmit()
  },

  // 输入经历
  onExperienceInput: function(e) {
    this.setData({
      experience: e.detail.value
    })
    this.checkCanSubmit()
  },

  // 检查是否可以提交
  checkCanSubmit: function() {
    const { photoUrl, name, introduction, experience } = this.data
    const canSubmit = photoUrl && name.trim() && introduction.trim() && experience.trim()
    this.setData({
      canSubmit: canSubmit
    })
  },

  // 提交表单
  submitForm: function() {
    if (!this.data.canSubmit || this.data.submitting) {
      return
    }

    const selectedCity = wx.getStorageSync('selectedCity')
    if (!selectedCity) {
      wx.showToast({
        title: '请先选择城市',
        icon: 'none'
      })
      return
    }

    this.setData({
      submitting: true
    })

    const { personType, photoUrl, name, introduction, experience } = this.data

    wx.cloud.callFunction({
      name: 'publishPerson',
      data: {
        city: selectedCity.city,
        type: personType,
        photo: photoUrl,
        name: name.trim(),
        introduction: introduction.trim(),
        experience: experience.trim()
      },
      success: res => {
        if (res.result && res.result.success) {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            complete: () => {
              setTimeout(() => {
                wx.navigateBack()
              }, 1500)
            }
          })
        } else {
          wx.showToast({
            title: res.result?.message || '发布失败',
            icon: 'none'
          })
          this.setData({
            submitting: false
          })
        }
      },
      fail: err => {
        console.error('发布失败:', err)
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
        this.setData({
          submitting: false
        })
      }
    })
  }
})
