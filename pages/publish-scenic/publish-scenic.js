const app = getApp()

Page({
  data: {
    cityName: '',
    form: {
      name: '',
      image: '',
      brief: '',
      description: '',
      rating: 5,
      tags: [],
      openTime: '',
      ticketPrice: '',
      address: ''
    },
    contentBlocks: [],
    tagInput: '',
    submitting: false,
    canSubmit: false
  },

  onLoad: function() {
    this.loadCityData()
    this.checkCanSubmit()
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

  // 检查是否可以提交
  checkCanSubmit: function() {
    const { form, contentBlocks } = this.data
    // 检查详情内容是否有文本
    const hasContent = contentBlocks.some(block => block.type === 'text' && block.content.trim())
    const canSubmit = form.name.trim() && form.image && form.brief.trim() && hasContent
    this.setData({ canSubmit })
  },

  // 评分选择
  onRatingTap: function(e) {
    const { rating } = e.currentTarget.dataset
    this.setData({
      'form.rating': rating
    })
  },

  // 标签输入
  onTagInput: function(e) {
    this.setData({ tagInput: e.detail.value })
  },

  // 添加标签
  addTag: function() {
    const { tagInput, form } = this.data
    const tag = tagInput.trim()
    
    if (!tag) {
      wx.showToast({ title: '请输入标签', icon: 'none' })
      return
    }
    
    if (form.tags.includes(tag)) {
      wx.showToast({ title: '标签已存在', icon: 'none' })
      return
    }
    
    if (form.tags.length >= 5) {
      wx.showToast({ title: '最多添加5个标签', icon: 'none' })
      return
    }
    
    this.setData({
      'form.tags': [...form.tags, tag],
      tagInput: ''
    })
  },

  // 删除标签
  removeTag: function(e) {
    const { index } = e.currentTarget.dataset
    const { tags } = this.data.form
    tags.splice(index, 1)
    this.setData({ 'form.tags': tags })
  },

  // 选择图片
  chooseImage: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.uploadImage(tempFilePath)
      }
    })
  },

  // 上传图片
  uploadImage: function(filePath) {
    wx.showLoading({ title: '上传中...' })
    
    const cloudPath = `scenic-images/${Date.now()}-${Math.random().toString(36).substr(2, 6)}.jpg`
    
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: (res) => {
        this.setData({
          'form.image': res.fileID
        }, () => {
          this.checkCanSubmit()
        })
        wx.showToast({ title: '上传成功', icon: 'success' })
      },
      fail: (err) => {
        console.error('上传失败:', err)
        wx.showToast({ title: '上传失败', icon: 'none' })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  // 删除图片
  deleteImage: function() {
    wx.showModal({
      title: '提示',
      content: '确定删除图片吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            'form.image': ''
          }, () => {
            this.checkCanSubmit()
          })
        }
      }
    })
  },

  // 添加第一个文本块
  addFirstTextBlock: function() {
    this.setData({
      contentBlocks: [{ type: 'text', content: '' }]
    })
  },

  // 内容块输入
  onContentBlockInput: function(e) {
    const { index } = e.currentTarget.dataset
    const { value } = e.detail
    const { contentBlocks } = this.data
    contentBlocks[index].content = value
    this.setData({ contentBlocks }, () => {
      this.checkCanSubmit()
    })
  },

  // 插入图片到内容
  insertImageToContent: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.uploadContentImage(tempFilePath)
      }
    })
  },

  // 上传内容图片
  uploadContentImage: function(filePath) {
    wx.showLoading({ title: '上传中...' })
    
    const cloudPath = `scenic-content/${Date.now()}-${Math.random().toString(36).substr(2, 6)}.jpg`
    
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: (res) => {
        const { contentBlocks } = this.data
        // 找到最后一个文本块
        const lastIndex = contentBlocks.length - 1
        
        // 如果最后一个块是文本且为空，则替换为图片
        if (lastIndex >= 0 && contentBlocks[lastIndex].type === 'text' && !contentBlocks[lastIndex].content.trim()) {
          contentBlocks[lastIndex] = { type: 'image', content: res.fileID }
        } else {
          // 否则添加新图片块
          contentBlocks.push({ type: 'image', content: res.fileID })
        }
        // 添加一个新的文本块
        contentBlocks.push({ type: 'text', content: '' })
        
        this.setData({ contentBlocks })
        wx.showToast({ title: '上传成功', icon: 'success' })
      },
      fail: (err) => {
        console.error('上传失败:', err)
        wx.showToast({ title: '上传失败', icon: 'none' })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  // 删除内容块
  deleteContentBlock: function(e) {
    const { index } = e.currentTarget.dataset
    const { contentBlocks } = this.data
    contentBlocks.splice(index, 1)
    this.setData({ contentBlocks }, () => {
      this.checkCanSubmit()
    })
  },

  // 预览图片
  previewBlockImage: function(e) {
    const { src } = e.currentTarget.dataset
    wx.previewImage({
      urls: [src],
      current: src
    })
  },

  // 将内容块转换为描述文本
  convertBlocksToDescription: function() {
    const { contentBlocks } = this.data
    let description = ''
    contentBlocks.forEach(block => {
      if (block.type === 'text' && block.content.trim()) {
        description += block.content + '\n'
      }
    })
    return description.trim()
  },

  // 提交表单
  submitForm: function() {
    const { form, cityName, contentBlocks } = this.data
    
    if (!form.name.trim()) {
      wx.showToast({ title: '请输入景点名称', icon: 'none' })
      return
    }
    
    if (!form.image) {
      wx.showToast({ title: '请上传景点图片', icon: 'none' })
      return
    }
    
    if (!form.brief.trim()) {
      wx.showToast({ title: '请输入景点简介', icon: 'none' })
      return
    }
    
    // 检查详情内容
    const hasContent = contentBlocks.some(block => block.type === 'text' && block.content.trim())
    if (!hasContent) {
      wx.showToast({ title: '请输入景点详情', icon: 'none' })
      return
    }
    
    // 转换描述
    const description = this.convertBlocksToDescription()
    
    this.setData({ submitting: true })
    
    wx.cloud.callFunction({
      name: 'publishScenic',
      data: {
        city: cityName,
        name: form.name.trim(),
        image: form.image,
        brief: form.brief.trim(),
        description: description,
        rating: form.rating,
        tags: form.tags,
        openTime: form.openTime.trim(),
        ticketPrice: form.ticketPrice.trim(),
        address: form.address.trim()
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
