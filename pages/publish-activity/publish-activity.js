const app = getApp()

Page({
  data: {
    cityName: '',
    form: {
      title: '',
      category: '',
      sort: '9999',
      maxCount: '50',
      startTime: '',
      endTime: '',
      deadline: '',
      location: '',
      latitude: null,
      longitude: null,
      duration: '',
      cost: '',
      contactName: '',
      contactPhone: '',
      content: '',
      coverImages: []
    },
    submitting: false,
    canSubmit: false,
    categories: ['文旅活动', '旅行搭子', '体育活动', '读书活动', '亲子活动'],
    categoryIndex: -1,
    // 时间选择器数据
    startTimeArray: [],
    startTimeIndex: [0, 0, 0, 0, 0],
    endTimeArray: [],
    endTimeIndex: [0, 0, 0, 0, 0],
    deadlineArray: [],
    deadlineIndex: [0, 0, 0, 0, 0]
  },

  onLoad: function() {
    this.loadCityData()
    this.initTimePicker()
  },

  // 加载城市数据
  loadCityData: function() {
    const selectedCity = wx.getStorageSync('selectedCity')
    if (selectedCity) {
      this.setData({ cityName: selectedCity.city })
    } else {
      wx.showToast({
        title: '请先选择城市',
        icon: 'none',
        complete: () => {
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      })
    }
  },

  // 初始化时间选择器
  initTimePicker: function() {
    const years = []
    const months = []
    const days = []
    const hours = []
    const minutes = []

    const currentYear = new Date().getFullYear()
    for (let i = currentYear; i <= currentYear + 1; i++) {
      years.push(i + '年')
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i + '月')
    }
    for (let i = 1; i <= 31; i++) {
      days.push(i + '日')
    }
    for (let i = 0; i < 24; i++) {
      hours.push(i + '时')
    }
    for (let i = 0; i < 60; i += 5) {
      minutes.push(i + '分')
    }

    const timeArray = [years, months, days, hours, minutes]
    this.setData({
      startTimeArray: timeArray,
      endTimeArray: timeArray,
      deadlineArray: timeArray
    })
  },

  // 输入处理
  onInput: function(e) {
    const { field } = e.currentTarget.dataset
    const { value } = e.detail
    this.setData({
      [`form.${field}`]: value
    }, () => {
      this.checkCanSubmit()
    })
  },

  // 内容输入处理
  onContentInput: function(e) {
    const { value } = e.detail
    this.setData({
      'form.content': value
    }, () => {
      this.checkCanSubmit()
    })
  },

  // 检查是否可以提交
  checkCanSubmit: function() {
    const { form } = this.data
    const canSubmit = form.title.trim() &&
                      form.category &&
                      form.startTime &&
                      form.endTime &&
                      form.deadline &&
                      form.location.trim() &&
                      form.duration &&
                      form.cost !== '' &&
                      form.contactName.trim() &&
                      form.contactPhone.trim() &&
                      form.content &&
                      form.coverImages.length > 0
    this.setData({ canSubmit })
  },

  // 选择分类
  onCategoryChange: function(e) {
    const { categories } = this.data
    const index = e.detail.value
    this.setData({
      categoryIndex: index,
      'form.category': categories[index]
    }, () => {
      this.checkCanSubmit()
    })
  },

  // 开始时间选择
  onStartTimeChange: function(e) {
    const value = e.detail.value
    const timeStr = this.formatTimeFromPicker(value, this.data.startTimeArray)
    this.setData({
      startTimeIndex: value,
      'form.startTime': timeStr
    }, () => {
      this.checkCanSubmit()
    })
  },

  onStartTimeColumnChange: function(e) {
    const { column, value } = e.detail
    const startTimeIndex = [...this.data.startTimeIndex]
    startTimeIndex[column] = value
    this.setData({ startTimeIndex })
  },

  // 结束时间选择
  onEndTimeChange: function(e) {
    const value = e.detail.value
    const timeStr = this.formatTimeFromPicker(value, this.data.endTimeArray)
    this.setData({
      endTimeIndex: value,
      'form.endTime': timeStr
    }, () => {
      this.checkCanSubmit()
    })
  },

  onEndTimeColumnChange: function(e) {
    const { column, value } = e.detail
    const endTimeIndex = [...this.data.endTimeIndex]
    endTimeIndex[column] = value
    this.setData({ endTimeIndex })
  },

  // 截止时间选择
  onDeadlineChange: function(e) {
    const value = e.detail.value
    const timeStr = this.formatTimeFromPicker(value, this.data.deadlineArray)
    this.setData({
      deadlineIndex: value,
      'form.deadline': timeStr
    }, () => {
      this.checkCanSubmit()
    })
  },

  onDeadlineColumnChange: function(e) {
    const { column, value } = e.detail
    const deadlineIndex = [...this.data.deadlineIndex]
    deadlineIndex[column] = value
    this.setData({ deadlineIndex })
  },

  // 格式化时间
  formatTimeFromPicker: function(indexArray, timeArray) {
    const year = timeArray[0][indexArray[0]].replace('年', '')
    const month = timeArray[1][indexArray[1]].replace('月', '').padStart(2, '0')
    const day = timeArray[2][indexArray[2]].replace('日', '').padStart(2, '0')
    const hour = timeArray[3][indexArray[3]].replace('时', '').padStart(2, '0')
    const minute = timeArray[4][indexArray[4]].replace('分', '').padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
  },

  // 选择位置
  chooseLocation: function() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          'form.location': res.address + ' ' + res.name,
          'form.latitude': res.latitude,
          'form.longitude': res.longitude
        }, () => {
          this.checkCanSubmit()
        })
      },
      fail: () => {
        wx.showToast({ title: '选择位置失败', icon: 'none' })
      }
    })
  },

  // 选择图片
  chooseImage: function() {
    const { form } = this.data
    const remainCount = 8 - form.coverImages.length

    wx.chooseMedia({
      count: remainCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFiles = res.tempFiles
        this.uploadImages(tempFiles)
      }
    })
  },

  // 上传图片
  uploadImages: function(tempFiles) {
    wx.showLoading({ title: '上传中...' })

    const uploadPromises = tempFiles.map(file => {
      return new Promise((resolve, reject) => {
        const cloudPath = `activity-cover/${Date.now()}-${Math.random().toString(36).substr(2, 6)}.jpg`
        wx.cloud.uploadFile({
          cloudPath,
          filePath: file.tempFilePath,
          success: (res) => resolve(res.fileID),
          fail: reject
        })
      })
    })

    Promise.all(uploadPromises)
      .then(fileIDs => {
        const { form } = this.data
        this.setData({
          'form.coverImages': [...form.coverImages, ...fileIDs]
        }, () => {
          this.checkCanSubmit()
        })
        wx.showToast({ title: '上传成功', icon: 'success' })
      })
      .catch(err => {
        console.error('上传失败:', err)
        wx.showToast({ title: '上传失败', icon: 'none' })
      })
      .finally(() => {
        wx.hideLoading()
      })
  },

  // 预览图片
  previewImage: function(e) {
    const { url } = e.currentTarget.dataset
    const { form } = this.data
    wx.previewImage({
      urls: form.coverImages,
      current: url
    })
  },

  // 删除图片
  deleteImage: function(e) {
    const { index } = e.currentTarget.dataset
    const { form } = this.data
    const newImages = [...form.coverImages]
    newImages.splice(index, 1)
    this.setData({
      'form.coverImages': newImages
    }, () => {
      this.checkCanSubmit()
    })
  },

  // 提交表单
  submitForm: function() {
    const { form, cityName } = this.data

    // 表单验证
    if (!form.title.trim()) {
      wx.showToast({ title: '请输入标题', icon: 'none' })
      return
    }
    if (!form.category) {
      wx.showToast({ title: '请选择分类', icon: 'none' })
      return
    }
    if (!form.startTime) {
      wx.showToast({ title: '请选择活动开始时间', icon: 'none' })
      return
    }
    if (!form.endTime) {
      wx.showToast({ title: '请选择活动结束时间', icon: 'none' })
      return
    }
    if (!form.deadline) {
      wx.showToast({ title: '请选择报名截止时间', icon: 'none' })
      return
    }
    if (!form.location.trim()) {
      wx.showToast({ title: '请输入活动地点', icon: 'none' })
      return
    }
    if (!form.duration) {
      wx.showToast({ title: '请输入预计时长', icon: 'none' })
      return
    }
    if (form.cost === '') {
      wx.showToast({ title: '请输入活动费用', icon: 'none' })
      return
    }
    if (!form.contactName.trim()) {
      wx.showToast({ title: '请输入负责人姓名', icon: 'none' })
      return
    }
    if (!form.contactPhone.trim()) {
      wx.showToast({ title: '请输入负责人联系方式', icon: 'none' })
      return
    }
    if (!form.content) {
      wx.showToast({ title: '请填写活动内容', icon: 'none' })
      return
    }
    if (form.coverImages.length === 0) {
      wx.showToast({ title: '请上传活动封面', icon: 'none' })
      return
    }

    this.setData({ submitting: true })

    wx.cloud.callFunction({
      name: 'publishActivity',
      data: {
        city: cityName,
        title: form.title.trim(),
        category: form.category,
        sort: parseInt(form.sort) || 9999,
        maxCount: parseInt(form.maxCount) || 0,
        startTime: form.startTime,
        endTime: form.endTime,
        deadline: form.deadline,
        location: form.location.trim(),
        latitude: form.latitude,
        longitude: form.longitude,
        duration: form.duration,
        cost: form.cost,
        contactName: form.contactName.trim(),
        contactPhone: form.contactPhone.trim(),
        content: form.content,
        coverImages: form.coverImages
      },
      success: (res) => {
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
        }
      },
      fail: (err) => {
        console.error('发布失败:', err)
        wx.showToast({ title: '发布失败', icon: 'none' })
      },
      complete: () => {
        this.setData({ submitting: false })
      }
    })
  }
})
